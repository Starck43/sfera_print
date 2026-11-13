import React, { cache } from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import { JsonLd } from '@/components/json-ld'
import type { PostType } from '@/components/post'

import { getBlog } from '@/shared/lib/api'
import constructMetadata from '@/shared/lib/helpers/metadata'
import {
    blogPostingJsonLd,
    breadcrumbJsonLd,
    buildDescription,
    buildUrl,
    jsonLdGraph,
    resolveImageSrc,
    stripHtml,
    truncate
} from '@/shared/lib/helpers/seo'

import BlogDetails from '../details/BlogDetails'
import type { PageProps } from '../../../types'

//export const revalidate = 86400

// Один и тот же запрос используется и в metadata, и в самой странице
const getBlogPost = cache(async (id: string) => getBlog<PostType>(id))

const getPostDescription = (post: PostType): string =>
    buildDescription([post.excerpt, post.desc ? stripHtml(post.desc) : ''])

export const generateMetadata = async (
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> => {
    const id = (await params).id
    const { media, ...data } = await getBlogPost(id)

    if (!data?.title) {
        return {
            title: 'Статья не найдена',
            robots: { index: false, follow: false }
        }
    }

    return constructMetadata(
        {
            ...data,
            title: truncate(data.title, 70),
            description: getPostDescription(data),
            // Канонический адрес собирается из идентификатора маршрута,
            // а не из поля path в данных: в данных оно может отсутствовать
            path: `/blog/${id}`,
            posts: media || [],
            type: 'article'
        },
        await parent
    )
}

export async function generateStaticParams() {
    const posts = await getBlog<PostType>()

    return posts?.map((post) => ({
        id: post.id.toString()
    }))
}

const BlogDetailsPage = async ({ params }: PageProps) => {
    const id = (await params).id
    const post = await getBlogPost(id)

    if (!post?.title) {
        notFound()
    }

    const url = buildUrl(`/blog/${id}`)
    const description = getPostDescription(post)
    const image = resolveImageSrc(post.cover)

    return (
        <>
            <JsonLd
                data={jsonLdGraph([
                    blogPostingJsonLd({
                        url,
                        title: post.title,
                        description,
                        image,
                        publishedTime: post.event_date
                            ? new Date(post.event_date).toISOString()
                            : undefined
                    }),
                    breadcrumbJsonLd([
                        { name: 'Главная', path: '/' },
                        { name: 'Блог', path: '/blog' },
                        { name: post.title, path: `/blog/${id}` }
                    ])
                ])}
            />

            <PageLayout gap={'none'} sectionMode={false} className="blog__detail">
                <BlogDetails data={post} titleTag="h1" />
            </PageLayout>
        </>
    )
}

export default BlogDetailsPage
