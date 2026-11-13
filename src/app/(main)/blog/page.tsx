import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import { JsonLd } from '@/components/json-ld'
import { htmlParser } from '@/components/html-parser'
import type { PostType } from '@/components/post'

import getPage from '@/shared/lib/api/getPage'
import constructMetadata from '@/shared/lib/helpers/metadata'
import { breadcrumbJsonLd, jsonLdGraph } from '@/shared/lib/helpers/seo'
import { PAGE_DESCRIPTIONS } from '@/shared/const/seo'
import { Section } from '@/shared/ui/section'

import type { Page } from '../../types'
import BlogList from './list/BlogList'

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    const data = await getPage<Page<PostType>>('blog')

    if (!data) {
        notFound()
    }

    return constructMetadata(
        {
            ...data,
            description: PAGE_DESCRIPTIONS.blog,
            path: '/blog',
            type: 'website'
        },
        await parent
    )
}

const BlogPage = async () => {
    const { title, content = null, posts } = await getPage<Page<PostType>>('blog')

    if (!content && !posts) {
        notFound()
    }

    const parsedContent = htmlParser(content)

    return (
        <>
            <JsonLd
                data={jsonLdGraph([
                    breadcrumbJsonLd([
                        { name: 'Главная', path: '/' },
                        { name: 'Блог', path: '/blog' }
                    ])
                ])}
            />

            <PageLayout title={title} gap={'none'} sectionMode>
                {parsedContent && <Section className="html-container">{parsedContent}</Section>}
                <h2 className="visually-hidden">Статьи о производстве рекламы</h2>
                <BlogList posts={posts || []} />
            </PageLayout>
        </>
    )
}

export default BlogPage
