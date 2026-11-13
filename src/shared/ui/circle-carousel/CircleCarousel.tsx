'use client'

import React, { memo, MouseEvent, SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useNavigation } from '@/shared/lib/providers/NavigationProvider'
import type { PostType } from '@/components/post'
import { classnames } from '@/shared/lib/helpers/classnames'

import { LazyImage } from '@/shared/ui/lazy-image'
import { Col } from '@/shared/ui/stack'

import CarouselNav from './CarouselNav'

import cls from './CircleCarousel.module.sass'

interface CarouselProps {
    items: PostType[]
    duration: number
    slideDuration: number
    infinite?: boolean
}

const getCoverSrc = (cover: PostType['cover']): string => {
    if (!cover) return ''
    if (typeof cover === 'string') return cover
    return cover.src || ''
}

const CircleCarousel = ({ items, duration, slideDuration, infinite = false }: CarouselProps) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isWarm, setIsWarm] = useState(false)

    const router = useRouter()
    const { setPlayHeaderAnimation } = useNavigation()

    // Первый кадр должен быть виден сразу, остальные обложки не должны мешать ему
    // в первую очередь, поэтому они подключаются только после простоя страницы.
    useEffect(() => {
        let idleId: number | undefined
        let timeoutId: ReturnType<typeof setTimeout> | undefined

        const start = () => setIsWarm(true)

        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            idleId = (window as any).requestIdleCallback(start, { timeout: 3000 })
        } else {
            timeoutId = setTimeout(start, 2000)
        }

        return () => {
            if (idleId !== undefined && typeof window !== 'undefined') {
                ;(window as any).cancelIdleCallback?.(idleId)
            }
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [])

    const handleOnSlideClick = useCallback(
        (e: MouseEvent<SVGGElement>, index: number) => {
            // Проверяем, что клик не по навигации
            const target = e.target as Element
            const isNavCircle = target.closest('.circle__nav') || target.closest('circle')

            if (isNavCircle) {
                return
            }

            setPlayHeaderAnimation(false)
            const route = items?.[index]?.path || ('/' as string)
            router.push(route)
        },
        [items, router, setPlayHeaderAnimation]
    )

    const handleOnSlideChange = useCallback((index: number = 0) => {
        setActiveIndex(index)
    }, [])

    const onLoadImage = (e: SyntheticEvent<HTMLImageElement>, index: number) => {
        if (!items) return

        e.currentTarget.style.opacity = '1'
        const nextSlide = (index + 1) % items.length
        const nextImage = new Image()
        nextImage.src = getCoverSrc(items[nextSlide]?.cover)
    }

    if (!items?.length) return null

    return (
        <div className={cls.carousel}>
            <div className={cls.slides}>
                {items.map((item, idx) => {
                    const isFirst = idx === 0
                    const isActive = idx === activeIndex
                    // Первый слайд рисуется сразу, остальные — после простоя или при выборе
                    const showImage = isFirst || isWarm || isActive

                    return (
                        <Col
                            align="center"
                            justify="between"
                            wrap={false}
                            gap="md"
                            key={'carousel_slide-' + idx}
                            className={classnames(cls, ['item'], { active: isActive })}
                            style={{
                                transition: `opacity ${duration}ms linear`
                            }}
                        >
                            <div className={cls.title}>{item.title}</div>

                            {item.cover && (
                                <div className={cls.cover}>
                                    {showImage && (
                                        <LazyImage
                                            src={item.cover as string}
                                            alt={item.title}
                                            sizes="(max-width: 768px) 76vw, 76vh"
                                            fill
                                            loading={isFirst ? 'eager' : 'lazy'}
                                            fetchPriority={isFirst ? 'high' : 'low'}
                                            instant={isFirst}
                                            style={{
                                                opacity: isFirst ? 1 : 0,
                                                objectFit: 'contain',
                                                transition: isFirst
                                                    ? 'none'
                                                    : `opacity ${duration}ms linear`
                                            }}
                                            onLoad={(e) => onLoadImage(e, idx)}
                                        />
                                    )}
                                </div>
                            )}

                            <p className={cls.excerpt}>{item?.excerpt || ''}</p>
                        </Col>
                    )
                })}
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
