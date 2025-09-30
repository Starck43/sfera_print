import {
    ComponentProps,
    CSSProperties,
    ElementType,
    ForwardedRef,
    forwardRef,
    ReactNode
} from 'react'
import Link from 'next/link'

import { classnames } from '@/shared/lib/helpers/classnames'
import type { SizeType } from '@/shared/types/ui'

import cls from './Stack.module.sass'

type FlexJustify = 'start' | 'end' | 'center' | 'between' | 'evenly'
type FlexAlign = 'start' | 'end' | 'center' | 'baseline'
type FlexDirection = 'row' | 'rowReverse' | 'column' | 'columnReverse'

export interface FlexProps<E extends ElementType = ElementType> {
    as?: E | keyof HTMLElementTagNameMap
    ref?: ForwardedRef<HTMLDivElement>
    href?: string
    justify?: FlexJustify
    align?: FlexAlign
    direction?: FlexDirection
    wrap?: boolean
    gap?: SizeType
    fullWidth?: boolean
    className?: string
    style?: CSSProperties
    role?: string
    onClick?: (e: any) => void
    children?: ReactNode | ReactNode[]
}

export type FlexPropsType<E extends ElementType> = FlexProps<E> &
    Omit<ComponentProps<E>, keyof FlexProps>

// eslint-disable-next-line react/display-name
export const Flex = forwardRef(
    <E extends ElementType = keyof HTMLElementTagNameMap>(
        {
            as: Tag = 'div',
            href,
            justify = 'center',
            align = 'center',
            direction = 'row',
            wrap = false,
            gap = 'sm',
            fullWidth = false,
            style = {},
            className,
            children,
            ...others
        }: FlexPropsType<E>,
        ref: ForwardedRef<HTMLDivElement>
    ) => {
        const classes = classnames(
            cls,
            [
                'flex',
                `justify__${justify}`,
                `align__${align}`,
                `direction__${direction}`,
                `gap__${gap}`
            ],
            { wrap, fullWidth },
            [className]
        )

        if (href) {
            return (
                <Link href={href} className={classes} style={style}>
                    {children}
                </Link>
            )
        }

        return (
            <Tag ref={ref} className={classes} style={style} {...(others as any)}>
                {children}
            </Tag>
        )
    }
)
