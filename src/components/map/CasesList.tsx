import React, {useMemo, useState} from "react"
import Image from "next/image"

import PageLayout from "@/components/layout/page-layout"
import type {PostType} from "@/components/post"
import {Portfolio} from "@/components/portfolio"

import {Section} from "@/shared/ui/section"
import {Header} from "@/shared/ui/header"

import cls from './CasesList.module.sass'

const CasesList = ({cases}: { cases: PostType[] }) => {
	const [activeCase, setActiveCase] = useState<number | null>(null)

	const casesContent = useMemo(() => (
		<div className={cls.cases__container}>
			{cases?.map(({id, title, excerpt, cover = null, event_date = null, desc}, idx) => (
				<Section
					key={'case-' + id}
					as='article'
					gap='xs'
					className={cls.article}
					onClick={() => setActiveCase(idx)}
				>
					<div className={cls.cover__wrapper}>
						{cover &&
                            <Image
                                src={typeof cover === 'object' && 'src' in cover ? cover.src : cover}
								//srcSet={createSrcSet(cover?.srcset) || undefined}
                                alt={title}
                                sizes="max-width: 684px) 100vw, 50vw"
                                fill
                                priority
                                quality={80}
                                style={{objectFit: 'cover'}}
                            />
						}
					</div>
					<Header tag='h3' title={title} transform='upperFirst'/>
				</Section>
			))}
		</div>
	), [cases])

	return (
		<>
			{casesContent}
			{activeCase !== null &&
                <PageLayout
                    gap={'none'}
                    sectionMode={false}
                    handleOnClose={() => setActiveCase(null)}
                    className='case-detail'
                >
                    <Portfolio items={[cases[activeCase]]}/>

                </PageLayout>
			}
		</>
	)
}

export default CasesList
