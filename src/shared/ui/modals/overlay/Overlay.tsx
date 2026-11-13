'use client'

import { CSSProperties, ElementType, memo, useEffect } from 'react'

import { classnames } from '@/shared/lib/helpers/classnames'

import cls from './Overlay.module.sass'

interface OverlayProps {
    as?: ElementType
    open: boolean
    show: boolean
    onClick?: () => void
    className?: string
    style?: CSSProperties
}

// eslint-disable-next-line react/display-name
export const Overlay = memo((props: OverlayProps) => {
    const { as = 'div', open, show, onClick, className, style } = props
    const Tag = as

    // Блокировку прокрутки задаём в эффекте, а не во время рендера
    useEffect(() => {
        if (!show) return

        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = ''
        }
    }, [show])

    return (
        <Tag
            aria-modal
            className={classnames(cls, ['overlay'], { open, show }, [className])}
            onClick={onClick}
            style={style}
        />
    )
})
