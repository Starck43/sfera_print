import {
    ButtonHTMLAttributes,
    ForwardedRef,
    HTMLAttributeAnchorTarget,
    ReactNode,
    forwardRef,
    ReactElement,
    ReactSVGElement
} from 'react'
import Link from 'next/link'

import { classnames } from '@/shared/lib/helpers/classnames'
import { AlignType } from '@/shared/types/ui'

import type { ButtonFeature, ButtonSize } from './types'

import cls from './Button.module.sass'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: ForwardedRef<HTMLButtonElement>
    feature?: ButtonFeature
    Icon?: ReactElement<ReactSVGElement>
    size?: ButtonSize
    align?: AlignType
    fullWidth?: boolean
    bordered?: boolean
    rounded?: boolean
    squared?: boolean
    shadowed?: boolean
    disabled?: boolean
    href?: string
    target?: HTMLAttributeAnchorTarget
    className?: string
    children?: ReactNode
}

// eslint-disable-next-line react/display-name
export const Button = forwardRef(
    (props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
        const {
            Icon,
            title,
            href,
            target = '_self',
            feature = 'blank',
            size = 'normal',
            align = 'center',
            fullWidth = false,
            rounded = false,
            bordered = false,
            squared = false,
            shadowed = false,
            disabled = false,
            className,
            children,
            ...other
        } = props

        let content = (
            <>
                {Icon}
                {children || title || null}
            </>
        )

        if (href) {
            content = (
                <Link
                    className={classnames(cls, ['link'])}
                    target={target}
                    href={href}
                >
                    {content}
                </Link>
            )
        }

        return (
            <button
                ref={ref}
                type="button"
                disabled={disabled}
                {...other}
                className={classnames(
                    cls,
                    [
                        'button',
                        feature,
                        size,
                        align,
                        Icon && (children || title)
                            ? 'icon__with__title'
                            : undefined,
                        children || title ? 'has__title' : 'only__icon',
                        href ? 'is__link' : undefined
                    ],
                    {
                        fullWidth,
                        bordered,
                        rounded,
                        squared,
                        shadowed,
                        disabled
                    },
                    [className]
                )}
            >
                {content}
            </button>
        )
    }
)
