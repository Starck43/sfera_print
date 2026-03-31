export function setCookie(key: string, value: string, days: number) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = 'expires=' + date.toUTCString()
    document.cookie = key + '=' + value + '; ' + expires
}

export function checkCookie(key: string): boolean | undefined {
    const decodedCookie = decodeURIComponent(document.cookie || '')
    const cookies = decodedCookie.split(';')

    for (const cookie of cookies) {
        const [cookieKey, cookieValue] = cookie.split('=')
        if (cookieKey.trim() === key) {
            // Проверяем, истек ли срок
            const cookieParams = cookieValue.split(';')
            for (const param of cookieParams) {
                if (param.trim().startsWith('expires')) {
                    const expiresString = param.trim().substring(8)
                    const expiresDate = new Date(expiresString)
                    // Если срок истек — считаем, что cookie нет
                    if (expiresDate.getTime() < Date.now()) {
                        return undefined
                    }
                }
            }
            return true
        }
    }
    return undefined
}

export function removeCookie(key: string) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
