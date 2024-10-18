import React, { useEffect, useMemo, useState, memo } from 'react'
import { useInView } from 'react-intersection-observer'

import PageLayout from '@/components/layout/page-layout'
import { Portfolio } from '@/components/portfolio'
import type { Cases } from '@/components/map'
import type { PostType } from '@/components/post'

import { useFetch } from '@/shared/lib/hooks/useFetch'
import { classnames } from '@/shared/lib/helpers/classnames'

import { Loader } from '@/shared/ui/loader'
import { Header } from '@/shared/ui/header'
import { Section } from '@/shared/ui/section'
import { LazyImage } from '@/shared/ui/lazy-image'

import cls from './CasesList.module.sass'

const CasesList = () => {
    const { ref: inViewRef, inView } = useInView({
        //rootMargin: '10px 0px 0px 0px',
        threshold: 0.1,
        fallbackInView: true,
        initialInView: true
    })
    const [activeCase, setActiveCase] = useState<number | null>(null)
    const [nextLink, setNextLink] = useState<string | null | undefined>()
    const [cases, setCases] = useState<PostType[]>([])

    const { data } = useFetch<Cases>(
        nextLink || '/cases/',
        null, //{page_size: '1'},
        true,
        [inView]
    )

    useEffect(() => {
        if (!data) return
        setNextLink(data?.next)
    }, [data])

    useEffect(() => {
        setCases((prev) => [...prev, ...(data?.results || [])])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nextLink])

    const casesContent = useMemo(
        () =>
            cases?.map(({ id, title, cover = null }, idx) => (
                <Section
                    key={'case-' + id}
                    as="article"
                    gap="xs"
                    className={cls.article}
                    onClick={() => setActiveCase(idx)}
                >
                    <div className={cls.cover__wrapper}>
                        {cover && (
                            <LazyImage
                                src={
                                    typeof cover === 'object' && 'src' in cover ? cover.src : cover
                                }
                                alt={title}
                                sizes="(max-width: 684px) 100vw, 50vw"
                                fill
                                priority
                                quality={80}
                                style={{ objectFit: 'cover' }}
                            />
                        )}
                    </div>
                    <Header tag="h3" title={title} transform="upperFirst" />
                </Section>
            )),
        [cases]
    )

    const caseDetailContent = useMemo(
        () =>
            activeCase !== null && (
                <PageLayout
                    gap="none"
                    sectionMode={false}
                    handleOnClose={() => setActiveCase(null)}
                    className="case-detail"
                >
                    <Portfolio items={[cases[activeCase]]} />
                </PageLayout>
            ),
        [activeCase, cases]
    )

    if (!cases?.length) return <Loader />

    return (
        <>
            <div
                className={cls.cases__container}
                style={{ opacity: `${!data?.results ? 0.3 : 1}` }}
            >
                {casesContent}
                {data?.next !== null && (
                    <div
                        ref={inViewRef}
                        className={classnames(cls, ['cover__wrapper', 'skeleton'])}
                    />
                )}
            </div>
            {caseDetailContent}
        </>
    )
}

export default memo(CasesList)
