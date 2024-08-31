import type {MetadataRoute} from 'next'

import type {PostType} from "@/components/post"

import {generateSitemapPosts, generateSitemapRoutes} from "@/shared/lib/helpers/sitemap"
import {getBlog, getCityCases, getFeatures, getTechnologies} from "@/shared/lib/api"
import {SITE_URL} from "@/shared/const/page"


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const routesUrl = process.env.URL || SITE_URL
	return [
		...generateSitemapRoutes(['cases'], routesUrl, 'weekly', 1),
		...generateSitemapRoutes(['blog', 'philosophy'], routesUrl, 'weekly', 0.8),
		...generateSitemapRoutes(['features', 'technologies', 'contacts'], routesUrl, 'monthly', 0.5),
		...generateSitemapPosts(await getCityCases<PostType>(), routesUrl + '/cases/[id]', 'weekly', 1),
		...generateSitemapPosts(await getBlog<PostType>(), routesUrl + '/blog/[id]', 'weekly', 0.8),
		...generateSitemapPosts(await getFeatures<PostType>(), routesUrl + '/features/[slug]', 'monthly', 0.5),
		...generateSitemapPosts(await getTechnologies<PostType>(), routesUrl + '/technologies/[slug]', 'monthly', 0.5),
	]
}

