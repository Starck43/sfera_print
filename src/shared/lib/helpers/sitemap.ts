import {normalizeUrlPath} from "@/shared/lib/helpers/url";

type frequencyType = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | undefined

export function generateSitemapRoutes(
	routes: string[],
	url: string,
	frequency: frequencyType = 'daily',
	priority: number = 0.8
) {
	return routes?.map((route) => ({
		url: normalizeUrlPath(`${url}/${route}`),
		lastModified: new Date().toISOString(),
		changeFrequency: frequency,
		priority: priority
	}))
}

export function generateSitemapPosts<T>(
	data: any[],
	url: string,
	frequency: frequencyType = 'daily',
	priority: number = 0.8
) {
	return data?.map((post) => {
		let path = url.replace('[slug]', post?.slug || '')
		path = path.replace('[id]', post?.id || '')
		if (path == url && post?.id) {
			path = `${url}/${post.id}`
		}
		return {
			url: normalizeUrlPath(path),
			lastModified: new Date().toISOString(),
			changeFrequency: frequency,
			priority: priority
		}
	})
}
