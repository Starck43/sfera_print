'use client'

import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
    children: ReactNode
    target?: HTMLElement
}

export const Portal = (props: PortalProps) => {
    const { children, target } = props

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <>{children}</>
    }

    return createPortal(children, target || document.body)
}
