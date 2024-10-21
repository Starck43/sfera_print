'use client'

import React, { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'

const YandexMetrika = ({ enabled }: { enabled: boolean }) => {
    const pathName = usePathname()
    const searchParams = useSearchParams()
    const ID = parseInt(process.env.NEXT_PUBLIC_YANDEX_ID || '')

    useEffect(() => {
        if (enabled && ID && window?.ym) {
            window.ym(ID, 'hit', window.location.href)
        }
    }, [ID, enabled, pathName, searchParams])

    if (!ID || !enabled) return null

    return (
        <>
            <Script id="yandex-metrika">
                {`
                    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                    m[i].l=1*new Date();
                    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            
                    ym(${ID}, "init", {
                      defer: true,
                      clickmap:true,
                      trackLinks:true,
                      accurateTrackBounce:true
                    });    
                `}
            </Script>
            <noscript>
                <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={'https://mc.yandex.ru/watch/' + ID}
                        style={{ position: 'absolute', left: '-9999px' }}
                        alt=""
                    />
                </div>
            </noscript>
        </>
    )
    // return (
    //     <YMInitializer
    //         accounts={[parseInt(ID)]}
    //         options={{
    //             defer: true,
    //             webvisor: true,
    //             clickmap: true,
    //             trackLinks: true,
    //             accurateTrackBounce: true
    //         }}
    //         version="2"
    //     />
    // )
}

export default YandexMetrika
