type YandexMetrikaGoal = 'zayavka' | 'phone' | 'email' | 'messenger'

interface YandexMetrikaInitOptions {
    defer?: boolean
    clickmap?: boolean
    trackLinks?: boolean
    accurateTrackBounce?: boolean
    webvisor?: boolean
}

interface YandexMetrikaApi {
    (counter: number, key: 'init', options: YandexMetrikaInitOptions): void
    (counter: number, key: 'hit', url: string): void
    (counter: number, key: 'reachGoal', goal: YandexMetrikaGoal): void
    (counter: number, key: 'getClientID', callback: (clientID: string) => void): void
    (counter: number, key: 'setUserParams', params: Record<string, unknown>): void
    (counter: number, key: string, ...args: unknown[]): void
}

declare function ym(counter: number, key: string, ...args: unknown[]): void

interface Window {
    ym?: YandexMetrikaApi
}
