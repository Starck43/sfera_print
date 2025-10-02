import { Metadata, ResolvingMetadata } from 'next'

import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import { Post, type PostType } from '@/components/post'

import { getFeatures } from '@/shared/lib/api'
import constructMetadata from '@/shared/lib/helpers/metadata'

import type { PageProps } from '../../../types'

export const generateMetadata = async (
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> => {
    const slug = (await params).slug
    const { media, ...data } = await getFeatures<PostType>(slug)

    if (!data) {
        notFound()
    }

    return constructMetadata({ ...data, posts: media || [], type: 'article' }, await parent)
}

export async function generateStaticParams() {
    const posts = await getFeatures<PostType>()

    return posts?.map((post) => ({
        slug: post.slug
    }))
}

const FeaturePage = async ({ params }: PageProps) => {
    const slug = (await params).slug
    const featureData = await getFeatures<PostType>(slug)

    if (!featureData) {
        notFound()
    }

    return (
        <PageLayout gap={'none'} className="feature__detail">
            <Post data={featureData} style={{ paddingTop: 0 }} />
        </PageLayout>
    )
}

export default FeaturePage
