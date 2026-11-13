import React from 'react'

import { Post, type PostType } from '@/components/post'

interface BlogDetailsProps {
    data: PostType | undefined
    titleTag?: 'h1' | 'h2' | 'h3'
}

const BlogDetails = ({ data, titleTag }: BlogDetailsProps) => (
    <Post data={data} style={{ paddingTop: 0 }} titleTag={titleTag} />
)

export default BlogDetails
