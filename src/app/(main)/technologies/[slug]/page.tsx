import React from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import type { PostType } from '@/components/post'

import { getTechnologies } from '@/shared/lib/api'
import constructMetadata from '@/shared/lib/helpers/metadata'

import TechnologyDetails from '../details/TechnologyDetails'
import { PageProps } from '../../../types'

export const generateMetadata = async (
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> => {
    const slug = (await params).slug
    const { media, ...data }: PostType = await getTechnologies(slug)

    if (!data) {
        notFound()
    }

    return constructMetadata(
        { ...data, posts: media || [], type: 'article' },
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
    const technologyData: PostType = await getTechnologies(slug)

    if (!technologyData) {
        notFound()
    }

    return (
        <PageLayout gap={'none'} sectionMode={false} className="technology__details-page">
            <TechnologyDetails data={technologyData} />
        </PageLayout>
    )
}

export default TechnologyDetailsPage
