import React, { memo } from 'react'
import { Post, type PostType } from '@/components/post'

interface TechnologyDetailsProps {
    data: PostType | undefined
    titleTag?: 'h1' | 'h2' | 'h3'
}

const TechnologyDetails = ({ data, titleTag }: TechnologyDetailsProps) => (
    <Post data={data} style={{ paddingTop: 0 }} titleTag={titleTag} />
)

export default memo(TechnologyDetails)
