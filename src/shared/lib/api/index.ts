export { default as getPage } from './getPage'

import { normalizeUrlPath } from '@/shared/lib/helpers/url'

export async function getPosts(endpoint: string) {
    // get post by endpoint ('<page>/<id | slug>')
    const res = await fetch(
        normalizeUrlPath(`${process.env.NEXT_PUBLIC_API_SERVER}/api/${endpoint}/`),
        {
            cache: 'force-cache'
        }
    )

    if (!res.ok) {
        console.error(res.statusText, `(${res.status})`)
        //throw new Error('Failed to load data \n'+res.url)
    }

    return await res.json()
}

export function getBlog<T>(id: string): Promise<T>
export function getBlog<T>(): Promise<T[]>
export function getBlog(id = ''): Promise<any> {
    const endpoint = `/blog/${id}`
    return getPosts(endpoint)
}

export function getFeatures<T>(slug: string): Promise<T>
export function getFeatures<T>(): Promise<T[]>
export function getFeatures(slug = ''): Promise<any> {
    const endpoint = `/features/${slug}`
    return getPosts(endpoint)
}

export function getTechnologies<T>(slug: string): Promise<T>
export function getTechnologies<T>(): Promise<T[]>
export function getTechnologies(slug = ''): Promise<any> {
    const endpoint = `/technologies/${slug}`
    return getPosts(endpoint)
}

export function getDocuments<T>(slug: string): Promise<T>
export function getDocuments<T>(): Promise<T[]>
export function getDocuments(slug = ''): Promise<any> {
    const endpoint = `/documents/${slug}`
    return getPosts(endpoint)
}

export function getCityCases<T>(slug: string): Promise<T>
export function getCityCases<T>(): Promise<T[]>
export function getCityCases(slug = ''): Promise<any> {
    const endpoint = `/city_cases/${slug}`
    return getPosts(endpoint)
}
