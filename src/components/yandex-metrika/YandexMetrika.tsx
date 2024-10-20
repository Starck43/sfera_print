'use client'

import Router from 'next/router'
import React, { useCallback, useEffect } from 'react'
import ym, { YMInitializer } from 'react-yandex-metrika'

type Props = {
    enabled: boolean
}

const YandexMetrika: React.FC<Props> = ({ enabled }) => {
    const ID = process.env.NEXT_PUBLIC_YANDEX_ID
    const hit = useCallback(
        (url: string) => {
            if (enabled) {
                ym('hit', url)
            } else {
                console.log(`%c[YandexMetrika](HIT)`, `color: var(--primary-color)`, url)
            }
        },
        [enabled]
    )

    useEffect(() => {
        hit(window.location.pathname + window.location.search)
        Router.events.on('routeChangeComplete', (url: string) => hit(url))
    }, [hit])

    if (!ID || !enabled) return null

    return (
        <YMInitializer
            accounts={[parseInt(ID)]}
            options={{
                defer: true,
                webvisor: true,
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true
            }}
            version="2"
        />
    )
}

export default YandexMetrika
