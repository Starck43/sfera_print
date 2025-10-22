'use client'

import React, { memo, useEffect, useMemo, useState } from 'react'

import PageLayout from '@/components/layout/page-layout'
import type { PostType } from '@/components/post'

import { useFetch } from '@/shared/lib/hooks/useFetch'
import { Header } from '@/shared/ui/header'
import { Section } from '@/shared/ui/section'
import { LazyImage } from '@/shared/ui/lazy-image'

import TechnologyDetails from '../details/TechnologyDetails'

import cls from './TechnologyList.module.sass'

const TechnologyList = ({ items }: { items: PostType[] }) => {
    const [activeTechnology, setActiveTechnology] = useState<number | null>(null)
    const { data: post, isError } = useFetch<PostType>(
        activeTechnology !== null ? items[activeTechnology].path : null,
        {},
        true,
        [activeTechnology]
    )

    const onItemClick = (idx: number | null) => {
        if (idx !== null) {
            history.pushState({ idx }, '', items[idx].path)
            setActiveTechnology(idx)
        } else {
            history.back()
            setActiveTechnology(null)
        }
    }

    // Эффект для обработки перехода назад
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (event.state && event.state.idx !== undefined) {
                setActiveTechnology(event.state.idx)
            } else {
                setActiveTechnology(null)
            }
        }

        // Подписываемся на событие popstate
        window.addEventListener('popstate', handlePopState)

        // Чистим подписку при размонтировании компонента
        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    const technologiesContent = useMemo(
        () => (
            <div className={cls.technologies__container}>
                {items?.map(({ slug, title, excerpt, cover }, idx) => (
                    <Section
                        key={slug}
                        as="article"
                        gap="xs"
                        align="center"
                        onClick={() => onItemClick(idx)}
                        style={{ padding: 0, height: 'max-content' }}
                    >
                        {cover && (
                            <LazyImage
                                src={cover as string}
                                alt={title}
                                //priority
                                sizes="(max-width: 684px) 50vw, 100vw"
                                style={{
                                    width: '100%',
                                    height: 'auto'
                                }}
                                width={16}
                                height={9}
                            />
                        )}
                        <Header
                            tag="h3"
                            title={title}
                            subTitle={excerpt}
                            align="center"
                            transform="upperFirst"
                        />
                    </Section>
                ))}
            </div>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [items]
    )

    if (!items?.length) {
        return (
            <Header
                fullWidth
                align="center"
                tag="h3"
                transform="upperFirst"
                title="Данные пока отсутствуют"
            />
        )
    }

    return (
        <>
            {technologiesContent}
            {activeTechnology !== null && (
                <PageLayout
                    gap={'none'}
                    sectionMode={false}
                    handleOnClose={() => onItemClick(null)}
                    className="technology-detail"
                >
                    {isError ? (
                        <Header title="Ошибка загрузки страницы!" style={{ flex: '0 1 50%' }} />
                    ) : (
                        <TechnologyDetails data={post} />
                    )}
                </PageLayout>
            )}
        </>
    )
}

export default memo(TechnologyList)
