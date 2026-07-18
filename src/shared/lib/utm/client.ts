'use client'

import { useState, useEffect } from 'react'
import { UTM_KEYS, type UtmParams } from './server'

/**
 * Прочитать UTM-параметры из cookies (клиентская часть)
 */
export function getUtmFromCookies(): UtmParams {
    const result: UtmParams = {
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        utm_content: '',
        utm_term: ''
    }

    if (typeof document === 'undefined') return result

    UTM_KEYS.forEach((key) => {
        const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`))
        result[key] = match ? decodeURIComponent(match[1]) : ''
    })

    return result
}

/**
 * React-хук для получения UTM-параметров на клиенте
 */
export function useUtmParams(): UtmParams {
    const [params, setParams] = useState<UtmParams>({
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        utm_content: '',
        utm_term: ''
    })

    useEffect(() => {
        setParams(getUtmFromCookies())
    }, [])

    return params
}
