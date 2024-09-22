'use client'

import { memo, ReactElement, ReactSVGElement } from 'react'

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import { PostType } from '@/components/post'
import { TimelineElement } from './TimelineElement'

import 'react-vertical-timeline-component/style.min.css'
import cls from './Timeline.module.sass'

interface TimelineProps<T> {
    items: T[]
    topIcon?: ReactElement<ReactSVGElement>
    icon?: ReactElement<ReactSVGElement>
}

const Timeline = <T,>({ items, icon, topIcon }: TimelineProps<T>) => {
    return (
        <VerticalTimeline className={cls.timeline} layout="2-columns">
            {topIcon && (
                <VerticalTimelineElement visible icon={topIcon} iconClassName={cls.element__icon} />
            )}
            {items?.map((item, idx) => (
                <TimelineElement
                    key={`timeline-${idx}`}
                    icon={icon}
                    {...(item as PostType)}
                />
            ))}
        </VerticalTimeline>
    )
}

export default memo(Timeline)
