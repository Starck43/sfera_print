'use client'

import React from 'react'
import { getImageProps, type ImageProps } from 'next/image'
import { classnames } from '@/shared/lib/helpers/classnames'

import cls from './LazyImage.module.sass'
import { createSrcSet } from '@/shared/lib/helpers/image'

const placeholder =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjePfu3X8ACWIDyvrS0aMAAAAASUVORK5CYII='

interface LazyImageProps extends Omit<ImageProps, 'srcSet'> {
    srcSet?: string[]
}

const LazyImage = ({
    src,
    srcSet,
    alt,
    width,
    height,
    className = '',
    blurDataURL,
    ...rest
}: LazyImageProps) => {
    const onLoadHandler = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.style.opacity = '1'
        // e.currentTarget.classList.add(cls.loaded)
    }
    const onErrorHandler = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.style.visibility = 'hidden'
    }

    const props: ImageProps = {
        alt: alt || '',
        src,
        overrideSrc: src as string,
        draggable: false,
        width,
        height,
        fill: !width && !height,
        unoptimized: true,
        placeholder: blurDataURL ? 'blur' : ('empty' as any),
        blurDataURL: blurDataURL || placeholder,
        ...rest,
        className: classnames(cls, ['image'], {}, [className])
    }

    const { props: imageProps } = getImageProps(props)

    return (
        <picture>
            {srcSet?.length && <source {...createSrcSet(srcSet)} />}
            <img {...imageProps} alt={props.alt} onLoad={onLoadHandler} onError={onErrorHandler} />
        </picture>
    )
}

export default LazyImage
