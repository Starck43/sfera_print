import React, { memo } from 'react'
import Image from 'next/image'

import { CircleCarousel } from '@/shared/ui/circle-carousel'
import { SITE_TITLE } from '@/shared/const/page'

import background from '@/images/header-bg.jpg'
import cls from './PageHeader.module.sass'

const carouselLoopDuration = 15000

const PageHeader = () => (
    <div className={cls.container}>
        <Image
            alt={SITE_TITLE}
            src={background}
            placeholder="blur"
            quality={100}
            fill
            sizes="100vw"
            style={{
                objectFit: 'cover'
            }}
            priority
        />

        {/*<HeaderAnimation/>*/}

        <CircleCarousel duration={300} loopDuration={carouselLoopDuration} infinite={process.env.NODE_ENV !== 'development'} />
    </div>
)

export default memo(PageHeader)
