'use client'

import React, { memo } from 'react'
import Image from 'next/image'
import type { PostType } from '@/components/post'
import { Header } from '@/shared/ui/header'
import { Section } from '@/shared/ui/section'

import cls from './DocumentList.module.sass'

const DocumentList = ({ items }: { items: PostType[] }) => {
    const openDocumentHandler = (e: React.MouseEvent, idx: number) => {
        const file = items[idx]?.file
        if (!file) return
        e.preventDefault()
        window.open(file, '_blank')
    }

    return (
        <div className={cls.technologies__container}>
            {items?.map(({ slug, title, excerpt, cover }, idx) => (
                <Section
                    key={slug}
                    as="article"
                    gap="xs"
                    onClick={(e) => openDocumentHandler(e, idx)}
                    style={{ padding: 0 }}
                >
                    <div className={cls.cover__wrapper}>
                        {cover && (
                            <Image
                                src={cover as string}
                                alt={title}
                                fill
                                priority
                                sizes="(max-width: 524px) 100vw, (max-width: 1166px) 50vw, 33vw"
                                style={{
                                    objectFit: 'contain',
                                    transition: 'opacity 0.3s ease-in-out',
                                    opacity: 0
                                }}
                                onLoad={(e) => {
                                    e.currentTarget.style.opacity = '1'
                                }}
                            />
                        )}
                    </div>
                    <Header tag="h3" title={title} transform="upperFirst" />
                    <p className={cls.excerpt}>{excerpt}</p>
                </Section>
            ))}
        </div>
    )
}

export default memo(DocumentList)
