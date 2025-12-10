'use cache'

import 'server-only'

import { cacheTag } from 'next/cache'

async function getPage<T>(slug: string): Promise<T> {
    if (slug) cacheTag(slug)

    const res = await fetch(
        `${process.env.API_SERVER || process.env.NEXT_PUBLIC_API_SERVER || 'https://sferaprint.istarck.ru'}/api/page/` +
            (slug ? slug + '/' : ''),
        {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        }
    )

    if (!res.ok) {
        console.error(res.statusText, `(${res.status})`)
        throw new Error('Failed to fetch data from server\n' + res.url)
    }

    return await res.json()
}

export default getPage
