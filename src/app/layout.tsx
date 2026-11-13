import React, { Suspense } from 'react'
import { type Metadata } from 'next'
import localFont from 'next/font/local'

import { RouteEvents } from '@/components/routes/route-events'
import { MetrikaGoals, YandexMetrika } from '@/components/yandex-metrika'
import { TopMailCounter } from '@/components/mailru-metrika'

import { NavigationProvider } from '@/shared/lib/providers/NavigationProvider'
import { SITE_DESCRIPTION, SITE_TITLE } from '@/shared/const/page'
import { OG_IMAGE, OG_IMAGE_ALT, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/shared/const/seo'
import { getSiteUrl } from '@/shared/lib/helpers/seo'

import './globals.scss'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
    title: {
        template: SITE_TITLE + ' | %s',
        default: SITE_TITLE
    },
    description: SITE_DESCRIPTION,
    keywords: ['изготовление рекламы', 'фотопечать', 'рекламная продукция'],
    metadataBase: new URL(siteUrl),
    alternates: {
        canonical: `${siteUrl}/`
    },
    openGraph: {
        type: 'website',
        siteName: SITE_TITLE,
        locale: 'ru_RU',
        url: `${siteUrl}/`,
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: [
            {
                url: OG_IMAGE,
                width: OG_IMAGE_WIDTH,
                height: OG_IMAGE_HEIGHT,
                alt: OG_IMAGE_ALT
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: [OG_IMAGE]
    },
    applicationName: 'asfp',
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
        'yandex-verification': 'e9fe13df1fb763c7'
    }
}

const brandFont = localFont({
    src: [
        {
            path: './fonts/Onest_Regular.woff2',
            weight: '400',
            style: 'normal'
        },
        {
            path: './fonts/Onest_SemiBold.woff2',
            weight: '600',
            style: 'normal'
        },
        {
            path: './fonts/Onest_Black.woff2',
            weight: '900',
            style: 'normal'
        }
    ],
    display: 'swap',
    preload: true,
    variable: '--font-family-primary'
})

const accentFont = localFont({
    src: [
        {
            path: './fonts/inter_28pt_Regular.woff2',
            weight: '400',
            style: 'normal'
        },
        {
            path: './fonts/inter_28pt_SemiBold.woff2',
            weight: '600',
            style: 'normal'
        },
        {
            path: './fonts/inter_28pt_Black_Italic.woff2',
            weight: '900',
            style: 'italic'
        }
    ],
    display: 'swap',
    // Вторичный шрифт не используется в вёрстке, поэтому его файлы не попадают в preload
    preload: false,
    variable: '--font-family-secondary'
})

const isDev = process.env.NODE_ENV === 'development'

export default async function RootLayout({
    children = null
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="ru"
            className={`${brandFont.className} ${accentFont.variable}`}
            data-scroll-behavior="smooth"
            suppressHydrationWarning
        >
            <head>
                <TopMailCounter enabled={!isDev} />
            </head>
            <body>
                <NavigationProvider>
                    <RouteEvents />
                    {children}
                </NavigationProvider>
                <Suspense fallback={null}>
                    <YandexMetrika enabled={!isDev} />
                </Suspense>
                <MetrikaGoals />
            </body>
        </html>
    )
}
