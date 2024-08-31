'use client'

import React, {memo, useMemo, useState} from "react"
import Image from "next/image"

import PageLayout from "@/components/layout/page-layout"
import type {PostType} from "@/components/post"

import {useFetch} from "@/shared/lib/hooks/useFetch"
import {Header} from "@/shared/ui/header"
import {Section} from "@/shared/ui/section"

import TechnologyDetails from "../details/TechnologyDetails"

import cls from "./TechnologyList.module.sass"


const TechnologyList = ({items}: { items: PostType[] }) => {
	const [activeTechnology, setActiveTechnology] = useState<number | null>(null)
	const {data: post, isError} = useFetch<PostType>(activeTechnology !== null ? items[activeTechnology].path : null, {}, true, [activeTechnology])

	const technologiesContent = useMemo(() => (
		<div className={cls.technologies__container}>
			{items?.map(({slug, title, excerpt, cover}, idx) => (
				<Section
					key={slug}
					as='article'
					gap='xs'
					onClick={() => setActiveTechnology(idx)}
					style={{padding: 0}}
				>
					<div className={cls.cover__wrapper}>
						{cover &&
                            <Image
                                src={cover as string}
                                alt={title}
                                fill
                                priority
                                sizes="(max-width: 684px) 50vw, 100vw"
                                style={{
									objectFit: 'cover',
									transition: 'opacity 0.3s ease-in-out',
									opacity: 0,
								}}
                                onLoad={(e) => {
									e.currentTarget.style.opacity = '1'
								}}
                            />
						}
					</div>
					<Header tag='h3' title={title} transform='upperCase'/>
					<p className={cls.excerpt}>{excerpt}</p>
				</Section>
			))}
		</div>
	), [items])

	return (
		<>
			{technologiesContent}
			{activeTechnology !== null &&
                <PageLayout
                    gap={'none'}
                    sectionMode={false}
                    handleOnClose={() => setActiveTechnology(null)}
                    className='technology-detail'
                >
					{isError
						? <Header title='Ошибка загрузки статьи!' style={{flex: '0 1 50%'}}/>
						: <TechnologyDetails data={post}/>
					}
                </PageLayout>
			}
		</>
	)
}

export default memo(TechnologyList)
