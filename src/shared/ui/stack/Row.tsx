import { memo, ComponentProps, ElementType, forwardRef, ForwardedRef } from 'react'
import { Flex, FlexProps } from './Flex'

type RowProps<E extends ElementType> = Omit<FlexProps<E>, 'direction'> &
    Omit<ComponentProps<E>, keyof FlexProps>

const Row = <E extends ElementType = keyof HTMLElementTagNameMap>(
    props: RowProps<E>,
    ref: ForwardedRef<HTMLDivElement>
) => {
    const { align = 'start' } = props
    return <Flex {...props} align={align} direction="row" ref={ref} />
}

const ForwardedRow = forwardRef(Row)
export default memo(ForwardedRow)
