import React, {memo} from "react"

import {Col} from "@/shared/ui/stack"
import {Slider} from "@/shared/ui/slider"
import type {PostType} from "@/components/post"

import cls from './Portfolio.module.sass'
import {Header} from "@/shared/ui/header";


const Portfolio = ({items}: {items: PostType[]}) => {
	if (!items?.length) return <Header fullWidth={false} transform={'upperFirst'} title={'Пока пусто!'}/>

	return (
		items?.map(({id, title, desc, media}) => (
			<Slider
				key={'case-' + id}
				media={media || []}
			>
				<Col gap="sm" align='start' fullWidth className={cls.details}>
					<h3>{title}</h3>
					{desc && <div dangerouslySetInnerHTML={{__html: desc}} className={cls.desc}/>}
				</Col>
			</Slider>
		))
	)
}

export default memo(Portfolio)
