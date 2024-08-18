'use client'

import React, {CSSProperties, ReactNode, useMemo, useRef, useState} from "react"
import Image from "next/image"
import {Swiper, SwiperSlide} from 'swiper/react'
import type {Swiper as SwiperCore} from 'swiper/types'
import {EffectFade} from "swiper/modules"
import Player from 'next-video/player'

import {classnames} from "@/shared/lib/helpers/classnames"
import {useWindowDimensions} from "@/shared/lib/hooks/useWindowDimensions"
import {Section} from "@/shared/ui/section"
import type {Media} from "@/components/post"

import SliderThumbs from "./SliderThumbs"
import SliderControls from "./SliderControls"

import 'swiper/css'
import "swiper/css/effect-fade"
import cls from './Slider.module.sass'


export type ContentPosition = 'header' | 'footer'

interface SliderProps {
	media: Media[]
	childrenPosition?: ContentPosition
	children?: ReactNode
	className?: string
	style?: CSSProperties

}

function getDeviceSrc(image: Media['image']): string {
	return typeof image === 'object' && 'src' in image ? image.src : image
}

export const Slider = (props: SliderProps) => {
	const {
		media,
		childrenPosition = 'header',
		children = null,
		className,
		style
	} = props
	const swiperRef = useRef<SwiperCore | null>(null)
	const [thumbsIndex, setThumbsIndex] = useState(0)
	const {orientation} = useWindowDimensions()

	const innerContent = useMemo(() => children, [children])

	const sliderContent = useMemo(() => (
		<div className={cls.slider__container}>
			<div className={cls.slider__wrapper}>
				<Swiper
					modules={[EffectFade]}
					effect='fade'
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
					{media?.map((item, idx) => (
						<SwiperSlide key={'slide-' + idx + '_' + item.id}>
							{item?.video || (orientation === 'portrait' && item?.video_portrait)
								? <Player
									src={orientation === 'portrait' ? item.video_portrait : item.video}
									poster={getDeviceSrc(orientation === 'portrait' && item?.image_portrait ? item.image_portrait : item.image)}
									muted
									style={{width: '100%', height: '100%'}}
								>
									<style>{'/src/app/styles/third-party/video-player.css'}</style>
								</Player>

								: <Image
									src={getDeviceSrc(orientation === 'portrait' && item?.image_portrait ? item.image_portrait : item.image)}
									//srcSet={'srcset' in item.image && item.image.srcset.length ? createSrcSet(item.image.srcset) : undefined}
									alt={item.title}
									fill
									quality={85}
									onLoad={(e) => e.currentTarget.style.opacity = '1'}
									className={cls.image}
								/>
							}
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			{
				media?.length > 1 && <SliderControls
                    onClickNext={() => swiperRef.current?.slideNext()}
                    onClickPrev={() => swiperRef.current?.slidePrev()}
                />
			}
		</div>
	), [media, orientation])

	return (
		<Section
			gap="sm"
			align='start'
			className={classnames(cls, ['section'], {}, [className])}
			style={style}
		>
			{childrenPosition === 'header' && innerContent}
			{
				swiperRef && media?.length > 1 &&
                <SliderThumbs media={media} activeIndex={thumbsIndex} swiperRef={swiperRef}/>
			}
			{media?.length ? sliderContent : null}
			{childrenPosition === 'footer' && innerContent}
		</Section>

	)
}