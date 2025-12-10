'use client'

import { memo, ReactElement, ReactSVGElement, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { VerticalTimelineElement } from 'react-vertical-timeline-component'

import type { PostType } from '@/components/post'
import { classnames } from '@/shared/lib/helpers/classnames'
import { getDeviceImage } from '@/shared/lib/helpers/image'
import { detectDeviceOrientation } from '@/shared/lib/helpers/dom'
import { useHover } from '@/shared/lib/hooks/useHover'
import { LazyImage } from '@/shared/ui/lazy-image'

import cls from './Timeline.module.sass'

export interface TimelineElementProps extends PostType {
    icon?: ReactElement<ReactSVGElement>
    color?: string
}

// eslint-disable-next-line react/display-name
export const TimelineElement = memo((props: TimelineElementProps) => {
    const { title, desc, cover, icon } = props
    const [visible, setVisible] = useState(false)
    const [isHover, { onMouseLeave, onMouseEnter }] = useHover()
    const { ref, inView } = useInView({ threshold: 0.5 })

    const isMobile = detectDeviceOrientation()
    const imageSrc = getDeviceImage(cover)

    useEffect(() => {
        if (inView) {
            setVisible(true)
        }
    }, [inView])

    return (
        <VerticalTimelineElement
            visible={visible}
            icon={icon}
            className={classnames(cls, ['element'])}
            dateClassName={cls.element__date}
            textClassName={cls.element__content}
            iconClassName={cls.element__icon}
            // iconStyle={{ color: color }}
            // contentStyle={{ color: color }}
        >
            <div
                ref={ref}
                onMouseEnter={
                    isMobile
                        ? undefined
                        : desc || cover
                          ? isHover
                              ? onMouseLeave
                              : onMouseEnter
                          : undefined
                }
                onClick={desc || cover ? (isHover ? onMouseLeave : onMouseEnter) : undefined}
                onMouseLeave={isMobile ? undefined : onMouseLeave}
                className={classnames(cls, ['content__wrapper'], { hovered: isHover })}
            >
                {/*<div className={cls.element__content__inner}>*/}
                {/*    {event_date && (*/}
                {/*        <span className={cls.date}>*/}
                {/*            {new Date(event_date)*/}
                {/*                .toLocaleDateString('ru-RU', {*/}
                {/*                    month: 'long',*/}
                {/*                    year: 'numeric'*/}
                {/*                })*/}
                {/*                .replace(' г.', '')}*/}
                {/*        </span>*/}
                {/*    )}*/}
                {/*    {title && <p className={cls.title}>{title}</p>}*/}
                {/*    {excerpt && <p className={cls.excerpt}>{excerpt}</p>}*/}
                {/*</div>*/}

                {imageSrc.src && (
                    <LazyImage
                        src={imageSrc.src}
                        srcSet={imageSrc.srcSet}
                        alt={title}
                        sizes="(max-width: 1169px) 100vw, 50vw"
                        //unoptimized
                        className={classnames(cls, ['image'])}
                        fill
                    />
                )}
                {/*{desc && (*/}
                {/*    <div*/}
                {/*        dangerouslySetInnerHTML={{ __html: desc }}*/}
                {/*        onClick={onMouseLeave}*/}
                {/*        //onMouseLeave={onMouseLeave}*/}
                {/*        className={classnames(cls, ['desc'], { show: isHover })}*/}
                {/*    />*/}
                {/*)}*/}
            </div>
        </VerticalTimelineElement>
    )
})
