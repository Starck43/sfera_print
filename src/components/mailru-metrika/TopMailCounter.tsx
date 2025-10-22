'use client'

import Script from 'next/script'
import Image from 'next/image'

const TopMailCounter = ({ enabled }: { enabled: boolean }) => {
    const ID = process.env.NEXT_PUBLIC_MAILRU_ID

    if (!ID || !enabled) {
        console.log('TopMailCounter: disabled -', {
            hasId: !!ID,
            enabled,
            id: ID
        })
        return null
    }

    const isValidId = /^\d+$/.test(ID)
    if (!isValidId) {
        console.error('TopMailCounter: Invalid ID format', ID)
        return null
    }

    return (
        <>
            <Script id="top-mailru-counter" strategy="afterInteractive">
                {`
          var _tmr = window._tmr || (window._tmr = []);
          _tmr.push({id: "${ID}", type: "pageView", start: (new Date()).getTime()});
          (function(d, w, id) {
            if (d.getElementById(id)) return;
            var ts = d.createElement("script"); 
            ts.type = "text/javascript"; 
            ts.async = true; 
            ts.id = id;
            ts.src = "https://top-fwz1.mail.ru/js/code.js";
            var f = function() {
              var s = d.getElementsByTagName("script")[0]; 
              s.parentNode.insertBefore(ts, s);
            };
            if (w.opera == "[object Opera]") { 
              d.addEventListener("DOMContentLoaded", f, false);
            } else { 
              f(); 
            }
          })(document, window, "topmailru-code");
        `}
            </Script>
            <noscript>
                <div>
                    <Image
                        src={`https://top-fwz1.mail.ru/counter?id=${ID};js=na`}
                        style={{ position: 'absolute', left: '-9999px' }}
                        alt="Top.Mail.Ru"
                        width={1}
                        height={1}
                    />
                </div>
            </noscript>
        </>
    )
}

export default TopMailCounter
