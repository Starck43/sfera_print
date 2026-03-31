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

        // ✅ Обновляем ref при размонтировании
        return () => {
            elementRef.current = null
        }
    }, [container])

    const handleClick = useCallback((fn?: () => void) => {
        const el = elementRef.current

        // ✅ Проверяем, что элемент все еще в DOM
        if (!el || !document.body.contains(el)) {
            fn?.()
            return
        }

        const anim = el.animate(
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
