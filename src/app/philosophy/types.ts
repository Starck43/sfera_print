export interface Achievement {
	id: number
	title: string
	excerpt?: string
	desc?: string
	cover?: string
	event_date: string
}

export interface Stat {
	id: number
	title: string
	desc: string
}

export interface Partner {
	id: number
	name?: string
	logo?: string | null
	link?: string
	group: string
}
