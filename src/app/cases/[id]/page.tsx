import React from "react"
import {Metadata, ResolvingMetadata} from "next"

import PageLayout from "@/components/layout/page-layout"
import type {CityCases} from "@/components/map/types"
import {Portfolio} from "@/components/portfolio"

import {getCases} from "@/shared/lib/api"
import constructMetadata from "@/shared/lib/helpers/metadata"

import type {PageProps} from "../../types"



export const generateMetadata = async ({params: {id}}: PageProps, parent: ResolvingMetadata): Promise<Metadata> => {
	const {portfolio, ...data} = await getCases<CityCases>(id)
	return constructMetadata({
			...data,
			title: data?.title || 'Реализованные кейсы в городе ' + data.name,
			excerpt: data?.excerpt || 'Примеры реализованных проектов изготовления рекламы в городе ' + data.name,
			keywords: data?.keywords || [
				'портфолио рекламных проектов в ' + data.name,
				'рекламные кейсы в ' + data.name,
				'примеры готовых вывесок в ' + data.name
			],
			posts: portfolio || [],
		},
		await parent
	)
}

export async function generateStaticParams() {
	const data= await getCases<CityCases>()

	return data.map(post => ({
		params: {
			id: post.id
		},
	}))
}

const CityCasesPage = async ({params: {id}}: PageProps) => {
	const {name, portfolio} = await getCases<CityCases>(id)
	return (
		<PageLayout
			title={'Кейсы' + ' – ' + name}
			titleTag='h2'
			gap='sm'
			sectionMode={false}
			className='portfolio__detail'
		>
			<Portfolio items={portfolio || []}/>
		</PageLayout>
	)
}

export default CityCasesPage
