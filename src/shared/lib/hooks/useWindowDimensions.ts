import { useEffect, useState, useCallback } from 'react'
import { getWindowDimensions } from '../helpers/dom'

export const useWindowDimensions = (container?: Element | null) => {
    const [windowDimensions, setWindowDimensions] = useState(() =>
        typeof window !== 'undefined'
            ? getWindowDimensions(container)
            : { width: 0, height: 0, ratio: 0, orientation: 'landscape' as const }
    )

    const handleResize = useCallback(
        () => setWindowDimensions(getWindowDimensions(container)),
        [container]
    )

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [handleResize])

    return windowDimensions
}
