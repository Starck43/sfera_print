import { useEffect, useState } from 'react'

export const useScrollPosition = (
    container: HTMLElement | null | undefined,
    targetScroll: number = window.innerHeight
) => {
    const [scroll, setScroll] = useState({
        position: 0,
        reachedTarget: false
    })

    useEffect(() => {
        if (!container) return
        const handleScroll = () => {
            setScroll({
                position: container.scrollTop,
                reachedTarget: container.scrollTop >= targetScroll
            })
        }

        container.addEventListener('scroll', handleScroll)
        return () => container.removeEventListener('scroll', handleScroll)
    }, [container, targetScroll])

    return scroll
}
