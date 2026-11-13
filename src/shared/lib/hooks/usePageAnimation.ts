import { useLayoutEffect, useCallback, useRef } from 'react'

export default function usePageAnimation(container: string) {
    const elementRef = useRef<HTMLElement | null>(null)

    // Страница из вложенного портала появляется в DOM на тик позже монтирования,
    // поэтому элемент ищем и по запросу. Скрытые страницы (Next оставляет их
    // в разметке) отбрасываем по нулевой ширине
    const getElement = useCallback(() => {
        const el = elementRef.current

        if (el && el.isConnected) return el

        const found =
            Array.from(document.querySelectorAll<HTMLElement>(container))
                .filter((node) => node.getBoundingClientRect().width > 0)
                .at(-1) ?? null

        elementRef.current = found

        return found
    }, [container])

    useLayoutEffect(() => {
        let frame = 0
        let cancelled = false

        // Элемента может ещё не быть в DOM: ждём его пару кадров,
        // иначе страница останется за нижней границей экрана
        const animate = () => {
            if (cancelled) return

            const el = getElement()

            if (!el) {
                if (frame++ < 10) requestAnimationFrame(animate)
                return
            }

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
        }

        animate()

        // ✅ Обновляем ref при размонтировании
        return () => {
            cancelled = true
            elementRef.current = null
        }
    }, [getElement])

    // Ушедшая страница остаётся в DOM со скрытой разметкой: по нулевому размеру
    // видно, что она больше не открыта
    const isVisible = useCallback(() => {
        const el = getElement()

        return !!el && el.isConnected && el.getBoundingClientRect().width > 0
    }, [getElement])

    const handleClick = useCallback(
        (fn?: () => void) => {
            const el = getElement()

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
        },
        [getElement]
    )

    return { handleClick, isVisible }
}
