'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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

interface MapProps {
    pageTitle: string
    cities: City[]
}

const Map = ({ pageTitle, cities }: MapProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const { width = 0, height = 0 } = useWindowDimensions(containerRef?.current || null)
    const [regionsData, setRegionsData] = useState<Region[]>([])
    const [citiesData, setCitiesData] = useState<Record<number, RegionCitiesProps>>({})
    // const [selectedRegion, setSelectedRegion] = useState<number | null>(null)
    const { zoomedRegion, showZoomedRegion, setZoomedRegion, activeCity, setActiveCity } =
        useZoomRegion()

    const isPortrait = window.innerWidth / window.innerHeight < 1

    const { data: city } = useFetch<CityCases>(
        activeCity?.id ? `/city_cases/${activeCity.id}` : null,
        null,
        true,
        [activeCity?.id]
    )

    const { svgContent: locationSvg, attributes: locationSvgAttr } = useDynamicSVG({
        svgPath: '/svg/location.svg',
        textAttributes: {
            x: 254,
            y: 235.25,
            stroke: '#000',
            fontSize: 140,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 700,
            textAnchor: 'middle'
        }
    })

    console.log(cities)
    useEffect(() => {
        if (!width || isPortrait) return

        const { regionsData: regions, citiesData } = generateRegionsMap(
            geoJson as GeoJson,
            cities,
            [width, height]
        )

        setRegionsData(regions)
        setCitiesData(citiesData)
    }, [cities, width, height, isPortrait])

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
                const translateX = width / 2 - featureCenter[0] * scale
                const translateY = height / 2 - featureCenter[1] * scale

                const zoomedRegionsProps: ZoomedRegion = {
                    id: regionId,
                    name: selectedFeature.properties?.id || '',
                    path: selectedFeature.svg.path,
                    translate: [translateX, translateY],
                    scale: scale,
                    //parentSize: [width, height],
                    //bounds: selectedFeature.svg.bounds,
                    cities: citiesData?.[regionId]?.data || []
                }

                setZoomedRegion(zoomedRegionsProps)
            }
        },
        [width, isPortrait, regionsData, setZoomedRegion, height, citiesData]
    )

    const regionsMap = useMemo(
        () =>
            regionsData?.map((region, key) => (
                <path
                    key={region.id || key}
                    id={region.properties?.id || ''}
                    d={region.svg.path}
                    className={classnames(cls, ['region'], {
                        occupied: region.occupied
                    })}
                    onClick={(e) => zoomRegionClick(e, region.id)}
                    //onMouseDown={() => selectRegionClick(region.id)}
                />
            )),
        [regionsData, zoomRegionClick]
    )

    // Выводим маркеры с отметкой количества городов на общей карте регионов
    const citiesMarkers = useMemo(
        () =>
            Object.entries(citiesData)?.map(([key, value]) => {
                const coord = value.regionSvg.center
                const iconSize = Math.min(40, Math.max(20, Math.min(width, height) * 0.1))
                const changedLocationSvg = changeSvgText({
                    svgContent: locationSvg,
                    newAttributes: locationSvgAttr,
                    newText: value.data?.length.toString() || ''
                })

                return (
                    <foreignObject
                        key={key}
                        x={coord[0] - iconSize / 2}
                        y={coord[1] - iconSize}
                        width={iconSize}
                        height={iconSize}
                        onClick={(e) => zoomRegionClick(e, value.regionId)}
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
            }),
        [citiesData, width, height, locationSvg, locationSvgAttr, zoomRegionClick]
    )

    // Если ширина окна меньше высоты, то отобразим кейсы в виде плитки
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
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

export default Map
