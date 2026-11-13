import React, { cache } from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import { JsonLd } from '@/components/json-ld'
import type { CityCases } from '@/components/map'
import { Portfolio } from '@/components/portfolio'

import { getCityCases } from '@/shared/lib/api'
import constructMetadata from '@/shared/lib/helpers/metadata'
import {
    articleJsonLd,
    breadcrumbJsonLd,
    buildDescription,
    buildUrl,
    jsonLdGraph,
    resolveImageSrc,
    truncate
} from '@/shared/lib/helpers/seo'

import type { PageProps } from '../../../types'

// export const revalidate = 86400

const getCityCase = cache(async (id: string) => getCityCases<CityCases>(id))

export const generateMetadata = async (
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> => {
    const id = (await params).id

    const { portfolio, ...data } = await getCityCase(id)

    if (!data && !portfolio) {
        notFound()
    }

    const caseTitle = data?.title || `Кейсы – ${data?.name}`

    return constructMetadata(
        {
            ...data,
            title: truncate(`${caseTitle} — ${data?.name}`, 70),
            description: buildDescription([
                data?.excerpt,
                portfolio?.[0]?.excerpt,
                `Примеры реализованных проектов изготовления рекламы в городе ${data?.name}`
            ]),
            keywords: data?.keywords || [
                'портфолио рекламных проектов в ' + data?.name,
                'рекламные кейсы в ' + data?.name,
                'примеры готовых вывесок в ' + data?.name
            ],
            path: `/cases/${id}`,
            posts: portfolio || []
        },
        await parent
    )
}

export async function generateStaticParams() {
    const data = await getCityCases<CityCases>()

    return data?.map((post) => ({
        id: post.id
    }))
}

const CityCasesPage = async ({ params }: PageProps) => {
    const id = (await params).id
    const { name, title, excerpt, portfolio } = await getCityCase(id)

    if (!portfolio) {
        notFound()
    }

    const url = buildUrl(`/cases/${id}`)
    const caseTitle = title || `Кейсы – ${name}`

    return (
        <>
            <JsonLd
                data={jsonLdGraph([
                    articleJsonLd({
                        url,
                        title: caseTitle,
                        description: buildDescription([
                            excerpt,
                            portfolio?.[0]?.excerpt,
                            `Реализованные проекты изготовления рекламы в городе ${name}`
                        ]),
                        image: resolveImageSrc(portfolio?.[0]?.cover)
                    }),
                    breadcrumbJsonLd([
                        { name: 'Главная', path: '/' },
                        { name: 'Кейсы', path: '/cases' },
                        { name: caseTitle, path: `/cases/${id}` }
                    ])
                ])}
            />

            <PageLayout
                title={caseTitle}
                titleTag="h1"
                gap="none"
                sectionMode={false}
                className="portfolio__detail"
            >
                <Portfolio items={portfolio || []} />
            </PageLayout>
        </>
    )
}

export default CityCasesPage
