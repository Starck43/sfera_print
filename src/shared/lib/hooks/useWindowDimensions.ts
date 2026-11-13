import { useEffect, useState } from 'react'
import { getWindowDimensions } from '../helpers/dom'

/**
 * Размеры окна (или контейнера, если он передан).
 *
 * Значения обновляются из callback-ов ResizeObserver и события resize,
 * поэтому состояние не меняется синхронно внутри эффекта.
 */
export const useWindowDimensions = (container?: Element | null) => {
    const [windowDimensions, setWindowDimensions] = useState(() => getWindowDimensions(container))

    useEffect(() => {
        if (typeof window === 'undefined') return

        const handleResize = () => setWindowDimensions(getWindowDimensions(container))

        window.addEventListener('resize', handleResize)

        let observer: ResizeObserver | undefined
        if (container) {
            observer = new ResizeObserver(handleResize)
            observer.observe(container)
        }

        return () => {
            observer?.disconnect()
            window.removeEventListener('resize', handleResize)
        }
    }, [container])

    return windowDimensions
}
