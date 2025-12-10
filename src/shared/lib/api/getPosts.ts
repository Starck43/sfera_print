'use cache'

import 'server-only'

import { cacheTag } from 'next/cache'
import { normalizeUrlPath } from '@/shared/lib/helpers/url'

export async function getPosts(endpoint: string, tag: string = 'posts') {
    cacheTag(endpoint, tag)

    // get post by endpoint ('<page>/<id | slug>')
    const res = await fetch(
        normalizeUrlPath(
            `${process.env.API_SERVER || process.env.NEXT_PUBLIC_API_SERVER || 'https://sferaprint.istarck.ru'}/api/${endpoint}/`
        ),
        {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            },
        }
    )

    if (!res.ok) {
        console.error(res.statusText, `(${res.status})`)
        //throw new Error('Failed to load data \n'+res.url)
    }

    return await res.json()
}
