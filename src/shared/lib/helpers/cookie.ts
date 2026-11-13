export function setCookie(key: string, value: string, days: number) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = 'expires=' + date.toUTCString()
    document.cookie = key + '=' + value + '; ' + expires
}

export function getCookieValue(key: string): string | undefined {
    if (typeof document === 'undefined') return undefined

    const decodedCookie = decodeURIComponent(document.cookie || '')
    const cookies = decodedCookie.split(';')

    for (const cookie of cookies) {
        const [cookieKey, ...rest] = cookie.split('=')
        if (cookieKey.trim() === key) {
            return rest.join('=')
        }
    }

    return undefined
}

export function checkCookie(key: string): boolean | undefined {
    return getCookieValue(key) !== undefined ? true : undefined
}

export function removeCookie(key: string) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
