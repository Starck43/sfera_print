import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import { JsonLd } from '@/components/json-ld'
import type { PostType } from '@/components/post'

import { getFeatures } from '@/shared/lib/api'
import constructMetadata from '@/shared/lib/helpers/metadata'
import { breadcrumbJsonLd, jsonLdGraph } from '@/shared/lib/helpers/seo'
import { PAGE_DESCRIPTIONS, PAGE_TITLES } from '@/shared/const/seo'

import FeatureList from './list/FeatureList'

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    return constructMetadata(
        {
            title: PAGE_TITLES.features,
            description: PAGE_DESCRIPTIONS.features,
            path: '/features',
            type: 'website'
        },
        await parent
    )
}

const FeaturesPage = async () => {
    const features = await getFeatures<PostType>()

    if (!features?.length) {
        notFound()
    }

    return (
        <>
            <JsonLd
                data={jsonLdGraph([
                    breadcrumbJsonLd([
                        { name: 'Главная', path: '/' },
                        { name: PAGE_TITLES.features, path: '/features' }
                    ])
                ])}
            />

            <PageLayout
                title={PAGE_TITLES.features}
                titleTag="h1"
                gap={'none'}
                sectionMode
                className="features-page"
            >
                <FeatureList items={features} />
            </PageLayout>
        </>
    )
}

export default FeaturesPage
