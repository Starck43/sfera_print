import {FC, ReactNode, SVGProps} from "react"
import Link, {type LinkProps} from "next/link"

import type {NavLinkFeatureType, NavLinkSizeType} from "./types"

import {classnames} from "@/shared/lib/helpers/classnames"

import cls from "./NavLink.module.sass"

export interface NavLinkProps extends LinkProps {
	alt?: string
	Icon?: FC<SVGProps<SVGSVGElement>> | null
	feature?: NavLinkFeatureType
	size?: NavLinkSizeType
	fullWidth?: boolean
	squared?: boolean
	disabled?: boolean
	rounded?: boolean
	shadowed?: boolean
	underlined?: boolean
	animation?: boolean
	reverse?: boolean
	className?: string
	target?: string
	rel?: string
	children: ReactNode | string
}

// eslint-disable-next-line react/display-name
export const NavLink = (props: NavLinkProps) => {
	const {
		href,
		alt,
		Icon = null,
		feature = "clear",
		size = "normal",
		fullWidth = false,
		squared = false,
		disabled = false,
		reverse = false,
		rounded = false,
		shadowed = false,
		underlined = false,
		animation = false,
		className,
		children,
		...other
	} = props

	if (!href) return children

	return (
		<Link
			href={href}
			title={alt}
			className={classnames(
				cls,
				["link", feature, size, Icon && !children ? "squared" : undefined],
				{fullWidth, squared, reverse, rounded, shadowed, underlined, animation, disabled},
				[className],
			)}
			{...other}
		>
			{Icon && <Icon className={cls.icon}/>}
			<span className={cls.title}>{children}</span>
		</Link>
	)
}
