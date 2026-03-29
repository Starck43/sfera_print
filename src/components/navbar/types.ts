import type { Contact } from '@/components/contacts/types'

export interface Social {
    id: number
    name: string
    title: string
    link: string
    image?: string
}

export interface Policy {
    id: number
    title: string
    description: string | null
    policy_type: 'privacy' | 'terms' | 'cookie' | 'other'
    file_url: string
    is_active?: boolean
}

export interface Menu {
    pages: NavItemType[]
    contact: Contact
    socials?: Social[]
    policies?: Policy[]
}

export interface NavItemType {
    id: number
    title: string
    path: string
    subtitle?: string
}
