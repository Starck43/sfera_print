import { MutableRefObject, useCallback, useEffect } from "react"

export interface ElementInViewProps {
    triggerRef: MutableRefObject<HTMLDivElement>
    containerRef: MutableRefObject<HTMLDivElement>
    steps?: number
    threshold?: number
    callback?: () => void
}

export const useElementInView = (props: ElementInViewProps) => {
    const { containerRef, triggerRef, steps = 1, threshold = 1, callback } = props

    const getThresholds = useCallback(() => {
        if (steps <= 1) return threshold

        const thresholds = []

        for (let i = 1.0; i <= steps; i++) {
            const ratio = i / steps
            thresholds.push(ratio)
        }
        return thresholds
    }, [steps, threshold])

    useEffect(() => {
        let observer: IntersectionObserver | null = null
        const container = containerRef.current
        const trigger = triggerRef.current

        if (callback) {
            const options = {
                root: container,
                rootMargin: "0px",
                threshold: getThresholds(),
            }

            observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    callback()
                }

                /*
                 if (entry.isIntersecting && entry.boundingClientRect.top < 0) {
                 console.log('direction to up', entry.target, entry.boundingClientRect.top)
                 }
                 */
            }, options)

            observer.observe(trigger)
        }
        return () => observer?.unobserve(trigger)
    }, [callback, containerRef, getThresholds, triggerRef])
}
