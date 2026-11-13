import React, { cache } from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import { JsonLd } from '@/components/json-ld'
import type { PostType } from '@/components/post'

import { getDocuments } from '@/shared/lib/api'
import constructMetadata from '@/shared/lib/helpers/metadata'
import {
    breadcrumbJsonLd,
    buildDescription,
    buildUrl,
    jsonLdGraph,
    serviceJsonLd,
    stripHtml
} from '@/shared/lib/helpers/seo'

import DocumentDetails from '../details/DocumentDetails'
import { PageProps } from '../../../types'

// export const revalidate = 86400

const getDocument = cache(async (slug: string) => getDocuments<PostType>(slug))

export const generateMetadata = async (
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> => {
    const slug = (await params).slug

    const { media, ...data } = await getDocument(slug)

    if (!data?.title) {
        notFound()
    }

    return constructMetadata(
        {
            ...data,
            description: buildDescription([data.excerpt, stripHtml(data.desc)]),
            path: `/documents/${slug}`,
            posts: media || [],
            type: 'article'
        },
        await parent
    ) as Metadata
}

export async function generateStaticParams() {
    const posts = await getDocuments<PostType>()

    return posts?.map((post) => ({
        slug: post.slug
    }))
}

const DocumentDetailsPage = async ({ params }: PageProps) => {
    const slug = (await params).slug

    const documentData = await getDocument(slug)

    if (!documentData?.title) {
        notFound()
    }

    const url = buildUrl(`/documents/${slug}`)
    const description = buildDescription([documentData.excerpt, stripHtml(documentData.desc)])

    return (
        <>
            <JsonLd
                data={jsonLdGraph([
                    serviceJsonLd({
                        url,
                        name: documentData.title,
                        description
                    }),
                    breadcrumbJsonLd([
                        { name: 'Главная', path: '/' },
                        { name: 'Документация', path: '/documents' },
                        { name: documentData.title, path: `/documents/${slug}` }
                    ])
                ])}
            />

            <PageLayout gap={'none'} sectionMode={false} className="document__details-page">
                <DocumentDetails data={documentData} titleTag="h1" />
            </PageLayout>
        </>
    )
}

export default DocumentDetailsPage
