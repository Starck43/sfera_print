import React, { memo } from 'react'
import Link from 'next/link'

import { LazyImage } from '@/shared/ui/lazy-image'

import brandImage from '@/images/atmo-logo-hw.png'
import brandMobileImage from '@/images/atmo-logo-vw.png'

const BrandLogo = () => {
    return (
        <div className="logo">
            <Link href="/">
                <LazyImage
                    src={{
                        992: brandImage.src,
                        default: brandMobileImage.src
                    }}
                    alt="Атмосфера Пространств"
                    width={brandImage.width}
                    height={brandImage.height}
                    preload
                />
            </Link>
        </div>
    )
}

export default memo(BrandLogo)
