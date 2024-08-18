import {ElementType, FC, HTMLAttributeAnchorTarget, HTMLAttributes, useMemo} from "react"
import Link from "next/link"

import type {DirectionType, SizeType} from "@/shared/types/ui"
import {classnames} from "@/shared/lib/helpers/classnames"
import {Flex} from "../stack"

import cls from "./Card.module.sass"


interface CardProps extends HTMLAttributes<HTMLDivElement> {
	as?: ElementType
	gap?: SizeType
	fullWidth?: boolean
	bordered?: boolean
	rounded?: boolean
	shadowed?: boolean
	direction?: DirectionType
	href?: string
	target?: HTMLAttributeAnchorTarget
	className?: string
}

export const Card: FC<CardProps> = (props) => {
	const {
		as = "div",
		gap = "none",
		fullWidth = true,
		bordered = false,
		rounded = false,
		shadowed = false,
		direction = "column",
		href,
		target = "_self",
		className,
		children,
		...other
	} = props

	const content = useMemo(() => (
		<Flex
			as={as}
			wrap={direction === "column"}
			align="start"
			gap={gap}
			fullWidth={fullWidth}
			direction={direction}
			justify={"start"}
			className={classnames(
				cls,
				["card", href ? "linked" : ""],
				{bordered, rounded, shadowed},
				[className],
			)}
			{...other}
		>
			{children}
		</Flex>
	), [])

	return (
		href
			? <Link href={href} target={target} className={cls.card__link}>{content}</Link>
			: content
	)
}
