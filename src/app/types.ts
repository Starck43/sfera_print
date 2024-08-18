import {PostType} from "@/components/post"

export interface Page<P> {
	id: number
	title: string
	path: string
	subtitle?: string
	content?: string
	excerpt?: string
	keywords?: string
	sections?: P[] | P
	posts?: P[] | null
}

export interface PageProps {
	params: {
		id: string;
		slug: string
	}
	searchParams?: { [key: string]: string | string[] | undefined }
}