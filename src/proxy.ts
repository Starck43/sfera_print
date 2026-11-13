import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUtmFromUrl, setUtmCookies } from '@/shared/lib/utm'

/**
 * Маршруты, которые обслуживает само приложение (src/app/api).
 * Их нельзя проксировать на бэкенд, иначе они станут недоступны.
 */
const APP_API_ROUTES = ['/api/create-lead', '/api/health', '/api/revalidate', '/api/video-proxy']

// Тот же порядок фолбэков, что и у серверных запросов (getPage/getPosts):
// пропущенная в окружении контейнера переменная не должна ронять API и медиа
const getApiServer = (): string =>
    process.env.API_SERVER || process.env.NEXT_PUBLIC_API_SERVER || 'https://sferaprint.istarck.ru'

export function proxy(request: NextRequest) {
    const response = NextResponse.next()
    const { pathname, search } = request.nextUrl

    // Запросы к API бэкенда проксируются на сервере.
    // Браузер при этом обращается только к текущему origin:
    // абсолютный адрес бэкенда не попадает в клиентский бандл
    // и запросы не зависят от CORS.
    if (pathname.startsWith('/api/')) {
        const route = pathname.replace(/\/+$/, '')

        if (APP_API_ROUTES.includes(route)) {
            return response
        }

        const targetUrl = `${getApiServer()}${pathname}${search}`
        return NextResponse.rewrite(new URL(targetUrl))
    }

    // Обработка медиа-файлов
    if (pathname.startsWith('/media/')) {
        const targetUrl = `${getApiServer()}${pathname}${search}`
        return NextResponse.rewrite(new URL(targetUrl))
    }

    // Обработка политик
    if (pathname.startsWith('/policies/')) {
        const targetUrl = `${getApiServer()}/media/policies${pathname.slice(9)}${search}`
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
        '/api/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
}
