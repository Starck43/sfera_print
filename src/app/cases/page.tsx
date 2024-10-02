import { Metadata, ResolvingMetadata } from 'next'

import PageLayout from '@/components/layout/page-layout'
import { parseHtml } from '@/components/parse-html'
import { Map } from '@/components/map'
import type { City } from '@/components/map'

import constructMetadata from '@/shared/lib/helpers/metadata'
import { getPage } from '@/shared/lib/api'
import { Section } from '@/shared/ui/section'

import type { Page } from '../types'

import cls from './CasesPage.module.sass'

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    const data = await getPage<Page<City>>('cases')
    return constructMetadata(data, await parent)
}

const CasesPage = async () => {
    const { title, content = null, posts } = await getPage<Page<City>>('cases')
    const parsedContent = await parseHtml(content)

    return (
        <PageLayout title={title} gap="none" sectionMode className="cases-map">
            {parsedContent && <Section className="page-content">{parsedContent}</Section>}

            <Section gap={'none'} className={cls.section}>
                <Map pageTitle={title} cities={posts || []} />
            </Section>
        </PageLayout>
    )
}

export default CasesPage
