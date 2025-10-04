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
    const pathLength = useRef(0)

    useLayoutEffect(() => {
        animate('.' + rootClassName, {
            opacity: 1,
            // scale: 1.1,
            duration: 300,
            ease: 'linear'
        })
    }, [rootClassName])

    useLayoutEffect(() => {
        if (pathAnimationRef?.current || typeof currentStep === 'undefined') return

        //const path: any = svg.createMotionPath(prefixName + 'circle')
        // pathLength.current = path().totalLength || 0
        // if (!pathLength?.current) return

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
                const step = Math.floor(anim.progress * steps)
                if (step != currentStep.current) {
                    onStepChange?.(step)
                    updateSelectedDot(step)
                }
            }
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const runAnimation = useCallback((action: boolean) => {
        if (action) {
            pathAnimationRef.current?.play()
        } else {
            pathAnimationRef.current?.pause()
        }
    }, [])

    const updateSelectedDot = useCallback(
        (index: number) => {
            currentStep.current = index
            dotsRef.current.forEach((dot) => dot.classList.remove(selectedDotClassName))
            dotsRef.current[(index + steps) % steps].classList.add(selectedDotClassName)
        },
        [selectedDotClassName, steps]
    )

    const onClickHandler = useCallback(
        (index: number, event?: Event) => {
            if (event) {
            event.stopPropagation() // ← Останавливаем всплытие
            event.preventDefault()
        }
            runAnimation(false)
            updateSelectedDot(index)
            const path = document.querySelector(prefixName + 'animated-circle') as SVGPathElement
            if (path) {
                path.style.strokeDashoffset = (pathLength.current / steps) * (steps - index) + 'px'
                //const newStrokeDasharray = `${(pathLength.current / steps) * index} ${pathLength.current}`
                //path.setAttribute('stroke-dasharray', newStrokeDasharray)
            }
            onDotClick?.(index)
        },
        [onDotClick, prefixName, runAnimation, steps, updateSelectedDot]
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
