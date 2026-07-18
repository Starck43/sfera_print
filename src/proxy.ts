import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUtmFromUrl, setUtmCookies } from '@/shared/lib/utm'

export function proxy(request: NextRequest) {
    const response = NextResponse.next()
    const { pathname, search } = request.nextUrl

    // Обработка медиа-файлов
    if (pathname.startsWith('/media/')) {
        const apiServer = process.env.API_SERVER || 'http://localhost:8005'
        const targetUrl = `${apiServer}${pathname}`
        return NextResponse.rewrite(new URL(targetUrl))
    }

    // Обработка политик
    if (pathname.startsWith('/policies/')) {
        const apiServer = process.env.API_SERVER || 'http://localhost:8005'
        const targetUrl = `${apiServer}/media/policies${pathname.slice(9)}`
        return NextResponse.rewrite(new URL(targetUrl))
    }

    // Захват и сохранение UTM-параметров
    const fullUrl = `${request.nextUrl.origin}${pathname}${search}`
    const utmParams = getUtmFromUrl(fullUrl)
    setUtmCookies(request, response, utmParams)

    return response
}

export const config = {
    matcher: [
        '/media/:path*',
        '/policies/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
}
