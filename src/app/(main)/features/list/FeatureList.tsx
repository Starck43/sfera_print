'use client'

import React, { memo } from 'react'
import Link from 'next/link'

import type { PostType } from '@/components/post'

import { Header } from '@/shared/ui/header'
import { Section } from '@/shared/ui/section'
import { LazyImage } from '@/shared/ui/lazy-image'

import cls from './FeatureList.module.sass'

const FeatureList = ({ items }: { items: PostType[] }) => {
    return (
        <div className={cls.feature__container}>
            {items?.map(({ slug, title, excerpt, cover }) => (
                <Section key={slug} as="article" gap="sm">
                    <Link href={`/features/${slug}`} className={cls.link}>
                        <Header tag="h2" title={title} transform="upperFirst" />
                        {excerpt ? <p className={cls.excerpt}>{excerpt}</p> : null}

                        {cover && (
                            <LazyImage
                                src={cover as string}
                                alt={title}
                                sizes="(max-width: 524px) 100vw, (max-width: 1166px) 50vw, 33vw"
                                style={{
                                    width: '100%',
                                    height: 'auto'
                                }}
                                width={4}
                                height={6}
                            />
                        )}
                    </Link>
                </Section>
            ))}
        </div>
    )
}

export default memo(FeatureList)
