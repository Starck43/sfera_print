'use client'

import React, { useLayoutEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import anime from 'animejs/lib/anime.es'

import { classnames } from '@/shared/lib/helpers/classnames'
import type { Stat } from '../types'

import { generateSvgDiagram, splitTextIntoArray } from './helper'

import cls from '../Philosophy.module.sass'

const CommonStat = ({ data }: { data: Stat[] }) => {
    const viewBoxWidth = 300
    const startOrbitRadius = viewBoxWidth / 8
    const orbitOpacityStep = 0.8 / data.length
    const orbitRadiusStep = (viewBoxWidth - 50 - startOrbitRadius * 2) / data.length / 2
    const totalDuration = 2000
    const { orbits, satellites, refs } = generateSvgDiagram(
        data,
        viewBoxWidth,
        startOrbitRadius,
        orbitRadiusStep
    )
    const { ref, inView } = useInView({
        //rootMargin: '10px 0px 0px 0px',
        threshold: 0.2,
        fallbackInView: true,
        triggerOnce: true
    })

    useLayoutEffect(() => {
        if (!inView) return

        const animation = anime.timeline({
            easing: 'easeInOutQuad',
            duration: totalDuration,
            direction: 'normal',
            loop: false
        })

        animation
            .add({
                targets: '.' + cls.stat__diagram + ' .satellite-dot',
                duration: 800,
                scale: [0, 1],
                opacity: 1
            })
            .add({
                targets: '.' + cls.stat__diagram + ' .orbit-path',
                strokeDashoffset: [anime.setDashoffset, 0],
                duration: 1500,
                delay: (_, i) => i * 100
            })
            .add({
                targets: '.' + cls.stat__diagram + ' .ref-text',
                delay: 300,
                duration: 600,
                opacity: 1
            })
    }, [data, inView])

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`-5 -5 ${viewBoxWidth + 10} ${viewBoxWidth + 10}`}
            width="100%"
            height="100%"
            fill="none"
            className={cls.stat__diagram}
            ref={ref}
        >
            {orbits?.map((orbit, index) => {
                const orbitOpacity = 1 - index * orbitOpacityStep
                return (
                    <g key={`orbit-${index}`} className={cls.orbits}>
                        <path d={orbit} strokeOpacity={orbitOpacity} className="orbit-path" />
                    </g>
                )
            })}

            {satellites?.map(({ x, y }, index) => {
                return (
                    <g
                        key={`satellite-${index}`}
                        className={classnames(cls, ['satellite__dot'], {}, ['satellite-dot'])}
                        style={{ opacity: 1 }}
                    >
                        <circle cx={x} cy={y} r={3} />
                        <circle cx={x} cy={y} r={6} fill="none" />
                    </g>
                )
            })}

            {refs?.map(({ text }, index) => {
                const descArray = splitTextIntoArray(data[index].desc || '', 15)
                const x = text.x.toFixed(2)
                const y = (text.y - (text.singY < 0 ? -20 : 16 + descArray.length * 10)).toFixed(3)
                return (
                    <g
                        key={`ref-path-${index}`}
                        className={classnames(cls, ['ref__text'], {}, ['ref-text'])}
                    >
                        <text x={x} y={y} textAnchor={'middle'} fill="currentColor">
                            <tspan
                                x={x}
                                dy={0}
                                className={classnames(cls, ['title'], {}, ['text-title'])}
                            >
                                {data[index].title || ''}
                            </tspan>

                            {descArray.map((word, idx) => (
                                <tspan
                                    key={`desc-word-${idx}`}
                                    x={x}
                                    dy={idx === 0 ? 14 : 10}
                                    className={classnames(cls, ['desc'], {}, ['text-desc'])}
                                >
                                    {word}
                                </tspan>
                            ))}
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}

export default CommonStat
