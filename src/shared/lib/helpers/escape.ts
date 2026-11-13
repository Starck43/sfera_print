type EscapeHandler = () => void

interface EscapeLayer {
    id: symbol
    // Слой с бо́льшим z-index лежит выше и забирает Escape первым
    zIndex: number
    onEscape: EscapeHandler
    // Страницы, ушедшие из вида, Next.js оставляет в DOM — такие слои пропускаем
    isActive: () => boolean
}

const layers: EscapeLayer[] = []
let isListening = false

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return

    // Сверху вниз: сначала самый высокий слой, при равном z-index — открытый позже
    const layer = layers
        .map((item, index) => ({ item, index }))
        .sort((a, b) => b.item.zIndex - a.item.zIndex || b.index - a.index)
        .map(({ item }) => item)
        .find((item) => item.isActive())

    if (!layer) return

    event.preventDefault()
    layer.onEscape()
}

/**
 * Escape обрабатывает только верхний слой. Так страница, открытая поверх меню,
 * закрывается первой, а меню под ней остаётся и получает Escape следующим.
 */
export const addEscapeLayer = (
    id: symbol,
    zIndex: number,
    onEscape: EscapeHandler,
    isActive: () => boolean = () => true
) => {
    if (typeof document === 'undefined') return () => {}

    layers.push({ id, zIndex, onEscape, isActive })

    if (!isListening) {
        document.addEventListener('keydown', handleKeyDown)
        isListening = true
    }

    return () => {
        const index = layers.findIndex((layer) => layer.id === id)

        if (index !== -1) layers.splice(index, 1)
    }
}
