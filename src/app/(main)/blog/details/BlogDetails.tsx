import React from 'react'

import { Post, type PostType } from '@/components/post'

const BlogDetails = ({ data }: { data: PostType | undefined }) => (
    <Post data={data} style={{ paddingTop: 0 }} />
)

export default BlogDetails
