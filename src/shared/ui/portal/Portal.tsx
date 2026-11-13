'use client'

import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const PortalContext = createContext(false)

interface PortalProps {
    children: ReactNode
    target?: HTMLElement | null
}

export const Portal = (props: PortalProps) => {
    const { children, target } = props
    const isNested = useContext(PortalContext)
    const [mounted, setMounted] = useState(false)

    // Корневой портал (содержимое страницы) остаётся на своём месте: только так
    // текст страницы попадает в HTML, который отдаёт сервер, и не пересоздаётся
    // после гидрации. Вложенные порталы (модальные окна, оверлеи списков)
    // по-прежнему монтируются в document.body.
    const isInline = !target && !isNested

    useEffect(() => {
        if (isInline) return

        const timer = setTimeout(() => {
            setMounted(true)
        }, 0)

        return () => {
            clearTimeout(timer)
        }
    }, [isInline])

    if (isInline) {
        return <PortalContext.Provider value={true}>{children}</PortalContext.Provider>
    }

    if (!mounted) return null

    return createPortal(
        <PortalContext.Provider value={true}>{children}</PortalContext.Provider>,
        target || document.body
    )
}
