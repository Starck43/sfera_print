'use client'

import React, { CSSProperties, ReactNode, useMemo, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperCore } from 'swiper/types'
import { EffectFade } from 'swiper/modules'

import type { Media } from '@/components/post'

import { classnames } from '@/shared/lib/helpers/classnames'
import { getDeviceImage } from '@/shared/lib/helpers/image'
import { useWindowDimensions } from '@/shared/lib/hooks/useWindowDimensions'

import { Section } from '@/shared/ui/section'
import { LazyImage } from '@/shared/ui/lazy-image'
import { VideoPlayer } from '@/shared/ui/video-player'

import SliderThumbs from './SliderThumbs'

import SliderControls from './SliderControls'
import 'swiper/css'
import 'swiper/css/effect-fade'
import cls from './Slider.module.sass'

export type ContentPosition = 'header' | 'footer'

interface SliderProps {
    media: Media[]
    childrenPosition?: ContentPosition
    children?: ReactNode
    className?: string
    style?: CSSProperties
}

export const Slider = (props: SliderProps) => {
    const { media, childrenPosition = 'header', children = null, className, style } = props
    const swiperRef = useRef<SwiperCore | null>(null)
    const [thumbsIndex, setThumbsIndex] = useState(0)
    const { orientation } = useWindowDimensions()

    const innerContent = useMemo(() => children, [children])

    const sliderContent = useMemo(() => {
        if (!media) return null

        return (
            <div className={cls.slider__container}>
                <div className={classnames(cls, ['slider__wrapper'])}>
                    <Swiper
                        modules={[EffectFade]}
                        effect="fade"
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={media?.length > 1}
                        lazyPreloadPrevNext={2}
                        onBeforeInit={(swiper) => {
                            swiperRef.current = swiper
                        }}
                        onSlideChange={(swiper) => {
                            setThumbsIndex(swiper.realIndex)
                        }}
                        className={cls.slider}
                    >
                        {media?.map(
                            (
                                { id, title, link, image, image_portrait, video, video_portrait },
                                idx
                            ) => {
                                const imageSrc = getDeviceImage(
                                    orientation === 'portrait' && image_portrait
                                        ? image_portrait
                                        : image
                                )

                                let videoSrc = link || video || video_portrait
                                if (video_portrait && orientation === 'portrait') {
                                    videoSrc = video_portrait
                                }

                                if (!imageSrc.src) return null

                                return (
                                    <SwiperSlide
                                        key={'slide-' + idx + '_' + id}
                                        className={classnames(cls, [
                                            'slide',
                                            orientation === 'portrait' && image_portrait
                                                ? 'portrait'
                                                : '',
                                            media.length === 1 && (image || image_portrait)
                                                ? 'with_one_image'
                                                : ''
                                        ])}
                                    >
                                        {videoSrc ? (
                                            <VideoPlayer
                                                src={videoSrc}
                                                poster={imageSrc.src}
                                                autoPlay
                                                controls={false}
                                            />
                                        ) : (
                                            <LazyImage
                                                src={imageSrc.src}
                                                srcSet={imageSrc.srcSet}
                                                unoptimized={!!imageSrc.srcSet?.length}
                                                width={orientation === 'portrait' ? 1080 : 1920}
                                                height={orientation === 'portrait' ? 1920 : 1080}
                                                alt={title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                                className={cls.image}
                                            />
                                        )}
                                    </SwiperSlide>
                                )
                            }
                        )}
                    </Swiper>
                </div>

                {media?.length > 1 && (
                    <SliderControls
                        onClickNext={() => swiperRef.current?.slideNext()}
                        onClickPrev={() => swiperRef.current?.slidePrev()}
                    />
                )}
            </div>
        )
    }, [media, orientation])

    return (
        <Section
            gap="sm"
            align="start"
            className={classnames(cls, ['section'], {}, [className])}
            style={style}
        >
            {childrenPosition === 'header' && innerContent}
            {swiperRef && media?.length > 1 && (
                <SliderThumbs media={media} activeIndex={thumbsIndex} swiperRef={swiperRef} />
            )}

            {media?.length ? sliderContent : null}

            {childrenPosition === 'footer' && innerContent}
        </Section>
    )
}
