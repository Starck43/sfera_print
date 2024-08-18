interface Image {
	src: string
	srcset?: string[]
}

export interface Media {
	id: number
	title: string
	image: Image | string
	image_portrait?: Image | string
	video?:  string
	video_portrait?: string
	//link?: string
}

export interface PostType {
	id: number
	slug?: string
	title: string
	excerpt?: string
	desc: string | null
	event_date?: string
	path: string
	cover: Image | string | null
	file?: URL
	media?: Media[]
}

