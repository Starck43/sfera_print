import React from "react"
import {Metadata, ResolvingMetadata} from "next"

import PageLayout from "@/components/layout/page-layout"
import type {PostType} from "@/components/post"

import {getBlog} from "@/shared/lib/api"
import constructMetadata from "@/shared/lib/helpers/metadata"

import BlogDetails from "../details/BlogDetails"
import type {PageProps} from "../../types"


export const generateMetadata = async ({params: {id}}: PageProps, parent: ResolvingMetadata): Promise<Metadata> => {
	const {media, ...data} = await getBlog<PostType>(id)
	return constructMetadata({...data, posts: media || [], type: 'article'}, await parent)
}

export async function generateStaticParams() {
	const posts = await getBlog<PostType>()

	return posts.map(post => ({
		params: {id: post.id},
	}))
}

const BlogDetailsPage = async ({params: {id}}: PageProps ) => {
	const post = await getBlog<PostType>(id)
	return (
		<PageLayout
			gap={'none'}
			sectionMode={false}
			className='blog__detail'
		>
			<BlogDetails data={post}/>
		</PageLayout>
	)
}


export default BlogDetailsPage
