import Link from 'next/link'

import type { NavItemType } from '../types'

import cls from '../Navbar.module.sass'

const NavItem = (props: NavItemType) => {
    const { path, title, subtitle } = props

    return (
        <Link key={path} href={path}>
            <div className={cls.title}>{title}</div>
            <span className={cls.subtitle}>{subtitle}</span>
        </Link>
    )
}

export default NavItem
