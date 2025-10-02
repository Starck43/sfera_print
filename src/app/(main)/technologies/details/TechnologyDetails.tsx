import React, { memo } from 'react'
import { Post, type PostType } from '@/components/post'

const TechnologyDetails = ({ data }: { data: PostType | undefined }) => (
    <Post data={data} style={{ paddingTop: 0 }} />
)

export default memo(TechnologyDetails)
