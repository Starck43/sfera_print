import React from 'react'
import { Metadata, ResolvingMetadata } from 'next'

import PageLayout from '@/components/layout/page-layout'
import type { PostType } from '@/components/post'

import { getDocuments } from '@/shared/lib/api'
import constructMetadata from '@/shared/lib/helpers/metadata'

import type { PageProps } from '../../types'
import DocumentDetails from '../details/DocumentDetails'

export const generateMetadata = async (
    { params: { slug } }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> => {
    const { media, ...data } = await getDocuments<PostType>(slug)
    return constructMetadata(
        { ...data, posts: media || [], type: 'article' },
        await parent
    ) as Metadata
}

export async function generateStaticParams() {
    const posts = await getDocuments<PostType>()

    return posts?.map((post) => ({
        slug: post.slug,
    }))
}

const DocumentDetailsPage = async ({ params: { slug } }: PageProps) => {
    const documentData = await getDocuments<PostType>(slug)
    return (
        <PageLayout gap={'none'} sectionMode={false} className="document__details-page">
            <DocumentDetails data={documentData} />
        </PageLayout>
    )
}

export default DocumentDetailsPage
