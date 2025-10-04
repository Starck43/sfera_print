import React, {
    memo,
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
    TouchEvent,
    WheelEvent,
    useRef
} from 'react'

import { useNavigation } from '@/shared/lib/providers/NavigationProvider'
import { getWindowDimensions } from '@/shared/lib/helpers/dom'
import { calculateStrokeWidth } from '@/shared/lib/helpers/svg'
import useCircleAnimation from '@/shared/lib/hooks/useCircleAnimation'
import { useDebounce } from '@/shared/lib/hooks/useDebounce'

import CircleNav from '@/svg/carousel.svg'
import cls from './CircleCarousel.module.sass'

interface CarouselNavProps {
    steps: number
    slideDuration: number
    infinite?: boolean
    onSlideClick: (e: React.MouseEvent<SVGGElement>, index: number) => void
    onStepChange?: (step: number) => void
}

const CarouselNav = (props: CarouselNavProps) => {
    const { steps, slideDuration, infinite = false, onSlideClick, onStepChange } = props
    const { playHeaderAnimation } = useNavigation()
    const [strokeWidth, setStrokeWidth] = useState(0)
    const touchPosition = useRef<number | null>(null)
    const { setPlayHeaderAnimation } = useNavigation()

    const handleOnDotClick = useCallback(
        (index: number = 0) => {
            setPlayHeaderAnimation(false)
            onStepChange?.(index)
        },
        [onStepChange, setPlayHeaderAnimation]
    )
    const { runAnimation, currentSlide, updateSelectedDot } = useCircleAnimation({
        rootClassName: cls.circle__nav,
        carouselClassName: 'carousel_svg',
        selectedDotClassName: 'selected_dot',
        steps: steps,
        duration: steps * slideDuration,
        loop: infinite,
        onDotClick: handleOnDotClick,
        onStepChange
    })

    useLayoutEffect(() => {
        const { width, height } = getWindowDimensions()
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

    const changeSlide = useCallback(
        (direction: number) => {
            const index = (currentSlide.current + direction + steps) % steps
            handleOnDotClick?.(index)
            updateSelectedDot?.(index)
        },
        [currentSlide, handleOnDotClick, steps, updateSelectedDot]
    )

    const debouncedTrigger = useDebounce(() => {
        touchPosition.current = null
    }, 50)

    const handleWheel = useCallback(
        (e: WheelEvent) => {
            e.stopPropagation()
            debouncedTrigger()
            if (touchPosition.current === null) {
                const offset = e.deltaY
                touchPosition.current = offset
                if (offset > 0) {
                    changeSlide(1)
                } else {
                    changeSlide(-1)
                }
            }
        },
        [changeSlide, debouncedTrigger]
    )

    const handleTouchStart = (e: TouchEvent) => {
        touchPosition.current = e.touches[0].clientY
    }

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (touchPosition.current === null) {
                return
            }

            const currentPosition = e.touches[0].clientY
            const direction = touchPosition.current - currentPosition

            if (direction > 10) {
                changeSlide(1)
            }

            if (direction < -10) {
                changeSlide(-1)
            }

            touchPosition.current = null
        },
        [changeSlide]
    )

    return (
        <div
            className={cls.circle__nav_container}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onWheel={handleWheel}
        >
            <CircleNav
                onClick={(e: React.MouseEvent<SVGGElement>) =>
                    onSlideClick(e, currentSlide.current)
                }
                className={cls.circle__nav}
                style={{
                    strokeWidth: strokeWidth,
                    '--path-width': strokeWidth * 3
                }}
            />
        </div>
    )
}

export default memo(CarouselNav)
