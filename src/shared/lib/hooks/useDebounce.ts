import { MutableRefObject, useCallback, useRef } from 'react'

/**
 * A custom hook that allow to cancel a previous callback until the time interval runs out
 * @param callback - function, which calls after time expired
 * @param interval - time in ms
 */
export const useDebounce = (callback: (...args: any[]) => void, interval: number = 1000) => {
    const timer = useRef(false) as MutableRefObject<any>

    return useCallback(
        (...args: any[]) => {
            // on every call it restarts timeout
            if (timer.current) clearTimeout(timer.current)

            timer.current = setTimeout(() => {
                callback(...args)
            }, interval)
        },
        [callback, interval]
    )
}
