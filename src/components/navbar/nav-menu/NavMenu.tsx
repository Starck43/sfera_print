import { ReactNode } from 'react'

import { useNavigation } from '@/shared/lib/providers/NavigationProvider'
import { classnames } from '@/shared/lib/helpers/classnames'

import { PositionType } from '@/shared/types/ui'
import { Drawer } from '@/shared/ui/modals'

import cls from '../Navbar.module.sass'
import { AnimationProvider } from '@/shared/lib/providers/AnimationProvider'

interface NavMenuProps {
    position?: PositionType
    children: ReactNode
    className?: string
}

const copyright = (
    <span className={cls.copyright}>
        © {new Date().getFullYear()} ООО «Сфера Принт» Все права защищены
    </span>
)

const getWidthByBreakpoint = () => {
    const width = window.innerWidth
    if (width >= 1200) return '35%' // xl
    if (width >= 992) return '45%' // lg
    if (width >= 768) return '55%' // md
    if (width >= 400) return '75%' // sm
    return '100%'
}

export const NavMenu = (props: NavMenuProps) => {
    const { position, children, className } = props
    const { showMenu, setShowMenu } = useNavigation()

    if (!showMenu) return null

    return (
        <AnimationProvider>
            <Drawer
                position={position || 'right'}
                contentWidth={getWidthByBreakpoint()}
                animationTime={400}
                open={showMenu}
                closeOnOverlayClick={false}
                footer={copyright}
                onClose={() => setShowMenu(false)}
                className={classnames(cls, ['navmenu__container'], {}, [className])}
            >
                {children}
            </Drawer>
        </AnimationProvider>
    )
}
