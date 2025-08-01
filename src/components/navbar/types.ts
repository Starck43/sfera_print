import type { Contact } from '@/components/contacts/types'

interface Socials {
    id: number
    name: string
    title: string
    link: string
    image?: string
}

export interface Menu {
    pages: NavItemType[]
    contact: Contact
    socials?: Socials[]
    policy?: string
    agreement?: string
    cookie?: string
    offer?: string
}

export interface NavItemType {
    id: number
    title: string
    path: string
    subtitle?: string
}
