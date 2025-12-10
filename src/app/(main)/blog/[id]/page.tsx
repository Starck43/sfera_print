import React from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import type { PostType } from '@/components/post'

import { getBlog } from '@/shared/lib/api'
import constructMetadata from '@/shared/lib/helpers/metadata'

import BlogDetails from '../details/BlogDetails'
import type { PageProps } from '../../../types'

//export const revalidate = 86400

export const generateMetadata = async (
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> => {
    const id = (await params).id
    const { media, ...data } = await getBlog<PostType>(id)

    if (!data) {
        notFound()
    }

    return constructMetadata({ ...data, posts: media || [], type: 'article' }, await parent)
}

export async function generateStaticParams() {
    const posts = await getBlog<PostType>()

    return posts?.map((post) => ({
        id: post.id.toString()
    }))
}

const BlogDetailsPage = async ({ params }: PageProps) => {
    const id = (await params).id
    const post = await getBlog<PostType>(id)

    if (!post) {
        notFound()
    }

    return (
        <PageLayout gap={'none'} sectionMode={false} className="blog__detail">
            <BlogDetails data={post} />
        </PageLayout>
    )
}

export default BlogDetailsPage
