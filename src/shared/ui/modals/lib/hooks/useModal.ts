'use client'

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    MutableRefObject
} from 'react'

interface HookModalProps {
    onSubmit?: () => void
    onClose?: () => void
    animationTime?: number
    isOpen: boolean
}

/**
 * useModal - the custom hook for modal components (Drawer/Modal)
 * @param onSubmit
 * @param onClose
 * @param isOpen
 * @param animationTime
 */

export const useModal = ({
    onSubmit,
    onClose,
    isOpen,
    animationTime
}: HookModalProps) => {
    const [isShown, setIsShown] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const timerRef = useRef() as MutableRefObject<ReturnType<typeof setTimeout>>

    const handleSubmit = useCallback(() => {
        if (onSubmit) {
            setIsShown(false)
            timerRef.current = setTimeout(() => {
                onSubmit()
            }, animationTime)
        }
    }, [animationTime, onSubmit])

    const handleClose = useCallback(() => {
        if (onClose) {
            setIsShown(false)
            timerRef.current = setTimeout(() => {
                onClose()
            }, animationTime)
        }
    }, [animationTime, onClose])

    const onPressKey = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose()
            }
        },
        [handleClose]
    )

    useEffect(() => {
        if (isOpen) {
            // to render frame with display block before showing with opacity 1
            timerRef.current = setTimeout(() => {
                setIsShown(true)
            }, 0)
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true)
            window.addEventListener('keydown', onPressKey)
        }
        return () => {
            clearTimeout(timerRef.current)
            window.removeEventListener('keydown', onPressKey)
        }
    }, [isOpen, onPressKey])

    return {
        isShown,
        handleSubmit,
        handleClose,
        isMounted
    }
}
