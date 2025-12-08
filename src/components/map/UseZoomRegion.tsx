import React, { useCallback, useEffect, useState } from 'react'

import { classnames } from '@/shared/lib/helpers/classnames'
import type { CityProps, ZoomedRegion } from './types'
import { animateRegion } from './helpers'

import cls from '@/components/map/Map.module.sass'

export const useZoomRegion = () => {
    const [zoomedRegion, setZoomedRegion] = useState<{
        next?: ZoomedRegion
        prev?: ZoomedRegion
    } | null>(null)

    const [activeCity, setActiveCity] = useState<CityProps | null>(null)

    const onCityClick = useCallback((city: CityProps | null) => {
        if (city !== null) {
            history.pushState({ city }, '', `${city.id}`)
            setActiveCity(city)
        } else {
            history.back()
            setActiveCity(null)
        }
    }, [])

    // Эффект для обработки перехода назад
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (event.state?.sity !== undefined) {
                setActiveCity(event.state.sity)
            } else {
                setActiveCity(null)
            }
        }

        // Подписываемся на событие popstate
        window.addEventListener('popstate', handlePopState)
        // Чистим подписку при размонтировании компонента
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    useEffect(() => {
        if (!zoomedRegion) return
        animateRegion(zoomedRegion)
    }, [zoomedRegion])

    const updateZoomedRegion = useCallback((region: ZoomedRegion | null) => {
        setZoomedRegion((state) => {
            if (!region && state?.next)
                return {
                    next: undefined,
                    prev: {
                        ...state.next,
                        onComplete: () => updateZoomedRegion(null)
                    }
                }
            if (region) return { next: region, prev: state?.next || undefined }
            return null
        })
    }, [])

    // Создаем города в выбранном регионе
    const renderCity = useCallback(
        (city: CityProps, region: ZoomedRegion, opacity: number = 1) => {
            const scale = region?.scale || 1
            const cx = Number(city.path.cx) - 12 / scale
            const cy = Number(city.path.cy) - 16 / scale

            return (
                <g id={`city-${city.id}`} key={`city-${city.id}`} onClick={() => onCityClick(city)}>
                    <defs>
                        <g
                            id={`ripples-${city.id}`}
                            className={cls.ripples}
                            style={{ '--scale': `${1 / scale}` } as React.CSSProperties}
                        >
                            <circle r={14 / scale} stroke="none" className={cls.rp1} />
                            <circle r={14 / scale} stroke="none" className={cls.rp2} />
                            <circle r={14 / scale} stroke="none" className={cls.rp3} />
                        </g>
                    </defs>
                    <use xlinkHref={`#ripples-${city.id}`} x={city.path.cx} y={city.path.cy} />

                    <circle
                        {...city.path}
                        r={6 / scale}
                        strokeWidth={4 / scale}
                        fill="white"
                        stroke="black"
                        className={cls.inner__circle}
                    />
                    <text x={cx} y={cy} fontSize={14 / scale} fill="black" opacity={opacity}>
                        {city.name}
                    </text>
                </g>
            )
        },
        [onCityClick]
    )

    // Создаем увеличенный регион
    const renderRegion = useCallback(
        (handleClick: (e: React.MouseEvent<SVGGElement>, regionId?: number) => void) =>
            // eslint-disable-next-line react/display-name
            (zoomedRegion: ZoomedRegion | undefined, style: string) => {
                if (!zoomedRegion) return null
                return (
                    <g
                        id={'region-' + zoomedRegion.id}
                        className={classnames(cls, ['zoomed__region'], {}, [style])}
                        onClick={(e) => handleClick(e)}
                    >
                        <path d={zoomedRegion.path} />
                        {zoomedRegion.cities?.map((city, idx) =>
                            renderCity(
                                city,
                                zoomedRegion,
                                1 - (zoomedRegion.cities.length - 1 - idx) * 0.2
                            )
                        )}
                    </g>
                )
            },
        [renderCity]
    )

    const showZoomedRegion = useCallback(
        (handleClick: (e: React.MouseEvent<SVGGElement>, regionId?: number | null) => void) => {
            return (
                <>
                    {renderRegion(handleClick)(zoomedRegion?.prev, 'prev')}
                    {renderRegion(handleClick)(zoomedRegion?.next, 'next')}
                </>
            )
        },
        [renderRegion, zoomedRegion?.prev, zoomedRegion?.next]
    )

    return {
        zoomedRegion,
        setZoomedRegion: updateZoomedRegion,
        showZoomedRegion,
        activeCity,
        setActiveCity: onCityClick
    }
}
