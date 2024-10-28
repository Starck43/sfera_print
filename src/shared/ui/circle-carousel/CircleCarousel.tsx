'use client'

import React, { memo, SyntheticEvent, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'

import { useNavigation } from '@/shared/lib/providers/NavigationProvider'
import type { PostType } from '@/components/post'
import { classnames } from '@/shared/lib/helpers/classnames'
import { useFetch } from '@/shared/lib/hooks/useFetch'

import { Col } from '@/shared/ui/stack'

import CarouselNav from './CarouselNav'

import cls from './CircleCarousel.module.sass'

interface CarouselProps {
    itemsLength: number
    duration: number
    slideDuration: number
    infinite?: boolean
}

const CircleCarousel = ({
    itemsLength,
    duration,
    slideDuration,
    infinite = false
}: CarouselProps) => {
    const { data: items } = useFetch<PostType[]>('features')

    const router = useRouter()
    const currentSlide = useRef(0)
    const slidesRef = useRef<HTMLDivElement | null>(null)
    const [firstLoaded] = useState(true)
    const { setPlayHeaderAnimation } = useNavigation()

    const onCarouselContentClick = useCallback(() => {
        setPlayHeaderAnimation(false)
        const route = items?.[currentSlide.current]?.path || ('/' as string)
        router.push(route)
    }, [items, router, setPlayHeaderAnimation])

    const handleOnSlideChange = useCallback(
        (index: number = 0) => {
            if (!items) return

            currentSlide.current = index
            const slides = slidesRef.current
            const activeSlide = slides?.children[index]
            //const prevSlide = slides?.children[(index - 1 + items.length) % items.length]
            // prevSlide?.classList.remove(cls.active)
            for (let i = 0; i < items.length; i++) {
                const item = slides?.children[i]
                item?.classList.remove(cls.active)
            }
            activeSlide?.classList.add(cls.active)
        },
        [items]
    )

    const handleOnDotClick = useCallback(
        (index: number = 0) => {
            setPlayHeaderAnimation(false)
            handleOnSlideChange?.(index)
        },
        [handleOnSlideChange, setPlayHeaderAnimation]
    )

    const onLoadImage = (e: SyntheticEvent<HTMLImageElement>, index: number) => {
        if (!items) return

        e.currentTarget.style.opacity = '1'
        const nextSlide = (index + 1) % items?.length
        const nextImage = new Image()
        nextImage.src = items[nextSlide]?.cover || ('' as any)
    }

    if (!items) return null

    return (
        <div className={cls.carousel}>
            <CarouselNav
                steps={itemsLength}
                slideDuration={slideDuration}
                infinite={infinite}
                onDotClick={handleOnDotClick}
                handleOnStepChange={handleOnSlideChange}
            />

            <div className={cls.slides} ref={slidesRef} onClick={onCarouselContentClick}>
                {items?.map((item, idx) => (
                    <Col
                        align="center"
                        justify="between"
                        wrap={false}
                        gap="md"
                        key={'carousel_slide-' + idx}
                        className={classnames(cls, [
                            'item',
                            firstLoaded && idx === 0 ? 'active' : undefined
                        ])}
                        style={{
                            transition: `opacity ${duration}ms linear`
                        }}
                    >
                        <div className={cls.title}>{item.title}</div>

                        {item.cover && (
                            <div className={cls.cover}>
                                <NextImage
                                    src={item.cover as string}
                                    alt={item.title}
                                    sizes="100%"
                                    fill
                                    priority
                                    style={{
                                        opacity: 0,
                                        objectFit: 'contain',
                                        transition: `opacity ${duration}ms linear`
                                    }}
                                    onLoad={(e) => onLoadImage(e, idx)}
                                />
                            </div>
                        )}

                        <p className={cls.excerpt}>{item?.excerpt || ''}</p>
                    </Col>
                ))}
            </div>
        </div>
    )
}

export default memo(CircleCarousel)
