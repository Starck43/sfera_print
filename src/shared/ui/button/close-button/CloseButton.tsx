import { ButtonHTMLAttributes, FC, memo, ReactNode } from 'react'

import { classnames } from '@/shared/lib/helpers/classnames'
import { Button } from '@/shared/ui/button'

import CloseIcon from '@/svg/close.svg'
import cls from './CloseButton.module.sass'

export interface CloseButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string
    handleOnClick: () => void
    children?: ReactNode
}

// eslint-disable-next-line react/display-name
export const CloseButton: FC<CloseButtonProps> = memo((props) => {
    const { handleOnClick, className, children } = props

    return (
        <Button
            Icon={<CloseIcon />}
            feature="clear"
            size="large"
            onClick={handleOnClick}
            className={classnames(cls, ['close__button'], {}, [className])}
        >
            {children}
        </Button>
    )
})
