import { geoContains, geoMercator, geoPath } from 'd3-geo'
import { animate } from 'animejs'

import type { City, CityProps, GeoJson, Region, RegionCitiesProps, ZoomedRegion } from './types'

import cls from './Map.module.sass'

export function generateRegionsMap(
    regionsJson: GeoJson,
    citiesJson: City[],
    viewport: [number, number]
) {
    const projection = geoMercator().fitSize(viewport, regionsJson as any)
    const geoPathGenerator = geoPath().projection(projection)
    const citiesData: Record<number, RegionCitiesProps> = {}

    const regionsData: Region[] = regionsJson.features.map((feature: any, regionId) => {
        const regionCenter = geoPathGenerator.centroid(feature)
        const citiesInRegion: CityProps[] = []

        citiesJson?.forEach((city) => {
            // If city is within the region
            const coords: [number, number] = [city.longitude, city.latitude]
            if (geoContains(feature, coords)) {
                const coord = projection(coords)
                if (!coord) return

                const citySvg: CityProps = {
                    id: city.id,
                    name: city.name,
                    path: {
                        cx: coord[0] as number,
                        cy: coord[1] as number
                    },
                    portfolioCount: city.portfolio_count
                }

                citiesInRegion.push(citySvg)
            }
        })

        let occupied = false
        if (citiesInRegion.length) {
            occupied = true
            citiesData[regionId] = {
                regionId: regionId,
                data: citiesInRegion,
                regionSvg: {
                    center: regionCenter,
                }
            }
        }

        return {
            id: regionId,
            properties: {
                id: feature?.properties?.id,
                name: feature?.properties?.name,
            },
            svg: {
                bounds: geoPathGenerator.bounds(feature),
                path: geoPathGenerator(feature) || ''
            },
            occupied: occupied
        }
    })

    return { regionsData, citiesData, mapPath: geoPathGenerator }
}

export const animateRegion = (region: {
    next?: ZoomedRegion | null
    prev?: ZoomedRegion | null
}) => {
    if (region?.prev) {
        const {
            translate: [translateX = 0, translateY = 0],
            scale = 1
        } = region.prev
        const timeline = animate(`.${cls.zoomed__region}.prev`, {
            strokeWidth: 0,
            translateX: [translateX, 0],
            translateY: [translateY, 0],
            scale: [scale, 1],
            opacity: [1, 0],
            duration: 300,
            ease: 'linear'
        })
        if (!region?.next) {
            timeline.then(region.prev?.onComplete)
        }
    }

    if (region?.next) {
        const {
            translate: [translateX = 0, translateY = 0],
            scale = 1
        } = region.next
        animate(`.${cls.zoomed__region}.next`, {
            strokeWidth: 1 / scale,
            translateX: [1, translateX],
            translateY: [1, translateY],
            scale: [1, scale],
            opacity: [0, 1],
            direction: 'normal',
            duration: 400,
            ease: 'inOutExpo'
        })
    }
}
