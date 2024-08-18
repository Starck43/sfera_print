import {SVGProps} from "react"
import {PostType} from "@/components/post"

export interface GeoJson {
	type: string
	features: {
		id: number,
		properties: {
			id: string
			name: string
		}
	}[]
}

export interface Region {
	id: number
	properties: {
		id?: string
		name?: string
	}
	svg: {
		path: string
		bounds: number[][]
	}
	occupied: boolean
}

export interface City {
	id: string
	slug?: string
	name: string
	longitude: number
	latitude: number
}

export interface CityCases {
	id: string,
	name: string,
	title?: string,
	excerpt?: string,
	keywords?: string,
	section?: string,
	path: string,
	portfolio?: PostType[]
}

export interface CityProps {
	id: string
	name: string
	path: SVGProps<SVGCircleElement>
}

export interface RegionCitiesProps {
	regionId: number
	data: CityProps[]
	regionSvg: {
		center: [number, number]
	}
}

export interface ZoomedRegion {
	id: number
	name: string
	path: string
	translate: [number, number]
	scale: number
	cities: CityProps[]
	onComplete?: () => void
}
