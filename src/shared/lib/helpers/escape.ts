type EscapeHandler = () => void

interface EscapeLayer {
    id: symbol
    // Слой с большим z-index лежит выше и забирает Escape первым
    zIndex: number
    onEscape: EscapeHandler
}

const layers: EscapeLayer[] = []
let isListening = false

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return

    // Верхний слой — самый высокий по z-index, при равенстве — открытый позже
    const layer = layers.reduce<EscapeLayer | null>(
        (top, item) => (!top || item.zIndex >= top.zIndex ? item : top),
        null
    )

    if (!layer) return

    event.preventDefault()
    layer.onEscape()
}

/**
 * Escape обрабатывает только верхний слой. Так страница, открытая поверх меню,
 * закрывается первой, а меню под ней остаётся и получает Escape следующим.
 */
export const addEscapeLayer = (id: symbol, zIndex: number, onEscape: EscapeHandler) => {
    if (typeof document === 'undefined') return () => {}

    layers.push({ id, zIndex, onEscape })

    if (!isListening) {
        document.addEventListener('keydown', handleKeyDown)
        isListening = true
    }

    return () => {
        const index = layers.findIndex((layer) => layer.id === id)

        if (index !== -1) layers.splice(index, 1)
    }
}
