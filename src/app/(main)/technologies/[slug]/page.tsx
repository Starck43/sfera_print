import React, { cache } from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import { JsonLd } from '@/components/json-ld'
import type { PostType } from '@/components/post'

import { getTechnologies } from '@/shared/lib/api'
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

import TechnologyDetails from '../details/TechnologyDetails'
import { PageProps } from '../../../types'

// export const revalidate = 86400

const getTechnology = cache(async (slug: string) => getTechnologies<PostType>(slug))

export const generateMetadata = async (
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> => {
    const slug = (await params).slug
    const { media, ...data }: PostType = await getTechnology(slug)

    if (!data?.title) {
        notFound()
    }

    return constructMetadata(
        {
            ...data,
            description: buildDescription([data.excerpt, stripHtml(data.desc)]),
            path: `/technologies/${slug}`,
            posts: media || [],
            type: 'article'
        },
        await parent
    ) as Metadata
}

export async function generateStaticParams() {
    const posts: PostType[] = await getTechnologies()

    return posts?.map((post) => ({
        slug: post.slug
    }))
}

const TechnologyDetailsPage = async ({ params }: PageProps) => {
    const slug = (await params).slug
    const technologyData: PostType = await getTechnology(slug)

    if (!technologyData?.title) {
        notFound()
    }

    const url = buildUrl(`/technologies/${slug}`)
    const description = buildDescription([technologyData.excerpt, stripHtml(technologyData.desc)])

    return (
        <>
            <JsonLd
                data={jsonLdGraph([
                    serviceJsonLd({
                        url,
                        name: technologyData.title,
                        description,
                        image: resolveImageSrc(technologyData.cover)
                    }),
                    breadcrumbJsonLd([
                        { name: 'Главная', path: '/' },
                        { name: 'Технологии', path: '/technologies' },
                        { name: technologyData.title, path: `/technologies/${slug}` }
                    ])
                ])}
            />

            <PageLayout gap={'none'} sectionMode={false} className="technology__details-page">
                <TechnologyDetails data={technologyData} titleTag="h1" />
            </PageLayout>
        </>
    )
}

export default TechnologyDetailsPage
