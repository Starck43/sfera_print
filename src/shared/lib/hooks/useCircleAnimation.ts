import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { animate, type JSAnimation, svg } from 'animejs'

interface CircleAnimationProps {
    rootClassName?: string
    carouselClassName?: string
    selectedDotClassName: string
    steps: number
    duration: number
    delay?: number
    loop?: boolean
    onDotClick?: (index: number) => void
    onStepChange?: (step: number) => void
}

const useCircleAnimation = (props: CircleAnimationProps) => {
    const {
        rootClassName = '',
        carouselClassName = '',
        selectedDotClassName,
        steps,
        duration,
        delay = 0,
        loop = false,
        onDotClick,
        onStepChange
    } = props
    const pathAnimationRef = useRef<JSAnimation | null>(null)
    // const [selectedIndex, setSelectedIndex] = useState(0)
    const prefixName = carouselClassName ? `.${carouselClassName}__` : '.'
    const dotsRef = useRef<Element[]>([])
    const currentStep = useRef(-1)
    const onStepChangeRef = useRef(onStepChange)

    // Keep the latest callback reference
    useEffect(() => {
        onStepChangeRef.current = onStepChange
    }, [onStepChange])

    useLayoutEffect(() => {
        animate('.' + rootClassName, {
            opacity: 1,
            // scale: 1.1,
            duration: 300,
            ease: 'linear'
        })
    }, [rootClassName])

    const updateSelectedDot = useCallback(
        (index: number) => {
            currentStep.current = index
            dotsRef.current.forEach((dot) => dot.classList.remove(selectedDotClassName))
            dotsRef.current[(index + steps) % steps]?.classList.add(selectedDotClassName)
        },
        [selectedDotClassName, steps]
    )

    useLayoutEffect(() => {
        // Skip if animation already exists OR if steps is not ready
        if (pathAnimationRef?.current || !steps) return

        // Store values in closure for onUpdate callback
        const totalSteps = steps

        // анимация пути, движущегося по кругу
        pathAnimationRef.current = animate(svg.createDrawable(prefixName + 'animated-circle'), {
            draw: '0 1',
            ease: 'linear',
            duration: duration,
            delay: delay,
            loop: loop,
            direction: 'normal',
            autoplay: true,
            onUpdate: function (anim) {
                // Use iterationProgress for looped animations (0-1 per iteration)
                // Use progress for non-looped animations (0-1 for entire animation)
                const rawProgress = anim.iterationProgress || anim.progress
                const progress = rawProgress > 1 ? rawProgress / 100 : rawProgress
                const step = Math.floor(progress * totalSteps) % totalSteps

                if (step !== currentStep.current) {
                    currentStep.current = step
                    onStepChangeRef.current?.(step)
                    updateSelectedDot?.(step)
                }
            }
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [steps])

    const runAnimation = useCallback((action: boolean) => {
        if (action) {
            pathAnimationRef.current?.play()
        } else {
            pathAnimationRef.current?.pause()
        }
    }, [])

    const onClickHandler = useCallback(
        (index: number, event?: Event) => {
            if (event) {
                event.stopPropagation() // ← Останавливаем всплытие
                event.preventDefault()
            }
            runAnimation(false)
            updateSelectedDot(index)
            onDotClick?.(index)
        },
        [onDotClick, runAnimation, updateSelectedDot]
    )

    useEffect(() => {
        const dots = document.querySelectorAll('.' + rootClassName + ' ' + prefixName + 'dot')
        dotsRef.current = Array.from(dots)

        dotsRef.current.forEach((element, index) => {
            element.addEventListener('click', (e) => onClickHandler(index, e))
        })

        return () => {
            dotsRef.current.forEach((element, index) => {
                element.removeEventListener('click', (e) => onClickHandler(index, e))
            })
        }
    }, [prefixName, rootClassName, onClickHandler])

    return { runAnimation, currentSlide: currentStep, updateSelectedDot }
}

export default useCircleAnimation
