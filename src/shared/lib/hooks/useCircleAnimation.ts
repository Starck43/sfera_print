import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { AnimeInstance } from 'animejs'
import anime from 'animejs/lib/anime.es'

interface CircleAnimationProps {
    rootClassName?: string
    childrenClassName?: string
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
        childrenClassName = '',
        steps,
        duration,
        delay = 0,
        loop = false,
        onDotClick,
        handleOnStepChange
    } = props
    const animationFirstRef = useRef<AnimeInstance | null>(null)
    const animationSecondRef = useRef<AnimeInstance | null>(null)
    const prefixName = childrenClassName ? `.${childrenClassName}__` : '.'

    useLayoutEffect(() => {
        anime
            .timeline({
                targets: prefixName + 'selected-dot',
                translateX: 55,
                translateY: 5,
                easing: 'linear'
            })
            .add({
                targets: '.' + rootClassName,
                opacity: 1,
                scale: 1.1,
                duration: 300,
                easing: 'linear'
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useLayoutEffect(() => {
        if (animationFirstRef?.current && animationSecondRef?.current) return

        const path: any = anime.path(prefixName + 'circle', 100)
        const pathLength = path().totalLength || 0
        if (!pathLength) return

        // анимация пути, движущегося по кругу
        animationFirstRef.current = anime({
            targets: prefixName + 'animated-circle',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'linear',
            duration: duration,
            delay: delay,
            loop: loop,
            direction: 'normal',
            autoplay: true,
            update: function (anim) {
                const currentStep = Math.floor((steps / 100) * anim.progress)
                handleOnStepChange?.(currentStep === steps ? currentStep - 1 : currentStep)
                anim.animatables[0].target.setAttribute(
                    'stroke-dasharray',
                    `${pathLength} ${pathLength}`
                )
            }
        })

        // Анимация точки с интервалом
        animationSecondRef.current = anime({
            targets: prefixName + 'selected-dot',
            translateX: path('x'),
            translateY: path('y'),
            easing: `steps(${steps})`,
            duration: duration,
            delay: delay,
            loop: loop,
            direction: 'normal',
            autoplay: true,
            opacity: {
                value: [0, 1],
                duration: 300,
                easing: 'linear'
            }
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleOnStepChange])

    useEffect(() => {
        const elements = document.querySelectorAll('.' + rootClassName + ' ' + prefixName + 'dot')
        const OnClickHandler = (index: number) => {
            onDotClick?.(index)
        }

        elements.forEach((element, index) => {
            element.addEventListener('click', () => OnClickHandler(index))
        })

        return () => {
            elements.forEach((element, index) => {
                element.removeEventListener('click', () => OnClickHandler(index))
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const runAnimation = useCallback((action: boolean) => {
        if (action) {
            animationFirstRef.current?.play()
            animationSecondRef.current?.play()
        } else {
            animationFirstRef.current?.pause()
            animationSecondRef.current?.pause()
        }
    }, [])

    return { runAnimation }
}

export default useCircleAnimation
