import React from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import type { PostType } from '@/components/post'

import { getDocuments } from '@/shared/lib/api'
import constructMetadata from '@/shared/lib/helpers/metadata'

import type { PageProps } from '../../../types'
import DocumentDetails from '../details/DocumentDetails'

// export const revalidate = 86400

export const generateMetadata = async (
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> => {
    const slug = (await params).slug

    const { media, ...data } = await getDocuments<PostType>(slug)

    if (!data) {
        notFound()
    }

    return constructMetadata(
        { ...data, posts: media || [], type: 'article' },
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

    const documentData = await getDocuments<PostType>(slug)

    if (!documentData) {
        notFound()
    }

    return (
        <PageLayout gap={'none'} sectionMode={false} className="document__details-page">
            <DocumentDetails />
        </PageLayout>
    )
}

export default DocumentDetailsPage
