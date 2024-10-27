import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { AnimeInstance } from 'animejs'
import anime from 'animejs/lib/anime.es'

interface CircleAnimationProps {
    rootClassName?: string
    carouselClassName?: string
    selectedDotClassName: string
    steps: number
    duration: number
    delay?: number
    loop?: boolean
    onDotClick?: (index: number) => void
    handleOnStepChange?: (step: number) => void
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
        handleOnStepChange
    } = props
    const pathAnimationRef = useRef<AnimeInstance | null>(null)
    const prefixName = carouselClassName ? `.${carouselClassName}__` : '.'
    const dotsRef = useRef<Element[]>([])
    const currentStep = useRef(-1)
    const pathLength = useRef(0)

    useLayoutEffect(() => {
        anime({
            targets: '.' + rootClassName,
            opacity: 1,
            // scale: 1.1,
            duration: 300,
            easing: 'linear'
        })
    }, [rootClassName])

    useLayoutEffect(() => {
        if (pathAnimationRef?.current || typeof currentStep === 'undefined') return

        const path: any = anime.path(prefixName + 'circle', 100)
        pathLength.current = path().totalLength || 0
        if (!pathLength?.current) return

        // анимация пути, движущегося по кругу
        pathAnimationRef.current = anime({
            targets: prefixName + 'animated-circle',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'linear',
            duration: duration,
            delay: delay,
            loop: loop,
            direction: 'normal',
            autoplay: true,
            begin: function (anim) {
                anim.animatables[0].target.setAttribute(
                    'stroke-dasharray',
                    `${pathLength.current} ${pathLength.current}`
                )
            },
            update: function (anim) {
                const step = Math.floor((steps / 100) * anim.progress)
                if (step != currentStep.current) {
                    // const index = step === steps ? 0 : step
                    handleOnStepChange?.(step)
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
            dotsRef.current.forEach((dot) => dot.classList.remove(selectedDotClassName))
            dotsRef.current[(index + steps) % steps].classList.add(selectedDotClassName)
        },
        [selectedDotClassName, steps]
    )

    const onClickHandler = useCallback(
        (index: number) => {
            currentStep.current = index
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
            element.addEventListener('click', () => onClickHandler(index))
        })

        return () => {
            dotsRef.current.forEach((element, index) => {
                element.removeEventListener('click', () => onClickHandler(index))
            })
        }
    }, [prefixName, rootClassName, onClickHandler])

    return { runAnimation, currentSlide: currentStep.current }
}

export default useCircleAnimation
