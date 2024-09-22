'use client'

import React, { useLayoutEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import anime from 'animejs/lib/anime.es'

import { calcHexColor, generateSvgChart, splitTextIntoArray } from './helper'
import { classnames } from '@/shared/lib/helpers/classnames'

import cls from '../Philosophy.module.sass'

interface Stat {
    group: string
    percent: number
}

const ClientsStat = ({ data }: { data: Stat[] }) => {
    const viewBoxWidth = 300
    const chartRadius = viewBoxWidth / 6
    const totalDuration = 3000
    const arcColor = calcHexColor('#737681', '#22201e', data.length)
    const { arcs, refs } = generateSvgChart(data, viewBoxWidth, chartRadius)
    const { ref, inView } = useInView({
        //rootMargin: '10px 0px 0px 0px',
        threshold: 0.2,
        fallbackInView: true,
        triggerOnce: true
    })

    useLayoutEffect(() => {
        if (!inView) return
        const percentElements = document.querySelectorAll('.text-percent')

        const animation = anime.timeline({
            easing: 'easeInOutSine',
            duration: totalDuration,
            direction: 'normal',
            loop: false
        })

        animation
            .add({
                targets: '.' + cls.chart,
                duration: 300,
                opacity: 1,
                translateY: '-3ren',
                easing: 'easeInOutExpo'
            })
            .add({
                targets: '.' + cls.chart + ' .arc-path',
                strokeDashoffset: [anime.setDashoffset, 0],
                duration: (_, i) => {
                    return (totalDuration / 100) * data[i].percent
                }
            })
            .add({
                targets: '.' + cls.chart + ' .ref-path',
                strokeDashoffset: [anime.setDashoffset, 0],
                duration: 300,
                delay: (_, i) => {
                    return i * 100
                }
            })
            .add({
                targets: '.' + cls.chart + ' .ref-text',
                opacity: 1,
                translateY: [10, 0],
                translateX: [10, 0],
                duration: 500,
                delay: (_, i) => {
                    return i * 300
                }
            })
            .add({
                targets: percentElements,
                easing: 'easeInOutExpo',
                round: 1,
                duration: 1000,
                update: (anim) => {
                    percentElements.forEach((el, index) => {
                        const value = (anim.progress / 100) * data[index].percent
                        el.innerHTML = Math.round(value) + '%'
                    })
                }
            })
    }, [data, inView])

    return arcs ? (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`-5 30 ${viewBoxWidth + 10} ${viewBoxWidth - 65}`}
            width="100%"
            height="100%"
            fill="none"
            className={cls.chart}
            ref={ref}
        >
            <defs>
                <filter id="dropshadow" height="122%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                    <feOffset in="blur" dx="0.7" dy="0.7" result="offsetBlur" />
                    <feOffset dx="1" dy="1" result="offsetblur" />
                    <feFlood floodColor="#3D4574" floodOpacity="0.3" result="offsetColor" />
                    <feComposite
                        in="offsetColor"
                        in2="offsetBlur"
                        operator="in"
                        result="offsetBlur"
                    />
                </filter>
            </defs>

            {arcs?.map((path, index) => (
                <g key={`arc-path-${index}`}>
                    <use xlinkHref={`#arc${index + 1}`} filter="url(#dropshadow)" />
                    <path
                        d={path}
                        stroke={arcColor(index)}
                        strokeWidth={(index + 1) * 3}
                        id={`arc${index + 1}`}
                        className={classnames(cls, ['arc__path'], {}, ['arc-path'])}
                    />
                </g>
            ))}

            {refs?.map((item, index) => {
                const descArray = splitTextIntoArray(data[index].group || '', 12)
                const x = (item.text.x - item.text.singX * 8).toFixed(2)
                const y = (item.text.y - item.text.singY * 4).toFixed(2)
                return (
                    <g key={`ref-path-${index}`}>
                        <path
                            d={item.path}
                            className={classnames(cls, ['ref__path'], {}, ['ref-path'])}
                        />
                        <text
                            x={x}
                            y={y}
                            width="50%"
                            textAnchor={item.text.singX > 0 ? 'end' : 'start'}
                            fill="currentColor"
                            className="ref-text"
                        >
                            <tspan
                                x={x}
                                dy="0"
                                className={classnames(cls, ['percent'], {}, ['text-percent'])}
                            >
                                0%
                            </tspan>
                            {descArray.map((word, idx) => (
                                <tspan
                                    key={`ref-word-${idx}`}
                                    x={x}
                                    dy={idx === 0 ? 14 : 10}
                                    className={cls.group}
                                >
                                    {word}
                                </tspan>
                            ))}
                        </text>
                    </g>
                )
            })}
        </svg>
    ) : null
}

export default ClientsStat
