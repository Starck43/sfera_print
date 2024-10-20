'use client'

import {
    CSSProperties,
    HTMLAttributes,
    memo,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react'
import { useInView } from 'react-intersection-observer'

import type { SizeType } from '@/shared/types/ui'
import { Col } from '@/shared/ui/stack'
import { classnames } from '@/shared/lib/helpers/classnames'

import cls from './Section.module.sass'

type FlexAlign = 'start' | 'end' | 'center'
type Transform = 'upperFirst' | 'upperCase' | 'lowerCase'

export interface InfoProps extends HTMLAttributes<HTMLDivElement> {
    as?: keyof HTMLElementTagNameMap
    title?: string
    titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
    gap?: SizeType
    align?: FlexAlign
    transform?: Transform
    className?: string
    style?: CSSProperties
    children: ReactNode
}

const Section = (props: InfoProps) => {
    const {
        as: tag = 'section',
        title = null,
        titleTag: Title = 'h3',
        gap = 'md' as SizeType,
        align = 'start' as FlexAlign,
        transform = 'upperCase' as Transform,
        className,
        children,
        style,
        ...others
    } = props

    const ref = useRef<HTMLDivElement | null>(null)
    const { ref: inViewRef, inView } = useInView({
        //rootMargin: '10px 0px 0px 0px',
        threshold: 0.1,
        fallbackInView: true,
        triggerOnce: true
    })

    const setRefs = useCallback(
        (node: HTMLDivElement | null) => {
            ref.current = node
            inViewRef(node)
        },
        [inViewRef]
    )
    const [frameIsLoaded, setFrameIsLoaded] = useState(false)

    useEffect(() => {
        if (!ref.current) return
        const iframe = ref.current.querySelector('iframe')
        if (iframe) {
            iframe.addEventListener('load', () => {
                setFrameIsLoaded(true)
            })
        } else {
            setFrameIsLoaded(true)
        }
        return () =>
            iframe?.removeEventListener('load', () => {
                setFrameIsLoaded(true)
            })
    }, [])

    return (
        <Col
            ref={setRefs}
            as={tag}
            fullWidth
            gap={gap}
            align={align}
            justify="start"
            className={classnames(cls, ['section'], { inView }, [className])}
            style={{
                ...style,
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : ''
            }}
            {...others}
        >
            {title && <Title className={classnames(cls, ['title', transform])}>{title}</Title>}
            <Col gap="none" justify="start" className={classnames(cls, ['content'], { frameIsLoaded }, [])}>{children}</Col>
        </Col>
    )
}

export default memo(Section)
