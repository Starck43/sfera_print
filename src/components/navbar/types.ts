import type {Contact} from "@/components/contacts/types"


interface Socials {
	id: number
	name: string
	title: string
	link: string
}

export interface Menu {
    pages: NavItemType[]
	contact: Contact
	socials?: Socials[]
	policy?: string
	agreement?: string
	cookie?: string
}

export interface NavItemType {
    id: number
    title: string
    path: string
    subtitle?: string
}
