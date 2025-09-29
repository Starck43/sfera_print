import React, { Suspense } from 'react'
import { type Metadata } from 'next'
import Image from 'next/image'
import localFont from 'next/font/local'
import Link from 'next/link'

import { RouteEvents } from '@/components/routes/route-events'
import PageHeader from '@/components/page-header'
import { BurgerButton, Navbar } from '@/components/navbar'
import { YandexMetrika } from '@/components/yandex-metrika'
import { TopMailCounter } from '@/components/mailru-metrika'

import { NavigationProvider } from '@/shared/lib/providers/NavigationProvider'
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/shared/const/page'
import brandImage from '@/images/atmo-logo-hw.png'
import brandMobileImage from '@/images/atmo-logo-vw.png'

import './globals.scss'
import { LazyImage } from '@/shared/ui/lazy-image'

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
        title: 'Атмосфера Пространств',
        images: '/atmo-logo.svg'
    },
    applicationName: 'atmosfera',
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
    src: [
        {
            path: './fonts/Onest-Regular.ttf',
            weight: '400',
            style: 'normal'
        },
        {
            path: './fonts/Onest-SemiBold.ttf',
            weight: '700',
            style: 'normal'
        },
        {
            path: './fonts/Onest-Black.ttf',
            weight: '900',
            style: 'normal'
        }
    ],
    variable: '--font-family-primary'
})

const accentFont = localFont({
    src: [
        {
            path: './fonts/inter-28pt-Regular.ttf',
            weight: '400',
            style: 'normal'
        },
        {
            path: './fonts/inter-28pt-SemiBold.ttf',
            weight: '700',
            style: 'normal'
        },
        {
            path: './fonts/inter-28pt-Black-Italic.ttf',
            weight: '900',
            style: 'normal'
        }
    ],
    variable: '--font-family-secondary'
})

const analyticsEnabled = process.env.NODE_ENV === 'production'

export default async function RootLayout({
    children = null
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="ru"
            className={`${brandFont.className} ${accentFont.variable}`}
            suppressHydrationWarning
        >
            <body>
                <header>
                    <div className="logo">
                        <Link href="/">
                            <LazyImage
                                src={brandImage.src}
                                alt="Атмосфера Пространств"
                                width={brandImage.width}
                                height={brandImage.height}
                                priority
                                unoptimized
                            />
                            <LazyImage
                                src={brandMobileImage.src}
                                alt="Атмосфера Пространств"
                                width={brandMobileImage.width}
                                height={brandMobileImage.height}
                                priority
                                unoptimized
                            />
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
