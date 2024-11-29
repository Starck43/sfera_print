'use client'
import { ReactNode, ElementType, memo } from 'react'
import { useRouter } from 'next/navigation'

import usePageAnimation from '@/shared/lib/hooks/usePageAnimation'
import { Header } from '@/shared/ui/header'
import { BackButton } from '@/shared/ui/button'

import cls from './Layout.module.sass'

interface PageHeaderProps {
    title: ReactNode
    titleTag: ElementType
    onClose?: () => void
    container: string
}

const PageHeader = ({title, titleTag, onClose: handleOnClose, container}: PageHeaderProps) => {
    const { handleClick } = usePageAnimation(container)
    const route = useRouter()
    const onClose = () => {
        handleClick(handleOnClose ? handleOnClose : () => route.push('/'))
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
