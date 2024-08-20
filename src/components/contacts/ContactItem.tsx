import {memo} from "react"
import type {Contact} from "./types"

import {NavLink} from "@/shared/ui/link"
import PhoneIcon from "/public/svg/mobile-phone.svg"


const ContactItem = ({item, className}: {
	item: Contact,
	className?: string
}) => {
	return (
		item.link ? (
			<NavLink
				href={item.link}
				Icon={item.link.startsWith("tel") ? PhoneIcon : null}
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