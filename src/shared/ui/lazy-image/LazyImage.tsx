'use client'

import React, { memo } from 'react'
import Image, { type ImageProps } from 'next/image'
import { classnames } from '@/shared/lib/helpers/classnames'

import cls from './LazyImage.module.sass'

const placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjePfu3X8ACWIDyvrS0aMAAAAASUVORK5CYII="

const LazyImage = ({ src, alt, className, blurDataURL, ...other }: ImageProps) => {
    const onLoadHandler = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.style.opacity = '1'
        e.currentTarget.classList.add(cls.loaded)
    }

    return (
        <Image
            src={src}
            overrideSrc={typeof src === 'string' ? src : undefined}
            alt={alt || ''}
            //srcSet={'srcset' in image && image.srcset.length ? createSrcSet(image.srcset) : undefined}
            {...other}
            quality={85}
            placeholder={blurDataURL ? 'blur' : placeholder}
            blurDataURL={blurDataURL}
            onLoad={onLoadHandler as any}
            onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
            className={classnames(cls, ['image'], {}, [className])}
        />
    )
}

export default memo(LazyImage)
