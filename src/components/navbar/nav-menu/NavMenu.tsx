import { ReactNode } from 'react'

import { useNavigation } from '@/shared/lib/providers/NavigationProvider'
import { classnames } from '@/shared/lib/helpers/classnames'

import { PositionType } from '@/shared/types/ui'
import { Drawer } from '@/shared/ui/modals'

import cls from '../Navbar.module.sass'

interface NavMenuProps {
    position?: PositionType
    children: ReactNode
    className?: string
}

const copyright = (
    <span className={cls.copyright}>
        © {new Date().getFullYear()} ООО «Атмосфера Пространств» Все права защищены
    </span>
)

export const NavMenu = (props: NavMenuProps) => {
    const { position, children, className } = props
    const { showMenu, setShowMenu } = useNavigation()

    if (!showMenu) return null

    return (
        <Drawer
            position={position || 'right'}
            bordered={false}
            //fullSize
            animationTime={300}
            open={showMenu}
            closeOnOverlayClick={false}
            footer={copyright}
            onClose={() => setShowMenu(false)}
            className={classnames(cls, ['navmenu__container'], {}, [className])}
        >
            {children}
        </Drawer>
    )
}
