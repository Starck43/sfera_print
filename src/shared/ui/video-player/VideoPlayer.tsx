'use client'

import React, { memo, SyntheticEvent } from 'react'
import Player from 'next-video/player'
import type { DefaultPlayerProps } from 'next-video'
import { LazyImage } from '@/shared/ui/lazy-image'

import cls from './VideoPlayer.module.sass'

interface VideoPlayerProps extends DefaultPlayerProps {
    poster?: string
    alt?: string
    width?: number
    height?: number
}

const VideoPlayer = ({ src, poster, alt, width, height, ...other }: VideoPlayerProps) => {
    if (!src) return null

    const onLoadDataHandler = (e: SyntheticEvent<HTMLVideoElement>) => {
       e.currentTarget.style.opacity = '1'
    }

    return (
        <>
            {poster && (
                <LazyImage
                    src={poster}
                    fill={!width || !height}
                    width={width}
                    height={height}
                    alt={alt || ''}
                />
            )}
            <Player
                src={src}
                poster={poster}
                muted
                className={cls.player}
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjePfu3X8ACWIDyvrS0aMAAAAASUVORK5CYII="
                onLoadedData={onLoadDataHandler as any}
                {...other}
            >
                <style>{`
                ::part(center) {--media-control-background: rgba(0,0,0, 0.5) !important;padding: 0.8rem; border-radius: 50%; width: var(--controls-width); height: var(--controls-width);}
                ::part(play) {--media-button-icon-transform: 0; --media-icon-color: var(--secondary-color) !important; transition: all 150ms ease-out !important;} 
                ::part(play):hover {--media-icon-color: inherit !important; background-color: var(--secondary-color) !important;} 
                ::part(seek-backward), ::part(seek-forward) {display: none;}
            `}</style>
            </Player>
        </>
    )
}

export default memo(VideoPlayer)
