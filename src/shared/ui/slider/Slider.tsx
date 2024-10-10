'use client'

import React, { CSSProperties, ReactNode, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperCore } from 'swiper/types'
import { EffectFade } from 'swiper/modules'
import Player from 'next-video/player'

import { classnames } from '@/shared/lib/helpers/classnames'
import { getDeviceSrc } from '@/shared/lib/helpers/image'
import { useWindowDimensions } from '@/shared/lib/hooks/useWindowDimensions'
import { Section } from '@/shared/ui/section'

import type { Media } from '@/components/post'
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

    const sliderContent = useMemo(
        () => (
            <div className={cls.slider__container}>
                <div
                    className={classnames(cls, [
                        'slider__wrapper',
                        media.length === 1 && !media[0].image_portrait ? 'landscape' : ''
                    ])}
                >
                    <Swiper
                        modules={[EffectFade]}
                        effect="fade"
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={media?.length > 1}
                        lazyPreloadPrevNext={1}
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
                                const imageSrc = getDeviceSrc(
                                    orientation === 'portrait' && image_portrait
                                        ? image_portrait
                                        : image
                                )

                                if (!imageSrc) return null

                                return (
                                    <SwiperSlide key={'slide-' + idx + '_' + id}>
                                        {link ||
                                        video ||
                                        (orientation === 'portrait' && video_portrait) ? (
                                            <Player
                                                src={
                                                    link || orientation === 'portrait'
                                                        ? video_portrait
                                                        : video
                                                }
                                                poster={imageSrc}
                                                muted
                                                style={{
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                            >
                                                <style>{`
                                                    :root {--media-range-track-height: 2px; --media-primary-color: var(--white-color);--media-accent-color: var(--secondary-color);}
                                                    ::part(center) {--media-control-background: rgba(0,0,0, 0.5) !important;padding: 0.8rem; border-radius: 50%; width: var(--controls-width); height: var(--controls-width);}
                                                    ::part(play) {--media-button-icon-transform: 0; --media-icon-color: var(--secondary-color) !important; transition: all 150ms ease-out !important;} 
                                                    ::part(play):hover {--media-icon-color: inherit !important; background-color: var(--secondary-color) !important;} 
                                                    ::part(seek-backward), ::part(seek-forward) {display: none;}
            									`}</style>
                                            </Player>
                                        ) : (
                                            <Image
                                                src={imageSrc}
                                                //srcSet={'srcset' in image && image.srcset.length ? createSrcSet(image.srcset) : undefined}
                                                alt={title}
                                                fill
                                                quality={85}
                                                onLoad={(e) =>
                                                    (e.currentTarget.style.opacity = '1')
                                                }
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
        ),
        [media, orientation]
    )

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
