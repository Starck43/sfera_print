import { NextRequest, NextResponse } from 'next/server'

export const UTM_KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term'
] as const

export const UTM_EXPIRY_DAYS = 90
export const UTM_EXPIRY_SECONDS = UTM_EXPIRY_DAYS * 24 * 60 * 60

export type UtmParams = {
    [K in typeof UTM_KEYS[number]]: string
}

/**
 * Получить UTM-параметры из строки запроса URL
 */
export function getUtmFromUrl(url: string): Partial<UtmParams> {
    const params = new URLSearchParams(new URL(url).search)
    const result: Partial<UtmParams> = {}

    UTM_KEYS.forEach((key) => {
        const value = params.get(key)
        if (value) {
            result[key] = value
        }
    })

    return result
}

/**
 * Проверить, есть ли UTM-параметры в объекте
 */
export function hasUtmParams(params: Partial<UtmParams>): boolean {
    return UTM_KEYS.some((key) => Boolean(params[key]))
}

/**
 * Сохранить UTM-параметры в cookies (серверная часть)
 */
export function setUtmCookies(
    request: NextRequest,
    response: NextResponse,
    params: Partial<UtmParams>
): void {
    if (!hasUtmParams(params)) return

    const isProduction = process.env.NODE_ENV === 'production'

    UTM_KEYS.forEach((key) => {
        const value = params[key] || ''
        response.cookies.set(key, value, {
            path: '/',
            maxAge: UTM_EXPIRY_SECONDS,
            sameSite: 'lax',
            httpOnly: false,
            secure: isProduction
        })
    })

    // Сохраняем URL первого входа
    const fullUrl = `${request.nextUrl.origin}${request.nextUrl.pathname}${request.nextUrl.search}`
    response.cookies.set('utm_landing', fullUrl, {
        path: '/',
        maxAge: UTM_EXPIRY_SECONDS,
        sameSite: 'lax',
        httpOnly: false,
        secure: isProduction
    })
}

