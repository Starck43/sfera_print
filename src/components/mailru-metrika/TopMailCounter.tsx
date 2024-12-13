'use client'

import React from 'react'
import Script from 'next/script'

const TopMailCounter = ({ enabled }: { enabled: boolean }) => {
    const MAILRU_ID = parseInt(process.env.NEXT_PUBLIC_MAILRU_ID || '')

    if (!MAILRU_ID || !enabled) return null

    return (
        <Script id="top-mailru">
            {`
                var _tmr = window._tmr || (window._tmr = []); 
                _tmr.push({id: "${MAILRU_ID}", type: "pageView", start: (new Date()).getTime()}); 
                (function (d, w, id) { 
                  if (d.getElementById(id)) return; 
                  var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id; 
                  ts.src = "https://top-fwz1.mail.ru/js/code.js"; 
                  var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);}; 
                  if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } 
                })(document, window, "tmr-code"); 
            `}
        </Script>
    )
}

export default TopMailCounter
