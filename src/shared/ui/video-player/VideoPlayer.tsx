'use client'

import React, { useRef, useEffect, memo } from 'react'
import Player from 'next-video/player'
import type { PlayerProps } from 'next-video'
import { useInView } from 'react-intersection-observer'

import { classnames } from '@/shared/lib/helpers/classnames'
import { LazyImage } from '@/shared/ui/lazy-image'

import cls from './VideoPlayer.module.sass'

interface VideoPlayerProps extends PlayerProps {
    poster?: string
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
    const { ref: inViewRef, inView } = useInView({ threshold: 0.5 })
    const playerRef = useRef<HTMLVideoElement | any>(null)

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

    if (!src) return null

    // const onLoadDataHandler = (e: SyntheticEvent<HTMLVideoElement>) => {
    //     e.currentTarget.style.opacity = '1'
    // }

    return (
        <div ref={inViewRef} style={{ height: '100%', pointerEvents: 'none' }}>
            <Player
                ref={playerRef}
                src={src}
                // autoPlay={autoPlay}
                // poster={poster}
                loop={loop}
                onError={onErrorHandler}
                muted
                crossOrigin="anonymous"
                className={classnames(cls, ['player'], {}, [className])}
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjePfu3X8ACWIDyvrS0aMAAAAASUVORK5CYII="
                //onCanPlay={onLoadDataHandler as any}
                {...other}
            >
                {poster && (
                    <LazyImage
                        slot="poster"
                        src={poster}
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
