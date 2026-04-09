import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    let url = request.nextUrl.searchParams.get('url')
    if (!url) return new NextResponse('No URL', { status: 400 })

    if (url.startsWith('/media/')) {
        url = `${process.env.API_SERVER}${url}`
    }

    const res = await fetch(url)
    const buffer = await res.arrayBuffer()
    return new Response(res.body, {
        status: res.status,
        headers: {
            'Content-Type': res.headers.get('Content-Type') ?? 'video/mp4',
            'Content-Length': res.headers.get('Content-Length') ?? buffer.byteLength.toString()
        }
    })
}
