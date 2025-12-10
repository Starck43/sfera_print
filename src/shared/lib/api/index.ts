import { getPosts } from '@/shared/lib/api/getPosts'

export function getBlog<T>(id: string): Promise<T>
export function getBlog<T>(): Promise<T[]>
export function getBlog(id = ''): Promise<any> {
    const endpoint = `/blog/${id}`
    return getPosts(endpoint, 'blog')
}

export function getFeatures<T>(slug: string): Promise<T>
export function getFeatures<T>(): Promise<T[]>
export function getFeatures(slug = ''): Promise<any> {
    const endpoint = `/features/${slug}`
    return getPosts(endpoint, 'features')
}

export function getTechnologies<T>(slug: string): Promise<T>
export function getTechnologies<T>(): Promise<T[]>
export function getTechnologies(slug = ''): Promise<any> {
    const endpoint = `/technologies/${slug}`
    return getPosts(endpoint, 'technologies')
}

export function getDocuments<T>(slug: string): Promise<T>
export function getDocuments<T>(): Promise<T[]>
export function getDocuments(slug = ''): Promise<any> {
    const endpoint = `/documents/${slug}`
    return getPosts(endpoint, 'documents')
}

export function getCityCases<T>(slug: string): Promise<T>
export function getCityCases<T>(): Promise<T[]>
export function getCityCases(slug = ''): Promise<any> {
    const endpoint = `/city_cases/${slug}`
    return getPosts(endpoint, 'cases')
}
