'use client'

import React, { memo } from 'react'
import Image, { type ImageProps } from 'next/image'

import { classnames } from '@/shared/lib/helpers/classnames'

import cls from './LazyImage.module.sass'

const generateThumbnail = (src?: string) => {
    if (!src) {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjePfu3X8ACWIDyvrS0aMAAAAASUVORK5CYII="

    }

    return src.replace(/\.(jpg|jpeg|png|webp)$/, '.thumbnail.jpg')
}

const LazyImage = ({ src, alt, className, ...other }: ImageProps) => {
    const onLoadHandler = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.style.opacity = '1'
        e.currentTarget.classList.add(cls.loaded)
    }

    return (
        <Image
            {...other}
            src={src}
            overrideSrc={typeof src === 'string' ? src : undefined}
            //srcSet={'srcset' in image && image.srcset.length ? createSrcSet(image.srcset) : undefined}
            alt={alt}
            placeholder="blur"
            blurDataURL={generateThumbnail(src as string)}
            onLoad={onLoadHandler as any}
            onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
            className={classnames(cls, ['image'], {}, [className])}
        />
    )
}

export default memo(LazyImage)
