'use cache'
import 'server-only'
import { cacheTag } from 'next/cache'

export default async function getPage<T>(slug: string): Promise<T> {
    const baseUrl =
        process.env.API_SERVER ||
        process.env.NEXT_PUBLIC_API_SERVER ||
        'https://sferaprint.istarck.ru'

    const url = `${baseUrl}/api/page/${slug}/`

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'
        },
        cache: 'force-cache',
        next: {
            tags: slug ? [slug] : undefined
        }
    })

    if (slug) cacheTag(slug)

    if (!res.ok) {
        console.error(res.statusText, `(${res.status})`)
        throw new Error(`Failed to fetch data from server\n${res.url}`)
    }

    return res.json()
}
