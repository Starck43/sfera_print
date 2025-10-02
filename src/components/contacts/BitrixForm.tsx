'use client'

import Script from 'next/script'

export default function BitrixForm() {
    const src = process.env.NEXT_PUBLIC_BITRIX_FORM_SRC
    const data = process.env.NEXT_PUBLIC_BITRIX_FORM_DATA

    if (!src || !data) return null

    return (
        <div>
            <Script
                id="bitrix24-form"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            (function(w,d,u){
              var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);
              s.setAttribute('data-b24-form', '${data}');
              s.setAttribute('data-skip-moving', 'true');
              var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
            })(window,document,'${src}');
          `
                }}
            />
        </div>
    )
}
