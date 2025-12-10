'use client'

import React, { useState, useLayoutEffect } from 'react'
import Image, { getImageProps, type ImageProps } from 'next/image'
import { classnames } from '@/shared/lib/helpers/classnames'
import { createSrcSet, getCurrentSource, getSourceUrl } from '@/shared/lib/helpers/image'
import { useWindowDimensions } from '@/shared/lib/hooks/useWindowDimensions'
import { type MediaSource } from '@/shared/types/media'

import cls from './LazyImage.module.sass'

const placeholder =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjePfu3X8ACWIDyvrS0aMAAAAASUVORK5CYII='

interface LazyImageProps extends Omit<ImageProps, 'srcSet' | 'src'> {
    src?: MediaSource
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
    const { orientation, width: windowWidth } = useWindowDimensions()
    const [isClient, setIsClient] = useState(false)

    // Используем useLayoutEffect с requestAnimationFrame
    useLayoutEffect(() => {
        // Откладываем установку состояния до следующего кадра анимации
        requestAnimationFrame(() => {
            setIsClient(true)
        })
    }, [])

    const onLoadHandler = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.style.opacity = '1'
    }

    const onErrorHandler = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.style.visibility = 'hidden'
    }

    const currentSrc = getCurrentSource(
        src,
        isClient ? orientation : 'landscape',
        isClient ? windowWidth : 0
    )
    const srcUrl = getSourceUrl(currentSrc)

    if (!srcUrl) return null

    // Если нет srcSet, используем обычный Image
    if (!srcSet || srcSet.length === 0) {
        return (
            <Image
                src={srcUrl}
                alt={alt || ''}
                width={width}
                height={height}
                fill={!width && !height}
                className={classnames(cls, ['image'], {}, [className])}
                onLoad={onLoadHandler}
                onError={onErrorHandler}
                placeholder={blurDataURL ? 'blur' : 'empty'}
                blurDataURL={blurDataURL || placeholder}
                {...rest}
            />
        )
    }

    // Если есть srcSet, используем art direction с getImageProps
    const props: ImageProps = {
        alt: alt || '',
        src: srcUrl,
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
    const { media, srcSet: generatedSrcSet } = createSrcSet(srcSet)

    return (
        <picture>
            {generatedSrcSet && <source media={media} srcSet={generatedSrcSet} />}
            <img
                {...imageProps}
                srcSet={generatedSrcSet}
                alt={props.alt}
                onLoad={onLoadHandler}
                onError={onErrorHandler}
            />
        </picture>
    )
}

export default LazyImage
