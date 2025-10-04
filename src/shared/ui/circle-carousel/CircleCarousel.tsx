'use client'

import React, { memo, MouseEvent, SyntheticEvent, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { useNavigation } from '@/shared/lib/providers/NavigationProvider'
import type { PostType } from '@/components/post'
import { classnames } from '@/shared/lib/helpers/classnames'
import { useFetch } from '@/shared/lib/hooks/useFetch'

import { LazyImage } from '@/shared/ui/lazy-image'
import { Col } from '@/shared/ui/stack'

import CarouselNav from './CarouselNav'

import cls from './CircleCarousel.module.sass'

interface CarouselProps {
    duration: number
    slideDuration: number
    infinite?: boolean
}

const CircleCarousel = ({ duration, slideDuration, infinite = false }: CarouselProps) => {
    const { data: items } = useFetch<PostType[]>('features')

    const router = useRouter()
    const slidesRef = useRef<HTMLDivElement | null>(null)
    const { setPlayHeaderAnimation } = useNavigation()

    const handleOnSlideClick = useCallback(
        (e: MouseEvent<SVGGElement>, index: number) => {
            const target = e.target as Element
            if (target.tagName === 'circle') {
                return
            }
            setPlayHeaderAnimation(false)
            const route = items?.[index]?.path || ('/' as string)
            router.push(route)
        },
        [items, router, setPlayHeaderAnimation]
    )

    const handleOnSlideChange = useCallback(
        (index: number = 0) => {
            if (!items) return
            const slides = slidesRef.current

            const activeSlide = slides?.children[(index + items.length) % items.length]
            for (let i = 0; i < items.length; i++) {
                const item = slides?.children[i]
                item?.classList.remove(cls.active)
            }
            activeSlide?.classList.add(cls.active)
        },
        [items]
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
            <div className={cls.slides} ref={slidesRef}>
                {items?.map((item, idx) => (
                    <Col
                        align="center"
                        justify="between"
                        wrap={false}
                        gap="md"
                        key={'carousel_slide-' + idx}
                        className={classnames(cls, ['item'])}
                        style={{
                            transition: `opacity ${duration}ms linear`
                        }}
                    >
                        <div className={cls.title}>{item.title}</div>

                        {item.cover && (
                            <div className={cls.cover}>
                                <LazyImage
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
            <CarouselNav
                steps={items.length}
                slideDuration={slideDuration}
                infinite={infinite}
                onSlideClick={handleOnSlideClick}
                onStepChange={handleOnSlideChange}
            />
        </div>
    )
}

export default memo(CircleCarousel)
