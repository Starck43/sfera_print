'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import type { NavItemType } from '../types'

import cls from '../Navbar.module.sass'

const NavItem = (props: NavItemType) => {
    const { path, title, subtitle } = props
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        startTransition(() => {
            router.push(path)
        })
    }

    return (
        <Link
            key={path}
            href={path}
            onClick={handleClick}
            className={isPending ? cls.loading : ''}
        >
            <div className={cls.title}>{title}</div>
            <span className={cls.subtitle}>{subtitle}</span>
        </Link>
    )
}

export default NavItem
