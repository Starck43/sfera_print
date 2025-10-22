import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import { htmlParser } from '@/components/html-parser'
import type { PostType } from '@/components/post'

import constructMetadata from '@/shared/lib/helpers/metadata'
import { getPage } from '@/shared/lib/api'
import { Section } from '@/shared/ui/section'

import type { Page } from '../../types'
import DocumentList from './list/DocumentList'

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    const data = await getPage<Page<PostType>>('documents')

    if (!data) {
        notFound()
    }

    return constructMetadata(data, await parent)
}

const DocumentsPage = async () => {
    const {
        title,
        content = null,
        posts: documentsData
    } = await getPage<Page<PostType>>('documents')

    if (!content && !documentsData) {
        notFound()
    }

    const parsedContent = htmlParser(content)

    return (
        <PageLayout title={title} gap={'none'} sectionMode className="documents-page">
            {parsedContent && (
                <Section className="html-container" style={{ paddingBottom: 0 }}>
                    {parsedContent}
                </Section>
            )}
            <DocumentList items={documentsData || []} />
        </PageLayout>
    )
}

export default DocumentsPage
