import React, { ReactNode } from 'react'

import ScrollToTop from '@/components/scroll-to-top/ScrollToTop'
import { classnames } from '@/shared/lib/helpers/classnames'

import type { SizeType } from '@/shared/types/ui'
import { Portal } from '@/shared/ui/portal'
import { Col } from '@/shared/ui/stack'
import PageHeader from './page-header'

import cls from './Layout.module.sass'

interface PageLayoutProps {
    title?: string | ReactNode
    titleTag?: 'h1' | 'h2' | 'h3'
    gap?: SizeType
    sectionMode?: boolean
    handleOnClose?: () => void
    children: ReactNode | null
    className?: string
}

export default function PageLayout(props: PageLayoutProps) {
    const {
        title,
        titleTag = 'h1',
        gap = 'none',
        sectionMode = false,
        handleOnClose,
        children,
        className = 'page__layout'
    } = props

    let content = (
        <Col
            gap={gap}
            justify="between"
            className={classnames(cls, ['container'], { sectionMode }, [className])}
        >
            <PageHeader
                title={title}
                titleTag={titleTag}
                onClose={handleOnClose}
                container={className}
            />
            {children}
            <ScrollToTop />
        </Col>
    )

    if (handleOnClose) {
        content = <Portal target={document.body}>{content}</Portal>
    }

    return content
}
