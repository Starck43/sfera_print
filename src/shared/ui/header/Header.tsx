import { memo, ReactNode, ElementType, CSSProperties } from 'react'
import Link from 'next/link'

import { classnames } from '@/shared/lib/helpers/classnames'
import type { FlexAlign, SizeType, Size } from '@/shared/types/ui'
import { Flex } from '@/shared/ui/stack'

import cls from './Header.module.sass'

type InfoStatus = 'default' | 'success' | 'warning' | 'error'
type Transform = 'upperFirst' | 'upperCase' | 'lowerCase'

type HeaderProps = {
    tag?: ElementType
    href?: string
    title: ReactNode
    subTitle?: ReactNode | string
    align?: FlexAlign
    inlined?: boolean
    fullWidth?: boolean
    gap?: SizeType
    transform?: Transform
    status?: InfoStatus
    size?: Size
    shadowed?: boolean
    style?: CSSProperties
    className?: string
    children?: ReactNode
}

// eslint-disable-next-line react/display-name
export const Header = memo((props: HeaderProps) => {
    const {
        tag = 'h3',
        href,
        title,
        subTitle,
        align = 'start' as FlexAlign,
        gap = 'xs' as SizeType,
        inlined = false,
        fullWidth = true,
        transform = 'upperCase' as Transform,
        shadowed = false,
        status = 'default' as InfoStatus,
        size = 'md' as Size,
        className,
        style,
        children
    } = props

    const subtitle =
        typeof subTitle === 'string' ? (
            <span className={cls.subtitle}>{subTitle}</span>
        ) : (
            subTitle
        )

    const Title = tag
    const content = (
        <Title
            className={classnames(cls, ['title', align, transform], {
                shadowed,
                fullWidth
            })}
            style={style}
        >
            {title}
        </Title>
    )

    if (children || subtitle) {
        return (
            <Flex
                align={align}
                justify={inlined ? 'start' : align}
                gap={gap}
                href={href}
                wrap={!inlined && !fullWidth}
                fullWidth={inlined}
                direction={inlined ? 'row' : 'column'}
                className={classnames(
                    cls,
                    ['header', status, size, align],
                    { inlined },
                    [className]
                )}
            >
                {content}
                {subtitle}
                {children}
            </Flex>
        )
    }

    return href ? (
        <Link
            href={href}
            className={classnames(cls, ['header', 'link', status, size], {}, [
                className
            ])}
        >
            {content}
        </Link>
    ) : (
        content
    )
})
