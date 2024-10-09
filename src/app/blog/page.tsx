import { Metadata, ResolvingMetadata } from 'next'

import PageLayout from '@/components/layout/page-layout'
import { parseHtml } from '@/components/parse-html'
import type { PostType } from '@/components/post'

import constructMetadata from '@/shared/lib/helpers/metadata'
import { getPage } from '@/shared/lib/api'
import { Section } from '@/shared/ui/section'

import type { Page } from '../types'
import BlogList from './list/BlogList'

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    const data = await getPage<Page<PostType>>('blog')
    return constructMetadata(data, await parent)
}

const BlogPage = async () => {
    const { title, content = null, posts } = await getPage<Page<PostType>>('blog')
    const parsedContent = parseHtml(content)

    return (
        <PageLayout title={title} gap={'none'} sectionMode>
            {parsedContent && <Section className="page-content">{parsedContent}</Section>}
            <BlogList posts={posts || []} />
        </PageLayout>
    )
}

export default BlogPage
