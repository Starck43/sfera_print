'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

interface NavigationContextProps {
    showMenu?: boolean
    setShowMenu?: (status: boolean) => void
    playHeaderAnimation?: boolean
    setPlayHeaderAnimation?: (status: boolean) => void
}

const NavigationContext = createContext<NavigationContextProps>({})

export const useNavigation = () => useContext(NavigationContext) as Required<NavigationContextProps>

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
    const [showMenu, setShowMenu] = useState(false)
    const [playHeaderAnimation, setPlayHeaderAnimation] = useState(false)

    return (
        <NavigationContext.Provider
            value={{
                playHeaderAnimation,
                setPlayHeaderAnimation,
                showMenu,
                setShowMenu
            }}
        >
            {children}
        </NavigationContext.Provider>
    )
}
