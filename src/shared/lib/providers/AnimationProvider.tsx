import { ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

type SpringType = typeof import('@react-spring/web')
type GestureType = typeof import('@use-gesture/react')

interface AnimationContextProps {
    Gesture?: GestureType
    Spring?: SpringType
    isLoaded?: boolean
}

const AnimationContext = createContext<AnimationContextProps>({})

// both libraries depend on each other
const getAsyncAnimationModules = async () =>
    Promise.all([import('@react-spring/web') as any, import('@use-gesture/react') as any])

export const useAnimationModules = () =>
    useContext(AnimationContext) as Required<AnimationContextProps>

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
    const SpringRef = useRef<SpringType>()
    const GestureRef = useRef<GestureType>()
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        getAsyncAnimationModules().then(([Spring, Gesture]) => {
            SpringRef.current = Spring
            GestureRef.current = Gesture
            setIsLoaded(true)
        })
    }, [])

    const value = useMemo(
        () => ({
            Gesture: GestureRef.current,
            Spring: SpringRef.current,
            isLoaded
        }),
        [isLoaded]
    )

    return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>
}
