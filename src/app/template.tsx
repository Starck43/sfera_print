'use client'

import PageHeader from '@/components/page-header'
import { BrandLogo } from '@/components/brand-logo'
import { BurgerButton, Navbar } from '@/components/navbar'

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <>
            <header id="header">
                <BrandLogo />
                <BurgerButton />
                <Navbar className="navbar" />
            </header>
            <main id="main">
                <PageHeader />
                {children}
            </main>
        </>
    )
}
