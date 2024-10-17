import { Metadata, ResolvingMetadata } from 'next'

import PageLayout from '@/components/layout/page-layout'
import { htmlParser } from '@/components/html-parser'
import type { PostType } from '@/components/post'

import constructMetadata from '@/shared/lib/helpers/metadata'
import { getPage } from '@/shared/lib/api'
import { Section } from '@/shared/ui/section'

import type { Page } from '../types'
import TechnologyList from './list/TechnologyList'

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    const data = await getPage<Page<PostType>>('technologies')
    return constructMetadata(data, await parent)
}

const TechnologiesPage = async () => {
    const {
        title,
        content = null,
        posts: technologiesData
    } = await getPage<Page<PostType>>('technologies')
    const parsedContent = htmlParser(content)

    return (
        <PageLayout title={title} gap={'none'} sectionMode className="technologies-page">
            {parsedContent && <Section className="html-container">{parsedContent}</Section>}
            <TechnologyList items={technologiesData || []} />
        </PageLayout>
    )
}

export default TechnologiesPage
