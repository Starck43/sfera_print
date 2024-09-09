export function setCookie(key: string, value: string, days: number) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = 'expires=' + date.toUTCString()
    document.cookie = key + '=' + value + '; ' + expires
}

export function checkCookie(key: string): boolean {
    const decodedCookie = decodeURIComponent(document.cookie || '')
    const cookies = decodedCookie.split(';')

    for (const cookie of cookies) {
        const [cookieKey, cookieValue] = cookie.split('=')
        if (cookieKey.trim() === key) {
            // Проверяем, есть ли срок действия в куки
            const cookieParams = cookieValue.split(';')
            for (const param of cookieParams) {
                if (param.trim().startsWith('expires')) {
                    const expiresString = param.trim().substring(8) // Получаем строку даты
                    const expiresDate = new Date(expiresString)

                    // Проверяем, истек ли срок действия куки
                    return expiresDate.getTime() >= Date.now()
                }
            }
            return true
        }
    }

    return false
}

export function removeCookie(key: string) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
