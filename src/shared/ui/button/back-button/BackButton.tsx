import { ButtonHTMLAttributes, FC, memo, ReactNode } from 'react'

import { classnames } from '@/shared/lib/helpers/classnames'
import { Button } from '@/shared/ui/button'

import BackIcon from '@/svg/arrow-right.svg'
import cls from './BackButton.module.sass'

export interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string
    handleOnClick: () => void
    children?: ReactNode
}

// eslint-disable-next-line react/display-name
export const BackButton: FC<CloseButtonProps> = memo((props) => {
    const { handleOnClick, className, children, ...extra } = props

    return (
        <Button
            Icon={<BackIcon />}
            feature="clear"
            size="large"
            onClick={handleOnClick}
            className={classnames(cls, ['back__button'], {}, [className])}
            {...extra}
        >
            {children}
        </Button>
    )
})
