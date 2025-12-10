import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import { htmlParser } from '@/components/html-parser'
import { Map } from '@/components/map'
import type { City } from '@/components/map'

import getPage from '@/shared/lib/api/getPage'
import constructMetadata from '@/shared/lib/helpers/metadata'
import { Section } from '@/shared/ui/section'

import type { Page } from '../../types'

import cls from './CasesPage.module.sass'

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    const data = await getPage<Page<City>>('cases')

    if (!data) {
        notFound()
    }

    return constructMetadata(data, await parent)
}

const CasesPage = async () => {
    const { title, content = null, posts } = await getPage<Page<City>>('cases')

    if (!content && !posts) {
        notFound()
    }

    const parsedContent = htmlParser(content)

    return (
        <PageLayout title={title} gap="none" sectionMode className="cases-map">
            {parsedContent && <Section className="html-container">{parsedContent}</Section>}

            <Section gap={'none'} className={cls.section}>
                <Map pageTitle={title} cities={posts || []} />
            </Section>
        </PageLayout>
    )
}

export default CasesPage
