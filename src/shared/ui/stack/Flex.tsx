import {ComponentProps, CSSProperties, ElementType, ForwardedRef, forwardRef, ReactNode, RefObject} from "react"
import Link from "next/link"

import {classnames} from "@/shared/lib/helpers/classnames"
import type {SizeType} from "@/shared/types/ui"

import cls from "./Stack.module.sass"


type FlexJustify = "start" | "end" | "center" | "between" | "evenly"
type FlexAlign = "start" | "end" | "center" | "baseline"
type FlexDirection = "row" | "rowReverse" | "column" | "columnReverse"

export interface FlexProps<E extends ElementType = ElementType> {
	as?: E | keyof HTMLElementTagNameMap
	ref?: ForwardedRef<HTMLDivElement>
	href?: string
	justify?: FlexJustify
	align?: FlexAlign
	direction?: FlexDirection
	wrap?: boolean
	gap?: SizeType
	fullWidth?: boolean
    className?: string
    style?: CSSProperties
    role?: string
	children?: ReactNode | ReactNode[]
}

export type FlexPropsType<E extends ElementType> = FlexProps<E> & Omit<ComponentProps<E>, keyof FlexProps>

// eslint-disable-next-line react/display-name
export const Flex = forwardRef(<E extends ElementType = keyof HTMLElementTagNameMap>(
	{
		as = "div",
		href,
		justify = "center",
		align = "center",
		direction = "row",
		wrap = false,
		gap = "sm",
		fullWidth = false,
		style = {},
		className,
		children,
		...others
	}: FlexPropsType<E>, ref: ForwardedRef<HTMLDivElement>
) => {

	const classes = classnames(
		cls,
		["flex", `justify__${justify}`, `align__${align}`, `direction__${direction}`, `gap__${gap}`],
		{wrap, fullWidth},
		[className],
	)

	const Tag = as
	return href ? (
		<Link href={href} className={classes} style={style}>
			{children}
		</Link>
	) : (
		<Tag ref={ref} className={classes} style={style} {...others}>
			{children}
		</Tag>
	)
})

