import React, {
    memo,
    useCallback,
    useEffect,
    useState,
    TouchEvent,
    WheelEvent,
    useRef,
    useEffectEvent
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
    const touchPosition = useRef<number | null>(null)
    const { setPlayHeaderAnimation } = useNavigation()
    const [currentIndex, setCurrentIndex] = useState(0)
    const changeSlideRef = useRef<(direction: number) => void>(() => {})

    const handleOnDotClick = useCallback(
        (index: number = 0) => {
            setCurrentIndex(index)
            onStepChange?.(index)
        },
        [onStepChange]
    )

    const { runAnimation, currentSlide, updateSelectedDot } = useCircleAnimation({
        rootClassName: cls.circle__nav,
        carouselClassName: 'carousel_svg',
        selectedDotClassName: cls.selected_dot,
        steps: steps,
        duration: steps * slideDuration,
        loop: infinite,
        onDotClick: handleOnDotClick,
        onStepChange
    })

    const [strokeWidth] = useState(() => {
        const { width, height } = getWindowDimensions()
        return calculateStrokeWidth({
            viewport: [width, height],
            viewBox: [115, 115],
            strokeWidth: 0.3,
            scaleFactor: 0.1
        })
    })

    useEffect(() => {
        setPlayHeaderAnimation(true)
    }, [currentIndex, setPlayHeaderAnimation])

    const handleRunAnimation = useEffectEvent(() => {
        runAnimation?.(playHeaderAnimation)
    })

    useEffect(() => {
        handleRunAnimation()
    }, [playHeaderAnimation])

    useEffect(() => {
        changeSlideRef.current = (direction: number) => {
            const index = (currentSlide.current + direction + steps) % steps
            handleOnDotClick(index)
            updateSelectedDot(index)
        }
    })

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

                if (offset > 0) changeSlideRef.current(1)
                else changeSlideRef.current(-1)
            }
        },
        [debouncedTrigger]
    )

    const handleTouchStart = (e: TouchEvent) => {
        touchPosition.current = e.touches[0].clientY
    }

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (touchPosition.current === null) return

        const currentPosition = e.touches[0].clientY
        const direction = touchPosition.current - currentPosition

        if (direction > 10) changeSlideRef.current(1)
        if (direction < -10) changeSlideRef.current(-1)

        touchPosition.current = null
    }, [])

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
