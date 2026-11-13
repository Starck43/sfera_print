'use client'

import React, { ReactNode, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { Portal } from '@/shared/ui/portal'
import { Col } from '@/shared/ui/stack'
import { classnames } from '@/shared/lib/helpers/classnames'
import usePageAnimation from '@/shared/lib/hooks/usePageAnimation'
import { useEscapeToClose } from '@/shared/lib/hooks/useEscapeToClose'
import type { SizeType } from '@/shared/types/ui'

import ScrollToTop from '@/components/scroll-to-top/ScrollToTop'
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

    const router = useRouter()
    const { handleClick, isVisible } = usePageAnimation('.' + className)
    // Страница закрывается одной анимацией — стрелкой, Escape или кликом мимо,
    // поэтому повторные вызовы во время закрытия игнорируются
    const isClosing = useRef(false)

    const closePage = useCallback(() => {
        if (isClosing.current) return

        isClosing.current = true
        handleClick(() => {
            const onClosed = handleOnClose ?? (() => router.push('/'))

            onClosed()
            // После перехода страница может быть открыта снова без перемонтирования:
            // флаг нужно снять, иначе её больше не получится закрыть
            window.setTimeout(() => {
                isClosing.current = false
            }, 500)
        })
    }, [handleClick, handleOnClose, router])

    useEscapeToClose(closePage, isVisible)

    const content = (
        <>
            {/* Клик мимо страницы закрывает её так же, как стрелка «назад» */}
            {sectionMode && <div className={cls.backdrop} onClick={closePage} aria-hidden="true" />}
            <Col
                gap={gap}
                justify="between"
                className={classnames(cls, ['container'], { sectionMode }, [className])}
            >
                <PageHeader title={title} titleTag={title ? titleTag : 'div'} onClose={closePage} />
                {children}
                <ScrollToTop />
            </Col>
        </>
    )

    return <Portal>{content}</Portal>
}
