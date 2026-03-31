'use client'

import { ReactNode, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
    children: ReactNode
    target?: HTMLElement | null
}

export const Portal = (props: PortalProps) => {
    const { children, target } = props
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true)
        }, 0)

        return () => {
            clearTimeout(timer)
            setMounted(false)
        }
    }, [])

    if (!mounted) {
        return null
    }

    return createPortal(children, target || document.body)
}
