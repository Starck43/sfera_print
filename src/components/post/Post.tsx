import React from "react"

import {classnames} from "@/shared/lib/helpers/classnames"
import {formatDate} from "@/shared/lib/helpers/datetime"
import {Slider} from "@/shared/ui/slider"
import {Header} from "@/shared/ui/header"
import {Col} from "@/shared/ui/stack"
import {Loader} from "@/shared/ui/loader"

import type {Media, PostType} from "./types"

import cls from "./Post.module.sass"


interface ContentProps {
	data?: PostType | undefined
	className?: string
	style?: React.CSSProperties
}

const Post = ({data, style, className}: ContentProps) => {

	if (!data) return <Loader/>

	const {id, title, cover: image, media, event_date, desc} = data

	return (
		<Slider
			media={[...(!media?.length && image ? [{id, image, title}] : media || [])] as Media[]}
			className={classnames(cls, ['container'], {}, [className])}
			style={style}
		>
			<Col gap="sm" align='start' fullWidth className={cls.details}>
				{title &&
                    <Header
                        title={title}
                        subTitle={event_date && <div className={cls.date}>{formatDate(event_date)}</div>}
                        tag='h2'
                        transform='upperCase'
                    />
				}
				{desc && <div dangerouslySetInnerHTML={{__html: desc}} className={cls.desc}/>}
			</Col>
		</Slider>
	)
}

export default Post