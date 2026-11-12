import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'

type SpringType = typeof import('@react-spring/web')
type GestureType = typeof import('@use-gesture/react')

interface AnimationContextPayload {
    Gesture?: GestureType
    Spring?: SpringType
    isLoaded?: boolean
}

const AnimationContext = createContext<AnimationContextPayload>({})

/**
 * Модули анимации подгружаются асинхронно, поэтому храним их на уровне модуля.
 * Обращаться к ним нужно напрямую (springModule.useSpring), а не через объект из
 * контекста: вызов хука на значении, полученном из контекста, считается динамическим.
 */
export let springModule: SpringType | undefined
export let gestureModule: GestureType | undefined

// both libraries depend on each other
const getAsyncAnimationModules = async () =>
    Promise.all([import('@react-spring/web'), import('@use-gesture/react')])

const loadAnimationModules = async (): Promise<void> => {
    const [Spring, Gesture] = await getAsyncAnimationModules()

    springModule = Spring
    gestureModule = Gesture
}

export const useAnimationModules = () =>
    useContext(AnimationContext) as Required<AnimationContextPayload>

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        let cancelled = false

        loadAnimationModules().then(() => {
            if (!cancelled) setIsLoaded(true)
        })

        return () => {
            cancelled = true
        }
    }, [])

    const value = useMemo(
        () => ({
            Gesture: gestureModule,
            Spring: springModule,
            isLoaded
        }),
        [isLoaded]
    )

    return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>
}
