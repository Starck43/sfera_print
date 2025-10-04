'use client'

import { LazyImage } from '@/shared/ui/lazy-image'

import coverH from '@/images/header-h-bg.webp'
import coverV from '@/images/header-v-bg.webp'

const PageHeader = () => {
    return (
        <LazyImage
            src={{
                608: coverH, // для ширины >= 608px - горизонтальное
                portrait: coverV, // для портретной ориентации
                landscape: coverH, // для ландшафтной ориентации
                default: coverH
            }}
            alt=""
            fill
            style={{ objectFit: 'cover' }}
        />
    )
}

export default PageHeader
