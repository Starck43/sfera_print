import React, { memo } from 'react'
import Image from 'next/image'

import { CircleCarousel } from '@/shared/ui/circle-carousel'
import { SITE_TITLE } from '@/shared/const/page'

import background from '@/images/header-bg.jpg'
import cls from './PageHeader.module.sass'
import { VideoPlayer } from '@/shared/ui/video-player'

const carouselLoopDuration = 15000

const PageHeader = () => (
    <div className={cls.container}>
        <Image
            alt={SITE_TITLE}
            src={background}
            placeholder="blur"
            quality={86}
            fill
            sizes="100vw"
            style={{
                objectFit: 'cover'
            }}
            priority
        />

        {/*<HeaderAnimation/>*/}
        <VideoPlayer
            src={'/videos/sp-bg-anim.webm'}
            preload={process.env.NODE_ENV !== 'development' ? 'auto' : 'none'}
            autoPlay={process.env.NODE_ENV !== 'development'}
            loop={process.env.NODE_ENV !== 'development'}
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
