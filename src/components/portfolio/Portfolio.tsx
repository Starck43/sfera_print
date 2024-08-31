import React, {memo} from "react"

import type {Media, PostType} from "@/components/post"

import {Col} from "@/shared/ui/stack"
import {Slider} from "@/shared/ui/slider"
import {Loader} from "@/shared/ui/loader"

import cls from './Portfolio.module.sass'


const Portfolio = ({items}: {items: PostType[]}) => {
	if (!items?.length) return <Loader/>

	return (
		items?.map(({id, title, desc, cover: image, media}) => (
			<Slider
				key={'case-' + id}
				media={[...(!media?.length && image ? [{id, image, title}] : media || [])] as Media[]}
				style={{paddingTop: 0}}
			>
				<Col gap="sm" align='start' fullWidth className={cls.details}>
					<h2>{title}</h2>
					{desc && <div dangerouslySetInnerHTML={{__html: desc}} className={cls.desc}/>}
				</Col>
			</Slider>
		))
	)
}

export default memo(Portfolio)
