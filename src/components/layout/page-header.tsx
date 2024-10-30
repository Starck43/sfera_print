'use client'
import { ReactNode, ElementType, memo } from 'react'

import usePageAnimation from '@/shared/lib/hooks/usePageAnimation'
import { Header } from '@/shared/ui/header'
import { BackButton } from '@/shared/ui/button'

import cls from './Layout.module.sass'

interface PageHeaderProps {
    title: ReactNode
    titleTag: ElementType
    onClose?: () => void
    className: string
}

const PageHeader = ({title, titleTag, onClose: handleOnClose, className}: PageHeaderProps) => {
    const { handleClick } = usePageAnimation(className)

    const onClose = () => {
        handleClick(handleOnClose ? handleOnClose : () => history.back())
    }
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
