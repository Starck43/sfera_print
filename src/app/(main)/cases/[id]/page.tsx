import React from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import type { CityCases } from '@/components/map'
import { Portfolio } from '@/components/portfolio'

import { getCityCases } from '@/shared/lib/api'
import constructMetadata from '@/shared/lib/helpers/metadata'

import type { PageProps } from '../../../types'

export const generateMetadata = async (
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> => {
    const id = (await params).id

    const { portfolio, ...data } = await getCityCases<CityCases>(id)

    if (!data) {
        notFound()
    }

    return constructMetadata(
        {
            ...data,
            title: data?.title || 'Реализованные кейсы в городе ' + data.name,
            excerpt:
                data?.excerpt ||
                'Примеры реализованных проектов изготовления рекламы в городе ' + data.name,
            keywords: data?.keywords || [
                'портфолио рекламных проектов в ' + data.name,
                'рекламные кейсы в ' + data.name,
                'примеры готовых вывесок в ' + data.name
            ],
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
    const { name, portfolio } = await getCityCases<CityCases>(id)

    if (!portfolio) {
        notFound()
    }

    return (
        <PageLayout
            title={'Кейсы' + ' – ' + name}
            titleTag="h1"
            gap="none"
            sectionMode={false}
            className="portfolio__detail"
        >
            <Portfolio items={portfolio || []} />
        </PageLayout>
    )
}

export default CityCasesPage
