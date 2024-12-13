import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Link from 'next/link'
// import { Montserrat } from 'next/font/google'

import { RouteEvents } from '@/components/routes/route-events'
import PageHeader from '@/components/page-header'
import { BurgerButton, Navbar } from '@/components/navbar'
import { YandexMetrika } from '@/components/yandex-metrika'

import { NavigationProvider } from '@/shared/lib/providers/NavigationProvider'
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/shared/const/page'
import BrandLogo from '@/sp-logo.svg'

import './globals.scss'
import { TopMailCounter } from '@/components/mailru-metrika'

export const metadata: Metadata = {
    title: {
        template: SITE_TITLE + ' | %s',
        default: SITE_TITLE
    },
    description: SITE_DESCRIPTION,
    keywords: ['изготовление рекламы', 'фотопечать', 'рекламная продукция'],
    metadataBase: new URL(process.env.URL || SITE_URL),
    alternates: {
        canonical: new URL(process.env.URL || SITE_URL)
    },
    openGraph: {
        type: 'website',
        siteName: SITE_TITLE,
        url: new URL(process.env.URL || SITE_URL),
        title: 'Сфера Принт',
        images: '/sp-logo.svg'
    },
    applicationName: 'sferaprint',
    authors: [{ name: 'S. Shabalin', url: 'https://istarck.ru' }],
    creator: 'Stanislav Shabalin',
    formatDetection: {
        email: false,
        address: false,
        telephone: false
    },
    referrer: 'origin-when-cross-origin',
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': 1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    },
    other: {
        'yandex-verification': 'd322f95e36747029'
    }
}

const brandFont = localFont({
    src: './fonts/PFBeauSansPro-Regular.woff2',
    variable: '--font-family-primary',
    weight: '400',
    style: 'normal',
    display: 'swap'
})

const titleFont = localFont({
    src: './fonts/Montserrat-Medium.woff2',
    //subsets: ['cyrillic'],
    variable: '--font-family-secondary',
    weight: '700',
    display: 'swap'
})

export default async function RootLayout({
    children = null
}: Readonly<{ children: React.ReactNode }>) {
    const analyticsEnabled = process.env.NODE_ENV === 'production'

    return (
        <html
            lang="ru"
            className={`${brandFont.className} ${titleFont.variable}`}
            suppressHydrationWarning
        >
            <body>
                <header>
                    <div className="logo">
                        <Link href="/">
                            <BrandLogo />
                        </Link>
                    </div>
                    <NavigationProvider>
                        <RouteEvents />
                        <PageHeader />
                        <BurgerButton />
                        <Navbar className="navbar" />
                    </NavigationProvider>
                </header>
                {children}
                <Suspense>
                    <YandexMetrika enabled={analyticsEnabled} />
                    <TopMailCounter enabled={analyticsEnabled} />
                </Suspense>
            </body>
        </html>
    )
}
