import { memo, ReactElement, ReactSVGElement, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

import { VerticalTimelineElement } from 'react-vertical-timeline-component'

import type { PostType } from '@/components/post'
import { classnames } from '@/shared/lib/helpers/classnames'
import { useHover } from '@/shared/lib/hooks/useHover'
import { getDeviceSrc } from '@/shared/lib/helpers/image'

import cls from './Timeline.module.sass'

export interface TimelineElementProps extends PostType {
    icon?: ReactElement<ReactSVGElement>
    color?: string
}

// eslint-disable-next-line react/display-name
export const TimelineElement = memo((props: TimelineElementProps) => {
    const { title, excerpt, desc, event_date, cover, icon, color } = props
    const [visible, setVisible] = useState(false)
    const [isHover, { onMouseLeave, onMouseEnter }] = useHover()
    const { ref, inView } = useInView({ threshold: 0.5 })

    const imageSrc = getDeviceSrc(cover)

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
                onMouseEnter={desc || cover ? (isHover ? onMouseLeave : onMouseEnter) : undefined}
                onClick={desc || cover ? (isHover ? onMouseLeave : onMouseEnter) : undefined}
                onMouseLeave={onMouseLeave}
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

                {imageSrc && (
                    <Image
                        src={imageSrc}
                        alt={title}
                        sizes="(max-width: 1169px) 100vw, 50vw"
                        width={600}
                        height={600}
                        onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                        unoptimized
                        className={classnames(cls, ['cover'])}
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
