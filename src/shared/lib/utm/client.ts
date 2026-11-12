'use client'

import { useSyncExternalStore } from 'react'
import { UTM_KEYS, type UtmParams } from './server'

const EMPTY_PARAMS: UtmParams = {
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: ''
}

/**
 * Прочитать UTM-параметры из cookies (клиентская часть)
 */
export function getUtmFromCookies(): UtmParams {
    const result: UtmParams = { ...EMPTY_PARAMS }

    if (typeof document === 'undefined') return result

    UTM_KEYS.forEach((key) => {
        const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`))
        result[key] = match ? decodeURIComponent(match[1]) : ''
    })

    return result
}

// Кэш снимка: useSyncExternalStore требует стабильный объект между рендерами
let cachedParams: UtmParams | null = null
const listeners = new Set<() => void>()

const getSnapshot = (): UtmParams => {
    if (!cachedParams) cachedParams = getUtmFromCookies()
    return cachedParams
}

const getServerSnapshot = (): UtmParams => EMPTY_PARAMS

const subscribe = (listener: () => void) => {
    listeners.add(listener)

    return () => {
        listeners.delete(listener)
    }
}

/**
 * Сбросить кэш UTM-параметров (например, после установки cookies)
 */
export function invalidateUtmParams(): void {
    cachedParams = null
    listeners.forEach((listener) => listener())
}

/**
 * React-хук для получения UTM-параметров на клиенте
 */
export function useUtmParams(): UtmParams {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
