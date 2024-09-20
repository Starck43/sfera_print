'use client'

import React, { ElementType, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

import { classnames } from '@/shared/lib/helpers/classnames'
import usePageAnimation from '@/shared/lib/hooks/usePageAnimation'

import type { SizeType } from '@/shared/types/ui'
import { Portal } from '@/shared/ui/portal'
import { Header } from '@/shared/ui/header'
import { Col } from '@/shared/ui/stack'
import { BackButton } from '@/shared/ui/button'

import cls from './Layout.module.sass'
import ScrollToTop from '@/components/scroll-to-top/ScrollToTop'

interface PageLayoutProps {
    title?: string | ReactNode
    titleTag?: 'h1' | 'h2' | 'h3'
    gap?: SizeType
    sectionMode?: boolean
    handleOnClose?: () => void
    children: ReactNode | null
    className?: string
    style?: React.CSSProperties
}

export default function PageLayout(props: PageLayoutProps) {
    const {
        title,
        titleTag = 'h1',
        gap = 'none',
        sectionMode = false,
        handleOnClose,
        children,
        className = 'page__layout',
        style
    } = props
    const router = useRouter()
    const { handleClick } = usePageAnimation(className)

    const onClose = () => {
        handleClick(handleOnClose ? handleOnClose : () => router.push('/'))
    }

    let content = (
        <Col
            gap={gap}
            justify="between"
            className={classnames(cls, ['container'], { sectionMode }, [
                className
            ])}
            style={style}
        >
            <Header
                tag={titleTag as ElementType}
                title={title}
                subTitle={<BackButton handleOnClick={onClose} />}
                inlined
                align="start"
                className={cls.title}
            />
            {children}
            <ScrollToTop/>
        </Col>
    )

    if (handleOnClose) {
        content = <Portal target={document.body}>{content}</Portal>
    }

    return content
}
