'use client'

import {memo} from "react"
import {useNavigation} from "@/shared/lib/providers/NavigationProvider"
import {Button} from "@/shared/ui/button"

import BurgerIcon from "@/svg/burger-2.svg"


const BurgerButton = () => {
	const {showMenu, setShowMenu} = useNavigation()

	return (
		<Button
			Icon={<BurgerIcon/>}
			feature='clear'
			size='large'
			className='burger'
			onClick={() => setShowMenu(!showMenu)}
		/>
	)
}

export default memo(BurgerButton)