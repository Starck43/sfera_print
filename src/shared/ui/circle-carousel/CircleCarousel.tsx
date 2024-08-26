'use client'

import React, {memo, SyntheticEvent, useCallback, useRef, useState} from 'react'
import {useRouter} from "next/navigation"
import NextImage from "next/image"

import {classnames} from "@/shared/lib/helpers/classnames"
import {Col} from "@/shared/ui/stack"
import CarouselNav from "./CarouselNav"

import cls from './CircleCarousel.module.sass'

interface CarouselItemProps {
	id: number
	slug: string
	path: string
	title: string
	excerpt: string
	cover: string
}

interface CarouselProps<T extends CarouselItemProps> {
	items: T[]
	duration: number
	loopDuration: number
	infinite?: boolean
}

const CircleCarousel = <T extends CarouselItemProps, >(props: CarouselProps<T>) => {
	const router = useRouter()

	const {items, duration, loopDuration, infinite = false} = props
	const currentSlide = useRef(0)
	const slidesRef = useRef<HTMLDivElement | null>(null)
	const [firstLoaded, _] = useState(true)

	const showDetailPage = useCallback((index: number) => {
		const route = items?.[index]?.path || '/' as string
		router.push(route)
	}, [items, router])

	const onCarouselContentClick = useCallback((e: SyntheticEvent) => {
		const target = e.target as Node
		if (target.nodeName === 'circle') {
			e.preventDefault()
		} else {
			showDetailPage(currentSlide?.current || 0)
		}
	}, [showDetailPage])

	const handleOnSlideChange = useCallback((index: number = 0) => {
		currentSlide.current = index
		const slides = slidesRef.current
		const activeSlide = slides?.children[index]
		const prevSlide = slides?.children[(index - 1 + items.length) % items.length]
		prevSlide?.classList.remove(cls.active)
		activeSlide?.classList.add(cls.active)
	}, [items.length])


	const onLoadImage = (e: SyntheticEvent<HTMLImageElement>, index: number) => {
		e.currentTarget.style.opacity = '1'
		const nextSlide = (index + 1) % items.length
		const nextImage = new Image()
		nextImage.src = items[nextSlide]?.cover || ''
	}

	return (
		<div className={cls.carousel} onClick={(e) => onCarouselContentClick(e)}>
			<div className={cls.slides} ref={slidesRef}>
				{items?.map((item, idx) => (
					<Col
						align='center'
						justify='between'
						wrap={false}
						gap='md'
						key={'carousel_slide-' + idx}
						className={classnames(cls, ['item', firstLoaded && idx === 0 ? 'active' : ''])}
						style={{
							transition: `opacity ${duration}ms linear`
						}}
					>
						{item.cover &&
                            <NextImage
                                src={item.cover}
                                alt={item.title}
                                sizes='100%'
                                fill
                                priority
                                className={cls.cover}
                                style={{
									opacity: 0,
									transition: `opacity ${duration}ms linear`
								}}
                                onLoad={(e) => onLoadImage(e, idx)}
                            />
						}
						<p className={cls.title}>{item.title}</p>
						<div dangerouslySetInnerHTML={{__html: item?.excerpt || ''}} className={cls.excerpt}/>

					</Col>
				))}
			</div>

			<CarouselNav
				steps={5}
				loopDuration={loopDuration}
				infinite={infinite}
				onDotClick={showDetailPage}
				handleOnStepChange={handleOnSlideChange}
			/>
		</div>
	)
}

export default memo(CircleCarousel)
