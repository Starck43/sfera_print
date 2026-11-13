'use client'

import { ReactNode, ElementType, memo } from 'react'

import { Header } from '@/shared/ui/header'
import { BackButton } from '@/shared/ui/button'

import cls from './Layout.module.sass'

interface PageHeaderProps {
    title: ReactNode
    titleTag: ElementType
    onClose: () => void
}

const PageHeader = ({ title, titleTag, onClose }: PageHeaderProps) => {
    return (
        <Header
            tag={titleTag}
            title={title}
            subTitle={<BackButton handleOnClick={onClose} />}
            inlined
            align="start"
            className={cls.header}
        />
    )
}

export default memo(PageHeader)
