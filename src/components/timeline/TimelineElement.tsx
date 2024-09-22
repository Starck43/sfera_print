import { memo, ReactElement, ReactSVGElement, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

import { VerticalTimelineElement } from 'react-vertical-timeline-component'

import type { PostType } from '@/components/post'
import { classnames } from '@/shared/lib/helpers/classnames'
import { useHover } from '@/shared/lib/hooks/useHover'

import cls from './Timeline.module.sass'

export interface TimelineElementProps extends PostType {
    icon?: ReactElement<ReactSVGElement>
}

// eslint-disable-next-line react/display-name
export const TimelineElement = memo((props: TimelineElementProps) => {
    const { title, excerpt, desc, event_date, cover, icon } = props
    const [visible, setVisible] = useState(false)
    const [isHover, { onMouseLeave, onMouseEnter }] = useHover()
    const { ref, inView } = useInView({ threshold: 0.5 })

    useEffect(() => {
        if (inView) {
            setVisible(true)
        }
    }, [inView])

    return (
        <VerticalTimelineElement
            visible={visible}
            contentArrowStyle={{
                borderRightColor: 'inherit',
                borderWidth: '0.7rem'
            }}
            icon={icon}
            className={classnames(cls, ['element'])}
            dateClassName={cls.element__date}
            textClassName={cls.element__content}
            iconClassName={classnames(cls, ['element__icon'], {}, ['grey__style'])}
        >
            <div
                ref={ref}
                onMouseEnter={desc || cover ? onMouseEnter : undefined}
                onMouseLeave={onMouseLeave}
                className={classnames(cls, ['content__wrapper'])}
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

                {cover && (
                    <Image
                        src={typeof cover === 'object' && 'src' in cover ? cover.src : cover}
                        alt={title}
                        sizes="(max-width: 1169px) 100vw, 50vw"
                        width={600}
                        height={600}
                        onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                        unoptimized
                        className={classnames(cls, ['cover'], { hovered: isHover })}
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
