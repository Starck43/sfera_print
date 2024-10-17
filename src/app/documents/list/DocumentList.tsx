'use client'

import React, { memo } from 'react'
import type { PostType } from '@/components/post'

import { Header } from '@/shared/ui/header'
import { Section } from '@/shared/ui/section'
import { LazyImage } from '@/shared/ui/lazy-image'

import cls from './DocumentList.module.sass'

const DocumentList = ({ items }: { items: PostType[] }) => {
    const openDocumentHandler = (e: React.MouseEvent, idx: number) => {
        const file = items[idx]?.file
        if (!file) return
        e.preventDefault()
        window.open(file, '_blank')
    }

    return (
        <div className={cls.document__container}>
            {items?.map(({ slug, title, excerpt, cover }, idx) => (
                <Section
                    key={slug}
                    as="article"
                    gap="xs"
                    onClick={(e) => openDocumentHandler(e, idx)}
                    style={{ padding: 0 }}
                >
                    {cover && (
                        <LazyImage
                            src={cover as string}
                            alt={title}
                            sizes="(max-width: 524px) 100vw, (max-width: 1166px) 50vw, 33vw"
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                            width={4}
                            height={6}
                        />
                    )}
                    <Header tag="h3" title={title} transform="upperFirst" />
                    <p className={cls.excerpt}>{excerpt}</p>
                </Section>
            ))}
        </div>
    )
}

export default memo(DocumentList)
