'use client'

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import PageLayout from '@/components/layout/page-layout'

import { useWindowDimensions } from '@/shared/lib/hooks/useWindowDimensions'
import { classnames } from '@/shared/lib/helpers/classnames'
import useDynamicSVG from '@/shared/lib/hooks/useDynamicSVG'
import { changeSvgText } from '@/shared/lib/helpers/svg'

import type { City, CityCases, GeoJson, Region, RegionCitiesProps, ZoomedRegion } from './types'
import { useFetch } from '@/shared/lib/hooks/useFetch'

import { Portfolio } from '../portfolio'
import { useZoomRegion } from './UseZoomRegion'
import CasesList from './CasesList'
import { generateRegionsMap } from './helpers'

import geoJson from '@/assets/regions.ru.json'
import cls from './Map.module.sass'
import { Loader } from '@/shared/ui/loader'

interface MapProps {
    pageTitle: string
    cities: City[]
}

const Map = ({ pageTitle, cities }: MapProps) => {
    const [isClient, setIsClient] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const { width = 0, height = 0 } = useWindowDimensions(containerRef.current)
    const [regionsData, setRegionsData] = useState<Region[]>([])
    const [citiesData, setCitiesData] = useState<Record<number, RegionCitiesProps>>({})
    // const [selectedRegion, setSelectedRegion] = useState<number | null>(null)
    const { zoomedRegion, showZoomedRegion, setZoomedRegion, activeCity, setActiveCity } =
        useZoomRegion()

    const isPortrait = typeof window !== 'undefined' && window.innerWidth / window.innerHeight < 1

    useEffect(() => {
        setIsClient(true)
    }, [])

    const { data: city } = useFetch<CityCases>(
        activeCity?.id ? `/city_cases/${activeCity.id}` : null,
        null,
        true,
        [activeCity?.id]
    )

    const memoizedGenerateRegionsMap = useCallback(
        () => generateRegionsMap(geoJson as GeoJson, cities, [width, height]),
        [cities, width, height]
    )

    const { svgContent: locationSvg, attributes: locationSvgAttr } = useDynamicSVG({
        svgPath: '/svg/location.svg',
        textAttributes: {
            x: 254,
            y: 235.25,
            stroke: '#000',
            fontSize: 140,
            fontWeight: 700,
            textAnchor: 'middle'
        }
    })

    useEffect(() => {
        if (!width || isPortrait) return
        const { regionsData: regions, citiesData } = memoizedGenerateRegionsMap()
        setRegionsData(regions)
        setCitiesData(citiesData)
    }, [memoizedGenerateRegionsMap, isPortrait, width])

    // const selectRegionClick = useCallback((id: number) => {
    // 	if (selectedRegion === id) {
    // 		setSelectedRegion(null)
    // 		return
    // 	}
    //
    // 	setSelectedRegion(id)
    //
    // }, [selectedRegion])

    const zoomRegionClick = useCallback(
        (e: React.MouseEvent<SVGGElement>, regionId?: number | null) => {
            if (!width || isPortrait) return

            if (!regionId && (e.target as SVGGElement)?.parentElement?.id?.startsWith('city-')) {
                e.preventDefault()
                return
            }

            if (!regionId) {
                setZoomedRegion(null)
                return
            }

            const selectedFeature = regionsData?.[regionId]
            if (selectedFeature) {
                // TODO: пересчитывать координаты динамически исходя из размеров контейнера карты
                // const rect = e.currentTarget.getBoundingClientRect();
                // const parentRect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                // const featureTop = [rect.left - parentRect.left, rect.top - parentRect.top];
                // const featureBottom = [rect.right - parentRect.left, rect.bottom - parentRect.top];
                //
                // const featureWidth = featureBottom[0] - featureTop[0];
                // const featureHeight = featureBottom[1] - featureTop[1];
                // const featureCenter = [featureTop[0] + featureWidth / 2, featureTop[1] + featureHeight / 2];
                //
                // const scale = Math.min(parentRect.width / featureWidth, parentRect.height / featureHeight);
                // const translateX = parentRect.width / 2 - featureCenter[0] * scale;
                // const translateY = parentRect.height / 2 - featureCenter[1] * scale;

                const [featureTop, featureBottom] = selectedFeature.svg.bounds
                const featureWidth = featureBottom[0] - featureTop[0]
                const featureHeight = featureBottom[1] - featureTop[1]
                const featureCenter = [
                    featureTop[0] + featureWidth / 2,
                    featureTop[1] + featureHeight / 2
                ]

                const scale = Math.min(width / featureWidth, height / featureHeight)
                const translate: [number, number] = [
                    width / 2 - featureCenter[0] * scale,
                    height / 2 - featureCenter[1] * scale
                ]

                const zoomedRegionsProps: ZoomedRegion = {
                    id: regionId,
                    name: selectedFeature.properties?.id || '',
                    path: selectedFeature.svg.path,
                    translate,
                    scale,
                    //parentSize: [width, height],
                    //bounds: selectedFeature.svg.bounds,
                    cities: citiesData?.[regionId]?.data || []
                }

                setZoomedRegion(zoomedRegionsProps)
            }
        },
        [width, isPortrait, regionsData, setZoomedRegion, height, citiesData]
    )

    const regionsMap = useMemo(() => {
        const handleRegionClick = (e: React.MouseEvent<SVGGElement, MouseEvent>, id: number) => {
            e.stopPropagation()
            zoomRegionClick(e, id)
        }

        return (
            <g className={cls.regions}>
                {regionsData.map((region) => (
                    <path
                        key={region.id}
                        d={region.svg.path}
                        className={classnames(cls, ['region'], {
                            occupied: region.occupied
                        })}
                        onClick={(e) => handleRegionClick(e, region.id)}
                    />
                ))}
            </g>
        )
    }, [regionsData, zoomRegionClick])

    const handleMarkerClick = useCallback(
        (e: React.MouseEvent<SVGGElement, MouseEvent>, regionId: number) => {
            e.stopPropagation()
            zoomRegionClick(e, regionId)
        },
        [zoomRegionClick]
    )

    // Выводим маркеры с отметкой количества городов на общей карте регионов
    const citiesMarkers = useMemo(() => {
        if (
            !locationSvg ||
            !locationSvgAttr ||
            isPortrait ||
            typeof window === 'undefined' ||
            window.innerWidth < 768
        )
            return null

        return Object.entries(citiesData)
            .map(([key, value]) => {
                const portfolioCount = value.data.reduce(
                    (sum, city) => sum + city.portfolioCount,
                    0
                )
                if (portfolioCount === 0) return null

                const coord = value.regionSvg.center
                const iconSize = Math.min(40, Math.max(20, Math.min(width, height) * 0.1))
                const changedLocationSvg = changeSvgText({
                    svgContent: locationSvg,
                    newAttributes: locationSvgAttr,
                    newText: portfolioCount.toString()
                })

                return (
                    <foreignObject
                        key={key}
                        x={coord[0] - iconSize / 2}
                        y={coord[1] - iconSize}
                        width={iconSize}
                        height={iconSize}
                        onClick={(e) => handleMarkerClick(e, value.regionId)}
                        className={cls.marker}
                    >
                        {
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: changedLocationSvg
                                }}
                            />
                        }
                    </foreignObject>
                )
            })
            .filter(Boolean)
    }, [locationSvg, locationSvgAttr, isPortrait, citiesData, width, height, handleMarkerClick])

    if (!isClient) {
        return (
            <div className={cls.container} ref={containerRef}>
                <Loader />
            </div>
        )
    }

    // Если ширина окна меньше высоты, то отобразим кейсы в виде плитки
    if (window.innerWidth < 768 || isPortrait) {
        return <CasesList />
    }

    // Выводим маркеры с отметкой количества городов на карте регионов
    return (
        <>
            <div id="regionsData" className={cls.container} ref={containerRef}>
                <svg
                    className={classnames(cls, ['svg-map'], {
                        zoomed: !!zoomedRegion
                    })}
                    viewBox={`0 0 ${width} ${height}`}
                >
                    {regionsMap}
                    {citiesMarkers}
                    {showZoomedRegion(zoomRegionClick)}
                </svg>
            </div>

            {city && activeCity !== null && (
                <PageLayout
                    title={pageTitle + ' – ' + activeCity.name}
                    titleTag="h1"
                    gap="none"
                    sectionMode={false}
                    handleOnClose={() => setActiveCity(null)}
                    className="portfolio"
                >
                    <Portfolio items={city.portfolio || []} />
                </PageLayout>
            )}
        </>
    )
}

export default memo(Map)
