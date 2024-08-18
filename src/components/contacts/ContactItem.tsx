import {FC, memo, SVGProps} from "react"
import type {Contact} from "./types"

import {NavLink} from "@/shared/ui/link"


const ContactItem = ({item, Icon = null, className}: {
	item: Contact,
	Icon?: FC<SVGProps<SVGSVGElement>> | null
	className?: string
}) => {
	return (
		item.link ? (
			<NavLink
				href={item.link}
				Icon={Icon}
				target={(item.type === "email" || item.type === "tel") ? undefined : "_blank"}
				className={className}
			>
				{item.value}
			</NavLink>
		) : (
			item.value
		)
	)
}

export default memo(ContactItem)