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
    params: Promise<{ id: string; slug: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}
