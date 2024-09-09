'use client'

import React, { memo, useEffect, useState } from 'react'

import { classnames } from '@/shared/lib/helpers/classnames'

import cls from './Loader.module.sass'

interface LoaderProps {
    className?: string
    duration?: number
}

const Loader = ({ className, duration }: LoaderProps) => {
    const [isOpening, setIsOpening] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setIsOpening(true)
        const timerId = setTimeout(() => {
            setIsOpen(true)
            setIsOpening(false)
        }, duration || 300)

        return () => clearTimeout(timerId) // Clear the timeout when the component unmounts
    }, [duration])

    return (
        <div className={cls.loader__container}>
            <div
                className={classnames(cls, ['spinner'], { isOpening, isOpen }, [
                    className
                ])}
            >
                {new Array(5).fill(0).map((_, index) => (
                    <div key={index} />
                ))}
            </div>
        </div>
    )
}

export default memo(Loader)
