import { CSSProperties, ReactElement, ReactNode } from 'react'
import { PositionType, SizeType } from '@/shared/types/ui'

export interface DrawerProps {
    open: boolean
    onClose?: () => void
    lazy?: boolean
    closeOnOverlayClick?: boolean
    animationTime?: number
    showClose?: boolean
    position: PositionType
    fullSize?: boolean
    rounded?: boolean
    bordered?: boolean
    header?: ReactElement | null
    footer?: ReactElement | null
    children: ReactNode
    portalRoot?: HTMLElement
    className?: string
    style?: CSSProperties
}

export interface ModalProps extends DrawerProps {
    onSubmit?: () => void | undefined
    closeBtnLabel?: string | null
    submitBtnLabel?: string | null
    size?: SizeType
    fullWidth?: boolean
    zIndex?: string
}
