import { CircleCarousel } from '@/shared/ui/circle-carousel'
import { VideoPlayer } from '@/shared/ui/video-player'

import coverH from '@/images/header-h-bg.webp'
import coverV from '@/images/header-v-bg.webp'
import cls from './PageHeader.module.sass'

// const slidesCount = parseInt(process.env.CIRCLE_CAROUSEL_SLIDES_COUNT || '5')
const slideDuration = parseInt(process.env.CIRCLE_CAROUSEL_SLIDE_DURATION || '3000')
const isDev = process.env.NODE_ENV === 'development'

const PageHeader = () => {
    return (
        <div className={cls.container}>
            {/*<HeaderAnimation/>*/}
            <VideoPlayer
                src={{
                    landscape: '/videos/atmo-h-video.mp4',
                    portrait: '/videos/atmo-v-video.mp4'
                }}
                poster={{
                    landscape: coverH,
                    portrait: coverV
                }}
                autoPlay={!isDev}
                controls={false}
                loop={!isDev}
            />

            <CircleCarousel
                slideDuration={slideDuration}
                duration={300}
                infinite={!isDev}
            />
        </div>
    )
}

export default PageHeader
