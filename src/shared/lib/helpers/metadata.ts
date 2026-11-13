import type { Metadata, ResolvedMetadata } from 'next'

import { SITE_DESCRIPTION, SITE_TITLE } from '@/shared/const/page'
import { buildUrl, getDefaultOgImage, getSiteUrl, resolveImageSrc } from '@/shared/lib/helpers/seo'

interface MetadataProps<P> {
    title: string
    excerpt?: string
    description?: string
    keywords?: string | string[]
    event_date?: string
    cover?: any
    path?: string
    posts?: P[] | null
    type?: 'article' | 'website'
}

export default function constructMetadata<T extends MetadataProps<P>, P>(
    props: Partial<T>,
    parentMetadata: ResolvedMetadata
): Metadata {
    const {
        title,
        excerpt,
        description,
        keywords,
        event_date,
        cover,
        path,
        posts: images,
        type = 'website'
    } = props

    const parentTitle = typeof parentMetadata.title === 'string' ? parentMetadata.title : SITE_TITLE
    const parentDescription =
        typeof parentMetadata.description === 'string'
            ? parentMetadata.description
            : SITE_DESCRIPTION

    const metaTitle = title || parentTitle
    const metaDescription = description || excerpt || parentDescription

    // Канонический адрес строится только из маршрута: данные из API не содержат
    // надёжного пути, из-за чего в og:url попадало "/undefined/".
    const url = buildUrl(path)

    const publishedTime = event_date ? new Date(event_date).toISOString() : undefined

    const ogImages = (() => {
        const fromCover = resolveImageSrc(cover)
        if (fromCover) return [fromCover]

        const fromPosts = ((images as any[]) || [])
            .map((el) => resolveImageSrc(el?.cover) || resolveImageSrc(el?.image))
            .filter((src): src is string => Boolean(src))

        return fromPosts.length ? [fromPosts[0]] : [getDefaultOgImage()]
    })()

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: keywords || undefined,
        metadataBase: new URL(getSiteUrl()),
        alternates: { canonical: url },
        openGraph: {
            type,
            siteName: SITE_TITLE,
            locale: 'ru_RU',
            url,
            title: metaTitle,
            description: metaDescription,
            images: ogImages,
            publishedTime: publishedTime
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: ogImages
        }
    } as Metadata
}
