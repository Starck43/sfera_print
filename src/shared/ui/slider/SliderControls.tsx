import { FC, memo } from 'react'

import { classnames } from '@/shared/lib/helpers/classnames'
import { Flex } from '@/shared/ui/stack'

import LeftArrowIcon from '@/svg/arrow-left.svg'
import RightArrowIcon from '@/svg/arrow-right.svg'
import cls from './Slider.module.sass'

export interface SliderControlsProps {
    onClickNext: () => void
    onClickPrev: () => void
    className?: string
}

const SliderControls: FC<SliderControlsProps> = ({
    className,
    onClickNext,
    onClickPrev
}) => {
    return (
        <Flex
            justify="between"
            align="center"
            className={classnames(cls, ['slider__controls'], {}, [className])}
        >
            <LeftArrowIcon
                onClick={onClickPrev}
                className={classnames(cls, ['arrow', 'left'])}
            />
            <RightArrowIcon
                onClick={onClickNext}
                className={classnames(cls, ['arrow', 'right'])}
            />
        </Flex>
    )
}

export default memo(SliderControls)
