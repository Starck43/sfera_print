'use client'

import React, {memo} from 'react'
import Image from "next/image"
import {Swiper, SwiperSlide} from 'swiper/react'
import {Autoplay} from 'swiper/modules'

import {Col} from "@/shared/ui/stack"

import 'swiper/css'
import cls from './BrandSlider.module.sass'

type Brand = {
	name?: string
	logo?: string | null
}

const BrandSlider = <T,>({items}: {items: Partial<T>[]}) => {
	return (
		<Swiper
			modules={[Autoplay]}
			freeMode={
				{
					enabled: true,
					sticky: true
				}
			}
			mousewheel={
				{
					enabled: true,
					forceToAxis: true
				}
			}
			autoplay={{
				delay: 2000,
				pauseOnMouseEnter: true,
			}}
			slidesPerView={3}
			spaceBetween={10}
			speed={3500}
			loop={items.length > 3}
			breakpoints={{
				576: {
					slidesPerView: 4,
					loop: items.length > 4
				},
				786: {
					slidesPerView: 5,
					loop: items.length > 5
				},
				992: {
					slidesPerView: 4,
					loop: items.length > 4
				},
				1200: {
					slidesPerView: 6,
					loop: items.length > 6
				}
			}}
			className={cls.slider}
		>
			{items?.map(({logo, name}: Brand, idx) => (
				<SwiperSlide key={'slide-' + idx} className={cls.slide}>
					<Col justify='center' align='center' className={cls.brand}>
						{logo && <Image src={logo} alt={name || 'Логотип партнера'} sizes='100vw' fill/>}
					</Col>
				</SwiperSlide>
			))}
		</Swiper>
	)
}

export default memo(BrandSlider)