import { useLayoutEffect, useCallback, useMemo } from 'react'
import anime from 'animejs/lib/anime.es'


export default function usePageAnimation(className: string) {
    const animationOptions = useMemo(
        () => ({
            targets: '.' + className,
            direction: 'normal',
            duration: 800,
            easing: 'easeInOutQuad'
        }),
        [className]
    )

    useLayoutEffect(() => {
        anime({
            ...animationOptions,
            translateY: ['100%', 0],
            //opacity: [0.5, 1],
            complete: (el) => {
                el.animatables[0].target.style.position = 'fixed'
            }
        })
    }, [animationOptions])

    const handleClick = useCallback(
        (fn?: () => void) => {
            const effect = anime({
                ...animationOptions,
                translateY: [0, '100%']
                //opacity: [1, 0],
            })

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            fn && effect.finished.then(fn)
        },
        [animationOptions]
    )

    return { handleClick }
}
