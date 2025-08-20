import { CircleCarousel } from '@/shared/ui/circle-carousel'
import { VideoPlayer } from '@/shared/ui/video-player'
import { LazyImage } from '@/shared/ui/lazy-image'

import cover from '@/images/header-bg.webp'
import cls from './PageHeader.module.sass'

// const slidesCount = parseInt(process.env.CIRCLE_CAROUSEL_SLIDES_COUNT || '5')
const slideDuration = parseInt(process.env.CIRCLE_CAROUSEL_SLIDE_DURATION || '3000')

const PageHeader = () => (
    <div className={cls.container}>
        <LazyImage
            src={cover}
            alt="Рекламно-производственная компания Сфера Принт"
            sizes={'100%'}
            fill
            priority
            style={{ objectFit: 'cover' }}
        />
        {/*<HeaderAnimation/>*/}
        <VideoPlayer
            src={'/videos/sp-bg-anim.webm'}
            autoPlay
            controls={false}
            loop={false}
            style={{ height: '100%', pointerEvents: 'none' }}
        />

        <CircleCarousel
            slideDuration={slideDuration}
            duration={300}
            infinite={process.env.NODE_ENV !== 'development'}
        />
    </div>
)

export default PageHeader
