'use client'

import React, { memo, useEffect, useRef, useState } from 'react'
import type { PlayerProps } from 'next-video'
import Player from 'next-video/player'
import { useInView } from 'react-intersection-observer'

import { type MediaSource } from '@/shared/types/media'
import { useWindowDimensions } from '@/shared/lib/hooks/useWindowDimensions'
import { classnames } from '@/shared/lib/helpers/classnames'
import { getCurrentSource, getSourceUrl } from '@/shared/lib/helpers/image'
import { LazyImage } from '@/shared/ui/lazy-image'

import cls from './VideoPlayer.module.sass'

interface VideoPlayerProps extends Omit<PlayerProps, 'src' | 'poster'> {
    src?: MediaSource
    poster?: MediaSource
    alt?: string
    autoPlay?: boolean
    loop?: boolean
    width?: number
    height?: number
    sizes?: string
    className?: string
    style?: React.CSSProperties
}

const VideoPlayer = ({
    src,
    poster,
    alt,
    autoPlay = false,
    loop = false,
    width,
    height,
    sizes,
    className,
    ...other
}: VideoPlayerProps) => {
    const [isMounted, setIsMounted] = useState(false)
    const { ref: inViewRef, inView } = useInView({ threshold: 0.5 })
    const playerRef = useRef<HTMLVideoElement | any>(null)

    const { orientation, width: windowWidth } = useWindowDimensions()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!playerRef.current || !autoPlay) return
        if (inView) {
            playerRef.current.play().catch(() => {})
        } else {
            playerRef.current.pause()
        }
    }, [autoPlay, inView])

    const onErrorHandler = (event: any): void => {
        ;(event?.currentTarget as HTMLVideoElement).style.opacity = '0'
    }

    if (!isMounted) {
        const serverOrientation = 'landscape'
        const initialPoster = getCurrentSource(poster, serverOrientation, 1200)
        const posterUrl = getSourceUrl(initialPoster)

        if (posterUrl) {
            return (
                <div style={{ height: '100%', position: 'relative' }}>
                    <LazyImage
                        src={posterUrl}
                        alt={alt || ''}
                        sizes={sizes || '100vw'}
                        fill={!width}
                        width={width}
                        height={height}
                        style={{ height: '100%', objectFit: 'cover' }}
                    />
                </div>
            )
        }
        return <div style={{ height: '100%', backgroundColor: 'inherit' }} />
    }

    const currentSrc = getCurrentSource(src, orientation, windowWidth)
    const currentPoster = getCurrentSource(poster, orientation, windowWidth)
    const srcUrl = getSourceUrl(currentSrc)
    const posterUrl = getSourceUrl(currentPoster)

    if (!srcUrl) return null

    return (
        <div ref={inViewRef} style={{ height: '100%', pointerEvents: 'none' }}>
            <Player
                ref={playerRef}
                src={srcUrl}
                loop={loop}
                onError={onErrorHandler}
                muted
                crossOrigin="anonymous"
                className={classnames(cls, ['player'], {}, [className])}
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjePfu3X8ACWIDyvrS0aMAAAAASUVORK5CYII="
                {...other}
            >
                {posterUrl && (
                    <LazyImage
                        slot="poster"
                        src={posterUrl}
                        alt={alt || ''}
                        sizes={sizes || '100vw'}
                        fill={!width}
                        width={width}
                        height={height}
                        style={{ height: '100%', objectFit: 'cover' }}
                    />
                )}
            </Player>
        </div>
    )
}

export default memo(VideoPlayer)
