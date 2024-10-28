import { CircleCarousel } from '@/shared/ui/circle-carousel'
import { VideoPlayer } from '@/shared/ui/video-player'

import cls from './PageHeader.module.sass'

const slidesCount = parseInt(process.env.CIRCLE_CAROUSEL_SLIDES_COUNT || '5')
const slideDuration = parseInt(process.env.CIRCLE_CAROUSEL_SLIDE_DURATION || '3000')

const PageHeader = () => (
    <div className={cls.container}>

        {/*<HeaderAnimation/>*/}
        <VideoPlayer
            src={'/videos/sp-bg-anim.webm'}
            poster={'/images/header-bg.webp'}
            preload={process.env.NODE_ENV !== 'development' ? 'auto' : 'none'}
            autoPlay={process.env.NODE_ENV !== 'development'}
            loop={false}
            controls={false}
            style={{ height: '100%', pointerEvents: 'none'}}
        />

        <CircleCarousel
            itemsLength={slidesCount}
            slideDuration={slideDuration}
            duration={300}
            infinite={process.env.NODE_ENV !== 'development'}
        />
    </div>
)

export default PageHeader
