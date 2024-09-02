import {FC, SVGProps} from "react"
import Link, {type LinkProps} from "next/link"
import Image from "next/image"

import {classnames} from "@/shared/lib/helpers/classnames"
import type {NavLinkFeatureType, NavLinkSizeType} from "./types"

import cls from "./NavLink.module.sass"

export interface NavLinkProps extends LinkProps {
	title?: string
	alt?: string
	Icon?: FC<SVGProps<SVGSVGElement>> | string
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
}

export const NavLink = (props: NavLinkProps) => {
	const {
		href,
		title,
		alt,
		Icon,
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
		...other
	} = props

	if (!href) return title

	return (
		<Link
			href={href}
			title={alt}
			className={classnames(
				cls,
				["link", feature, size, Icon && !title ? "squared" : undefined],
				{fullWidth, squared, reverse, rounded, shadowed, underlined, animation, disabled},
				[className],
			)}
			{...other}
		>
			{typeof Icon === "string"
				? <Image
					src={Icon}
					alt={alt || ''}
					className={cls.icon}
					width={24}
					height={24}
					style={{width: 'auto'}}
				/>
				: Icon ? <Icon className={cls.icon}/> : null
			}
			<span className={cls.title}>{title}</span>
		</Link>
	)
}
