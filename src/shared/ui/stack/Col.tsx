import { ElementType, ForwardedRef, forwardRef, memo } from 'react'
import { Flex, FlexProps } from './Flex'

type ColProps<E extends ElementType> = Omit<FlexProps<E>, 'direction'>

const Col = <E extends ElementType = keyof HTMLElementTagNameMap>(
    props: ColProps<E>,
    ref: ForwardedRef<HTMLDivElement>
) => {
    const { align = 'start' } = props
    return <Flex ref={ref} direction="column" align={align as FlexProps<E>['align']} {...props} />
}

const ForwardedCol = forwardRef(Col)
export default memo(ForwardedCol)
