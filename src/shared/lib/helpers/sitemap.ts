import { buildUrl } from '@/shared/lib/helpers/seo'

type frequencyType =
    'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | undefined

/**
 * Дата изменения материала. Берется из данных записи, чтобы дата в sitemap
 * отражала реальные изменения страницы, а не время генерации файла.
 */
export const getLastModified = (post: any): string | undefined => {
    const raw = post?.event_date || post?.updated_at || post?.published_at

    if (!raw) return undefined

    const date = new Date(raw)

    return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export function generateSitemapRoutes(
    routes: string[],
    frequency: frequencyType = 'daily',
    priority: number = 0.8,
    lastModified?: string
) {
    return routes?.map((route) => ({
        url: buildUrl(route),
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: frequency,
        priority: priority
    }))
}

export function generateSitemapPosts(
    data: any[],
    route: string,
    frequency: frequencyType = 'daily',
    priority: number = 0.8
) {
    return (data || [])
        .map((post) => {
            const path = route
                .replace('[slug]', String(post?.slug ?? ''))
                .replace('[id]', String(post?.id ?? ''))

            if (!post?.slug && !post?.id) return null

            const lastModified = getLastModified(post)

            return {
                url: buildUrl(path),
                ...(lastModified ? { lastModified } : {}),
                changeFrequency: frequency,
                priority: priority
            }
        })
        .filter(Boolean) as {
        url: string
        lastModified?: string
        changeFrequency: frequencyType
        priority: number
    }[]
}
