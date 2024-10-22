import React, { memo } from 'react'

import { CircleCarousel } from '@/shared/ui/circle-carousel'
import { VideoPlayer } from '@/shared/ui/video-player'
import cls from './PageHeader.module.sass'

const carouselLoopDuration = 15000

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
            duration={300}
            loopDuration={carouselLoopDuration}
            infinite={process.env.NODE_ENV !== 'development'}
        />
    </div>
)

export default memo(PageHeader)
