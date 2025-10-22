import { useLayoutEffect, useCallback, useRef } from 'react'

export default function usePageAnimation(container: string) {
    const elementRef = useRef<HTMLElement | null>(null)

    useLayoutEffect(() => {
        const el = document.querySelector<HTMLElement>(container)
        if (!el) return
        elementRef.current = el

        el.animate(
            [
                { transform: 'translateY(100%)', opacity: 1 },
                { transform: 'translateY(0)', opacity: 1 }
            ],
            {
                duration: 600,
                easing: 'ease-in',
                fill: 'forwards'
            }
        )
    }, [container])

    const handleClick = useCallback((fn?: () => void) => {
        if (!elementRef.current) {
            fn?.()
            return
        }
        const anim = elementRef.current.animate(
            [
                { transform: 'translateY(0)', opacity: 1 },
                { transform: 'translateY(100%)', opacity: 1 }
            ],
            {
                duration: 600,
                easing: 'ease-in',
                fill: 'forwards'
            }
        )
        anim.onfinish = () => {
            fn?.()
        }
    }, [])

    return { handleClick }
}
