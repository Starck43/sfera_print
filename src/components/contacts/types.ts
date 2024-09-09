export interface Contact {
    id: number
    value: string
    link?: string
    type: 'address' | 'tel' | 'email' | 'name' | 'href'
    order: number
}
