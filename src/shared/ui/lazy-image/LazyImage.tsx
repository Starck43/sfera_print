'use client'

import React from 'react'
import Image, { type ImageProps } from 'next/image'

import { classnames } from '@/shared/lib/helpers/classnames'

import cls from './LazyImage.module.sass'

const LazyImage = ({ src, alt, className, ...other }: ImageProps) => {
    return (
        <Image
            src={src}
            //srcSet={'srcset' in image && image.srcset.length ? createSrcSet(image.srcset) : undefined}
            alt={alt}
            fill
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjePfu3X8ACWIDyvrS0aMAAAAASUVORK5CYII="
            onLoad={(e) => (e.currentTarget.style.opacity = '1')}
            className={classnames(cls, ['image'], {}, [className])}
            {...other}
        />
    )
}

export default LazyImage
