import { CSSProperties, ElementType, memo } from 'react'

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
    document.body.style.overflow = show ? 'hidden' : ''

    const Tag = as
    return (
        <Tag
            aria-modal
            className={classnames(cls, ['overlay'], { open, show }, [className])}
            onClick={onClick}
            style={style}
        />
    )
})
