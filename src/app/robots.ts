import type {MetadataRoute} from 'next'

import {normalizeUrlPath} from "@/shared/lib/helpers/url"
import {SITE_URL} from "@/shared/const/page"


export default function robots(): MetadataRoute.Robots {
	const url = process.env.URL || SITE_URL
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: '/api/',
		},
		sitemap: normalizeUrlPath(`${url}/sitemap.xml`),
	}
}