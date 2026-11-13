import type { MetadataRoute } from 'next'

import type { PostType } from '@/components/post'

import {
    generateSitemapPosts,
    generateSitemapRoutes,
    getLastModified
} from '@/shared/lib/helpers/sitemap'
import { getBlog, getCityCases, getDocuments, getFeatures, getTechnologies } from '@/shared/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [cases, blog, features, technologies, documents] = await Promise.all([
        getCityCases<PostType>(),
        getBlog<PostType>(),
        getFeatures<PostType>(),
        getTechnologies<PostType>(),
        getDocuments<PostType>()
    ])

    // Дата последнего изменения содержимого: она меняется только вместе с контентом
    const lastContentUpdate = [
        ...(cases || []),
        ...(blog || []),
        ...(features || []),
        ...(technologies || []),
        ...(documents || [])
    ]
        .map(getLastModified)
        .filter((date): date is string => Boolean(date))
        .sort()
        .pop()

    return [
        ...generateSitemapRoutes(['cases'], 'weekly', 1, lastContentUpdate),
        ...generateSitemapRoutes(['blog', 'philosophy'], 'weekly', 0.8, lastContentUpdate),
        ...generateSitemapRoutes(
            ['', 'features', 'technologies', 'documents', 'contacts'],
            'monthly',
            0.5,
            lastContentUpdate
        ),
        ...generateSitemapPosts(cases, '/cases/[id]', 'weekly', 1),
        ...generateSitemapPosts(blog, '/blog/[id]', 'weekly', 0.8),
        ...generateSitemapPosts(features, '/features/[slug]', 'monthly', 0.5),
        ...generateSitemapPosts(technologies, '/technologies/[slug]', 'monthly', 0.5),
        ...generateSitemapPosts(documents, '/documents/[slug]', 'monthly', 0.5)
    ]
}
