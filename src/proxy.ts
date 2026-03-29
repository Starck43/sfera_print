import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname.startsWith('/media/')) {
        const apiServer = process.env.API_SERVER || 'http://localhost:8005'
        const targetUrl = `${apiServer}${pathname}`
        return NextResponse.rewrite(new URL(targetUrl))
    }

    if (pathname.startsWith('/policies/')) {
        const apiServer = process.env.API_SERVER || 'http://localhost:8005'
        const targetUrl = `${apiServer}/media/policies${pathname.slice(9)}`
        return NextResponse.rewrite(new URL(targetUrl))
    }

    // Все остальные запросы (включая _next, icon.svg, favicon.ico) пропускаем
    return NextResponse.next()
}

export const config = {
    matcher: ['/media/:path*', '/policies/:path*']
}
