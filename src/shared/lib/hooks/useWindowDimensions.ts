import {useEffect, useState, useCallback, useLayoutEffect} from "react"
import { getWindowDimensions } from "../helpers/dom"

export const useWindowDimensions = (container?: Element | null) => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions(container))

    const handleResize = useCallback(() => setWindowDimensions(getWindowDimensions(container)), [container])

    useEffect(() => {
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [handleResize])

    return windowDimensions
}
