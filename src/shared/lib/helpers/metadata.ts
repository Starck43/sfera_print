import type { Metadata, ResolvedMetadata } from 'next'
import { normalizeUrlPath } from '@/shared/lib/helpers/url'

interface MetadataProps<P> {
    title: string
    excerpt?: string
    keywords?: string | string[]
    event_date?: string
    cover?: any
    path: string
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
        keywords,
        event_date,
        cover,
        path,
        posts: images,
        type = 'website'
    } = props

    const url =
        new URL(normalizeUrlPath(`${process.env.URL}/${path}`)) || parentMetadata.metadataBase

    const publishedTime = event_date
        ? new Date(event_date).toISOString()
        : undefined;

    return {
        title: title || parentMetadata.title,
        description: excerpt || parentMetadata.description,
        keywords: keywords || '',
        metadataBase: url,
        alternates: { canonical: url },
        openGraph: {
            title: title || parentMetadata.title,
            description: excerpt || parentMetadata.description,
            images:
                typeof cover === 'undefined'
                    ? [
                          // it means that there is a list of posts with the own covers
                          ...((images as any[]) || [])
                              .filter((el) => el.cover?.src ?? el.cover)
                              .map(({ cover }) => (typeof cover === 'object' ? cover.src : cover))
                      ]
                    : cover
                      ? [typeof cover === 'object' ? cover.src : cover]
                      : [
                            // it means that there is a list of images
                            ...((images as any[]) || [])
                                .filter((el) => el.image)
                                .map(({ image }) => (typeof image === 'object' ? image.src : image))
                        ],
            url: url,
            publishedTime: publishedTime,
            type: type
        }
    } as Metadata
}
