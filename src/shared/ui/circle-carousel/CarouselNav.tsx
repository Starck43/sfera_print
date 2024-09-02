import React, {memo, useEffect, useLayoutEffect, useState} from "react"

import {useNavigation} from "@/shared/lib/providers/NavigationProvider"
import {getWindowDimensions} from "@/shared/lib/helpers/dom"
import {calculateStrokeWidth} from "@/shared/lib/helpers/svg"
import useCircleAnimation from "@/shared/lib/hooks/useCircleAnimation"

import CircleNav from "@/svg/carousel.svg"
import cls from './CircleCarousel.module.sass'


interface CarouselNavProps<T> {
	steps: number
	loopDuration: number
	infinite?: boolean
	onDotClick: (index: number) => void
	handleOnStepChange?: (step: number) => void
}

const CarouselNav = <T,>(props: CarouselNavProps<T>) => {
	const {steps, loopDuration, infinite = false, onDotClick, handleOnStepChange} = props
	const {playHeaderAnimation} = useNavigation()
	const [strokeWidth, setStrokeWidth] = useState(0)

	const {runAnimation} = useCircleAnimation({
		rootClassName: cls.circle__nav,
		childrenClassName: 'carousel_svg',
		steps: steps,
		duration: loopDuration,
		loop: infinite,
		onDotClick,
		handleOnStepChange
	})

	useLayoutEffect(() => {
		const {width, height} = getWindowDimensions()
		const calculatedStrokeWidth = calculateStrokeWidth({
			viewport: [width, height],
			viewBox: [115, 115],
			strokeWidth: 0.3,
			scaleFactor: 0.1
		})
		setStrokeWidth(() => calculatedStrokeWidth)
	}, [])


	useEffect(() => {
		runAnimation?.(playHeaderAnimation)
	}, [playHeaderAnimation, runAnimation])


	return (
		<CircleNav
			className={cls.circle__nav}
			style={{
				strokeWidth: strokeWidth,
				'--path-width': strokeWidth * 1.4
			}}
		/>

	)
}

export default memo(CarouselNav)
