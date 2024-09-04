'use client'

import React, {memo, SyntheticEvent, useCallback, useRef, useState} from 'react'
import {useRouter} from "next/navigation"
import NextImage from "next/image"

import type {PostType} from "@/components/post"
import {classnames} from "@/shared/lib/helpers/classnames"
import {useFetch} from "@/shared/lib/hooks/useFetch"

import {Col} from "@/shared/ui/stack"

import CarouselNav from "./CarouselNav"

import cls from './CircleCarousel.module.sass'


interface CarouselProps {
	duration: number
	loopDuration: number
	infinite?: boolean
}

const CircleCarousel = ({duration, loopDuration, infinite = false}: CarouselProps) => {
	const {data: items} = useFetch<PostType[]>('features')

	const router = useRouter()
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
		if (!items) return

		currentSlide.current = index
		const slides = slidesRef.current
		const activeSlide = slides?.children[index]
		const prevSlide = slides?.children[(index - 1 + items.length) % items.length]
		prevSlide?.classList.remove(cls.active)
		activeSlide?.classList.add(cls.active)
	}, [items])


	const onLoadImage = (e: SyntheticEvent<HTMLImageElement>, index: number) => {
		if (!items) return

		e.currentTarget.style.opacity = '1'
		const nextSlide = (index + 1) % items?.length
		const nextImage = new Image()
		nextImage.src = items[nextSlide]?.cover || '' as any
	}

	if (!items) return null

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
                                src={item.cover as string}
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
						<div className={cls.title}>{item.title}</div>
						<p className={cls.excerpt}>{item?.excerpt || ''}</p>

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
