import { CSSProperties, ReactElement, ReactNode } from 'react'
import { PositionType, SizeType } from '@/shared/types/ui'

export interface DrawerProps {
    open: boolean
    onClose?: () => void
    contentWidth?: number | string
    contentHeight?: number | string
    lazy?: boolean
    closeOnOverlayClick?: boolean
    animationTime?: number
    showClose?: boolean
    position?: PositionType
    rounded?: boolean
    bordered?: boolean
    header?: ReactElement<any> | string | null
    footer?: ReactElement<any> | string | null
    children: ReactNode
    portalRoot?: HTMLElement
    className?: string
    style?: CSSProperties
    'aria-label'?: string
}

export interface ModalProps extends DrawerProps {
    onSubmit?: () => void | undefined
    closeBtnLabel?: string | null
    submitBtnLabel?: string | null
    size?: SizeType
    fullSize?: boolean
    fullWidth?: boolean
    zIndex?: string
}
