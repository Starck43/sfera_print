import React, { memo } from 'react'
import { Post, type PostType } from '@/components/post'

interface DocumentDetailsProps {
    data?: PostType | undefined
    titleTag?: 'h1' | 'h2' | 'h3'
}

const DocumentDetails = ({ data, titleTag }: DocumentDetailsProps) => (
    <Post data={data} style={{ paddingTop: 0 }} titleTag={titleTag} />
)

export default memo(DocumentDetails)
