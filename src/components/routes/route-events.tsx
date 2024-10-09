'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

import { useNavigation } from '@/shared/lib/providers/NavigationProvider'

export function RouteEvents() {
    const currentPath = usePathname() // Get the current pathname from the router
    const ref = useRef(currentPath) // Create a ref to store the previous pathname
    const { showMenu, setPlayHeaderAnimation } = useNavigation()

    useEffect(() => {
        // const prevPath = ref.current
        const isDetailPage = currentPath?.split('/').filter(Boolean).length === 2
        setPlayHeaderAnimation(!showMenu && !isDetailPage)

        ref.current = currentPath
    }, [currentPath, showMenu, setPlayHeaderAnimation])

    return null
}
