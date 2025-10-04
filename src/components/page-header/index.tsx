import { LazyImage } from '@/shared/ui/lazy-image'

import coverH from '@/images/header-h-bg.webp'
import coverV from '@/images/header-v-bg.webp'
import { CircleCarousel } from '@/shared/ui/circle-carousel'

const isDev = process.env.NODE_ENV === 'development'
const slideDuration = parseInt(process.env.CIRCLE_CAROUSEL_SLIDE_DURATION || '3000')

const PageHeader = () => {
    return (
        <>
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
            <CircleCarousel slideDuration={slideDuration} duration={300} infinite={!isDev} />
        </>
    )
}

export default PageHeader
