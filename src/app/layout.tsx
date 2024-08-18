import React from "react"
import type {Metadata} from "next"
import localFont from 'next/font/local'
import Image from "next/image"

import {RouteEvents} from "@/components/routes/route-events"
import PageHeader from "@/components/page-header"
import {BurgerButton, Navbar} from "@/components/navbar"
import type {PostType} from "@/components/post"

import {NavigationProvider} from "@/shared/lib/providers/NavigationProvider"
import {getMenu, getFeatures} from "@/shared/lib/api"
import {SITE_DESCRIPTION, SITE_TITLE, SITE_URL} from "@/shared/const/page"

import "./globals.css"


export const metadata: Metadata = {
	title: {
		template: SITE_TITLE + ' | %s',
		default: SITE_TITLE,
	},
	description: SITE_DESCRIPTION,
	keywords: ['изготовление рекламы', 'фотопечать', 'рекламная продукция'],
	metadataBase: new URL(process.env.URL || SITE_URL),
	alternates: {
		canonical: new URL(process.env.URL || SITE_URL),
	},
	openGraph: {
		type: 'website',
		siteName: SITE_TITLE,
		url: new URL(process.env.URL || SITE_URL),
		title: 'Логотип Сфера Принт',
		images: '/sp-logo.svg',
	},
	applicationName: 'sferaprint',
	authors: [{name: 'S. Shabalin', url: 'https://istarck.ru'}],
	creator: 'Stanislav Shabalin',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	referrer: 'origin-when-cross-origin',
	robots: {
		index: false,
		follow: true,
		nocache: true,
		googleBot: {
			index: true,
			follow: false,
			noimageindex: true,
			'max-video-preview': 1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
};

const brandFont = localFont({
	src: './fonts/PFBeauSansPro-Light.woff2',
	weight: '300',
	style: 'normal',
	display: 'swap',
})


export default async function RootLayout({children = null}: Readonly<{ children: React.ReactNode }>) {
	const featuresData = await getFeatures<any>()
	const menuData = await getMenu()

	return (
		<html lang="ru" className={brandFont.className} suppressHydrationWarning>
		<body>
		<header>
			<div className='logo'>
				<Image src='/sp-logo.svg' alt='Логотип Сфера Принт' width={150} height={75} sizes={'100%'} priority/>
			</div>
			<NavigationProvider>
				<RouteEvents/>
				<PageHeader data={featuresData}/>
				<BurgerButton/>
				<Navbar data={menuData} className='navbar'/>
			</NavigationProvider>
		</header>
		{children}
		</body>
		</html>
	)
}
