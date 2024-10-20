import React, { CSSProperties } from 'react'

import { htmlParser } from '../html-parser'

import { classnames } from '@/shared/lib/helpers/classnames'
import { formatDate } from '@/shared/lib/helpers/datetime'
import { Slider } from '@/shared/ui/slider'
import { LazyImage } from '@/shared/ui/lazy-image'
import { getDeviceSrc } from '@/shared/lib/helpers/image'
import { Section } from '@/shared/ui/section'
import { Header } from '@/shared/ui/header'
import { Col } from '@/shared/ui/stack'
import { Loader } from '@/shared/ui/loader'

import type { Media, PostType } from './types'

import cls from './Post.module.sass'

interface ContentProps {
    data?: PostType | undefined
    className?: string
    style?: CSSProperties
}

const Post = ({ data, style, className }: ContentProps) => {
    if (!data) return <Loader />

    const { id, title, cover: image, media, event_date, desc } = data
    const parsedContent = htmlParser(desc)

    if (!desc || parsedContent instanceof Array && !parsedContent.length) {
        const imageSrc = getDeviceSrc(image)

        return (
            <Section className={className} style={style}>
                <Header title={title} tag="h2" transform="upperCase" className={cls.header} />
                {imageSrc ? (
                    <div className={cls.cover__wrapper}>
                        <LazyImage src={imageSrc} alt={title} fill />
                    </div>
                ) : null}
            </Section>
        )
    }

    return (
        <Slider
            media={media as Media[]}
            className={classnames(cls, ['container'], {}, [className])}
            style={style}
        >
            <Col gap="sm" align="start" fullWidth className={cls.details}>
                <Header
                    title={title}
                    subTitle={
                        event_date && <div className={cls.date}>{formatDate(event_date)}</div>
                    }
                    tag="h2"
                    transform="upperCase"
                />
                {parsedContent && <div className="html-container">{parsedContent}</div>}
            </Col>
        </Slider>
    )
}

export default Post
