import React, { cache } from 'react'
import { Metadata, ResolvingMetadata } from 'next'

import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import { JsonLd } from '@/components/json-ld'
import { Post, type PostType } from '@/components/post'

import { getFeatures } from '@/shared/lib/api'
import constructMetadata from '@/shared/lib/helpers/metadata'
import {
    breadcrumbJsonLd,
    buildDescription,
    buildUrl,
    jsonLdGraph,
    resolveImageSrc,
    serviceJsonLd,
    stripHtml
} from '@/shared/lib/helpers/seo'

import type { PageProps } from '../../../types'

// export const revalidate = 86400

const getFeature = cache(async (slug: string) => getFeatures<PostType>(slug))

export const generateMetadata = async (
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> => {
    const slug = (await params).slug
    const { media, ...data } = await getFeature(slug)

    if (!data?.title) {
        notFound()
    }

    return constructMetadata(
        {
            ...data,
            description: buildDescription([data.excerpt, stripHtml(data.desc)]),
            path: `/features/${slug}`,
            posts: media || [],
            type: 'article'
        },
        await parent
    )
}

export async function generateStaticParams() {
    const posts = await getFeatures<PostType>()

    return posts?.map((post) => ({
        slug: post.slug
    }))
}

const FeaturePage = async ({ params }: PageProps) => {
    const slug = (await params).slug
    const featureData = await getFeature(slug)

    if (!featureData?.title) {
        notFound()
    }

    const url = buildUrl(`/features/${slug}`)
    const description = buildDescription([featureData.excerpt, stripHtml(featureData.desc)])

    return (
        <>
            <JsonLd
                data={jsonLdGraph([
                    serviceJsonLd({
                        url,
                        name: featureData.title,
                        description,
                        image: resolveImageSrc(featureData.cover)
                    }),
                    breadcrumbJsonLd([
                        { name: 'Главная', path: '/' },
                        { name: 'Направления', path: '/features' },
                        { name: featureData.title, path: `/features/${slug}` }
                    ])
                ])}
            />

            <PageLayout gap={'none'} className="feature__detail">
                <Post data={featureData} style={{ paddingTop: 0 }} titleTag="h1" />
            </PageLayout>
        </>
    )
}

export default FeaturePage
