'use client'

import { memo } from 'react'
import { useNavigation } from '@/shared/lib/providers/NavigationProvider'
import { Button } from '@/shared/ui/button'

import BurgerIcon from '@/svg/burger-1.svg'

const BurgerButton = () => {
    const { showMenu, setShowMenu } = useNavigation()

    return (
        <Button
            Icon={<BurgerIcon />}
            feature="blank"
            size="medium"
            className="burger"
            onClick={() => setShowMenu(!showMenu)}
        />
    )
}

export default memo(BurgerButton)
