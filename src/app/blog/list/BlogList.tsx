'use client'

import React, { useMemo, useState } from 'react'

import PageLayout from '@/components/layout/page-layout'
import type { PostType } from '@/components/post'

import { formatDate } from '@/shared/lib/helpers/datetime'
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

    const blogContent = useMemo(
        () => (
            <div className={cls.blog__container}>
                {posts?.map(
                    ({ id, title, excerpt = null, cover = null, event_date = null }, idx) => (
                        <Section
                            key={'blog-' + id}
                            as="article"
                            gap="xs"
                            className={cls.article}
                            style={{ padding: 0 }}
                        >
                            {cover && (
                                <LazyImage
                                    src={
                                        typeof cover === 'object' && 'src' in cover
                                            ? cover.src
                                            : cover
                                    }
                                    alt={title}
                                    sizes="(max-width: 684px) 100vw, 50vw"
                                    //priority
                                    quality={80}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
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
                            <Button title="Подробнее" rounded onClick={() => setActiveBlog(idx)} />
                        </Section>
                    )
                )}
            </div>
        ),
        [posts]
    )

    return (
        <>
            {blogContent}
            {activeBlog !== null && (
                <PageLayout
                    gap={'none'}
                    sectionMode={false}
                    handleOnClose={() => setActiveBlog(null)}
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
