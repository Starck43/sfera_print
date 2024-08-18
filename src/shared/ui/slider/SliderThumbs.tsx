import React from "react"
import Image from "next/image"
import type {Swiper as SwiperCore} from 'swiper/types'

import type {Media} from "@/components/post"
import {classnames} from "@/shared/lib/helpers/classnames"

import cls from './Slider.module.sass'


interface ThumbsProps {
	media: Media[]
	activeIndex: number
	swiperRef: React.RefObject<SwiperCore> | undefined
}

const SliderThumbs = ({media, activeIndex, swiperRef}: ThumbsProps) => {
	const handleThumbClick = (index: number) => {
        swiperRef?.current?.slideTo(index) // Переключение на слайд с указанным индексом
    }
	return (
		<div className={cls.thumbs__container}>
			{media?.map((item, idx) => (
				<div
					key={'thumb-' + idx + '_' + item.id}
					className={classnames(cls, ['thumb', idx === activeIndex ? 'active' : undefined])}
					onClick={() => handleThumbClick(idx)}
				>
					<Image
						src={typeof item.image === 'object' && 'src' in item.image ? item.image.src : item.image}
						alt={item.title}
						width={150}
						height={150}
						quality={75}
						onLoad={(e) => e.currentTarget.style.opacity = '1'}
						className={cls.image}
					/>
				</div>
			))}
		</div>
	)
}

export default SliderThumbs