'use client'

import React, { useEffect, useMemo, useState } from 'react'

import PageLayout from '@/components/layout/page-layout'
import type { PostType } from '@/components/post'

import { formatDate } from '@/shared/lib/helpers/datetime'
import { getDeviceImage } from '@/shared/lib/helpers/image'
import { useFetch } from '@/shared/lib/hooks/useFetch'

import { Section } from '@/shared/ui/section'
import { Header } from '@/shared/ui/header'
import { Button } from '@/shared/ui/button'
import { LazyImage } from '@/shared/ui/lazy-image'

import BlogDetails from '../details/BlogDetails'

import cls from './BlogList.module.sass'

const BlogList = ({ posts }: { posts: PostType[] }) => {
    const [activeBlog, setActiveBlog] = useState<number | null>(null)
    const { data: post, isError } = useFetch<PostType>(
        activeBlog !== null ? posts[activeBlog].path : null,
        {},
        true,
        [activeBlog]
    )

    const onItemClick = (idx: number | null) => {
        if (idx !== null) {
            history.pushState({ idx }, '', posts[idx].path)
            setActiveBlog(idx)
        } else {
            history.back()
            setActiveBlog(null)
        }
    }

    // Эффект для обработки перехода назад
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (event.state?.idx !== undefined) {
                setActiveBlog(event.state.idx)
            } else {
                setActiveBlog(null)
            }
        }

        // Подписываемся на событие popstate
        window.addEventListener('popstate', handlePopState)

        // Чистим подписку при размонтировании компонента
        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    const blogContent = useMemo(
        () => (
            <div className={cls.blog__container}>
                {posts?.map(
                    ({ id, title, excerpt = null, cover = null, event_date = null }, idx) => {
                        const coverSrc = getDeviceImage(cover)
                        return (
                            <Section
                                key={'blog-' + id}
                                as="article"
                                gap="xs"
                                align="center"
                                className={cls.article}
                                style={{ padding: 0, height: 'max-content' }}
                            >
                                {coverSrc.src && (
                                    <LazyImage
                                        src={coverSrc.src}
                                        srcSet={coverSrc.srcSet}
                                        alt={title}
                                        sizes="(max-width: 684px) 50vw, 100vw"
                                        style={{
                                            width: '100%',
                                            height: 'auto'
                                        }}
                                        width={16}
                                        height={9}
                                    />
                                )}
                                <Header tag="h3" title={title} transform="upperFirst" />
                                {event_date && (
                                    <span style={{ marginTop: '-0.5rem' }}>
                                        {formatDate(event_date)}
                                    </span>
                                )}
                                {excerpt && <p className={cls.excerpt}>{excerpt}</p>}
                                <Button
                                    title="Подробнее"
                                    rounded
                                    onClick={() => onItemClick(idx)}
                                />
                            </Section>
                        )
                    }
                )}
            </div>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [posts]
    )

    if (!posts?.length) {
        return (
            <Header
                fullWidth
                align="center"
                tag="h3"
                transform="upperFirst"
                title="Новости скоро будут..."
                style={{ width: '100%' }}
            />
        )
    }

    return (
        <>
            {blogContent}
            {activeBlog !== null && (
                <PageLayout
                    gap={'none'}
                    sectionMode={false}
                    handleOnClose={() => onItemClick(null)}
                    className="blog-detail"
                >
                    {isError ? (
                        <Header title="Ошибка загрузки статьи!" style={{ flex: '0 1 50%' }} />
                    ) : (
                        <BlogDetails data={post} />
                    )}
                </PageLayout>
            )}
        </>
    )
}

export default BlogList
