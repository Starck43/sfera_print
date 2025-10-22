'use client'

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

import { useAnimationModules } from '@/shared/lib/providers/AnimationProvider'
import { classnames } from '@/shared/lib/helpers/classnames'

import { Col, Row } from '@/shared/ui/stack'
import { Portal } from '@/shared/ui/portal'
import { ROOT_ID } from '@/shared/const/page'

import type { DrawerProps } from '../types'
import { CloseButton } from '../../button'

import styles from '../styles/Modals.module.sass'
import cls from './Drawer.module.sass'

const DrawerContent = (props: DrawerProps) => {
    const {
        open,
        onClose,
        contentWidth,
        contentHeight,
        header = null,
        footer = null,
        closeOnOverlayClick = false,
        animationTime = 300,
        showClose = true,
        position = 'bottom',
        rounded = false,
        bordered = false,
        'aria-label': ariaLabel = 'Drawer',
        className,
        children
    } = props

    const width =
        typeof contentWidth === 'string' && contentWidth.endsWith('%')
            ? (window.innerWidth / 100) * parseFloat(contentWidth)
            : Number(contentWidth) || window.innerWidth

    const height =
        typeof contentHeight === 'string' && contentHeight.endsWith('%')
            ? (window.innerHeight / 100) * parseFloat(contentHeight)
            : Number(contentHeight) || window.innerHeight

    const drawerRef = useRef<HTMLDivElement>(null)
    const lastFocusedElement = useRef<HTMLElement | null>(null)
    const { Spring, Gesture } = useAnimationModules()
    const [{ x, y }, api] = Spring.useSpring(() => ({
        native: true,
        x: position === 'left' ? -width : width,
        y: position === 'top' ? -height : height
    }))

    const openDrawer = useCallback(() => {
        // Сохраняем элемент, который был в фокусе до открытия
        lastFocusedElement.current = document.activeElement as HTMLElement

        api.start({
            x: 0,
            y: 0,
            immediate: false
        })
        // Фокус на контейнер дровера для доступности
        setTimeout(() => {
            drawerRef.current?.focus()
        }, 100)
    }, [api])

    const closeDrawer = useCallback(
        (event?: KeyboardEvent) => {
            if (event && event.key === 'Escape') {
                event.preventDefault()
            }

            api.start({
                x: position === 'left' ? -width : width,
                y: position === 'top' ? -height : height,
                immediate: false,
                onStart:
                    footer instanceof Object && footer.props?.onClick
                        ? () => footer.props?.onClick()
                        : undefined,
                onResolve: () => {
                    // Возвращаем фокус на предыдущий элемент
                    lastFocusedElement.current?.focus()
                    lastFocusedElement.current = null

                    // Вызываем колбэк закрытия
                    onClose?.()
                }
            })
        },
        [api, position, width, height, footer, onClose]
    )

    const onDrawerClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation()
            if ((e.target as HTMLElement).tagName === 'A') {
                closeDrawer()
            } else if (closeOnOverlayClick && e.target === e.currentTarget) {
                closeDrawer()
            }
        },
        [closeOnOverlayClick, closeDrawer]
    )

    useLayoutEffect(() => {
        if (open) {
            openDrawer()
        } else {
            closeDrawer()
        }
    }, [open, openDrawer, closeDrawer])

    // Обработка нажатия Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeDrawer(e)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [closeDrawer])

    const bind = Gesture.useDrag(
        ({ last, velocity: [vx, vy], direction: [dx, dy], movement: [mx, my], cancel }) => {
            if (position === 'top' || position === 'bottom') {
                if (my < -10) cancel()

                // Обработка завершения жеста
                if (last) {
                    // Проверка: если провели достаточно вверх или скорость высокая, закрываем
                    if (
                        vy > 0.2 &&
                        ((position === 'top' && dy < 0) || (position === 'bottom' && dy > 0))
                    ) {
                        closeDrawer()
                    } else {
                        // Иначе возвращаем в исходное положение
                        openDrawer()
                    }
                } else {
                    // Обновляем положение окна при свайпе по вертикали в другом направлении
                    // api.start({ y: my, immediate: false })
                }
            } else {
                if (mx < -20) cancel()

                if (last) {
                    if (
                        vx > 0.3 &&
                        ((position === 'right' && dx > 0) || (position === 'left' && dx < 0))
                    ) {
                        closeDrawer()
                    } else {
                        openDrawer()
                    }
                } else {
                    api.start({ x: mx, immediate: false })
                }
            }
        },
        {
            from: () => [x.get(), y.get()],
            duration: animationTime,
            filterTaps: true,
            bounds: { top: 0, left: 0 },
            rubberband: true
        }
    )

    if (!width || !height) return null

    let drawerStyle
    let contentStyle

    if (position === 'top' || position === 'bottom') {
        const opacity =
            position === 'top'
                ? y.to([-height, 0], [0, 0.3], 'clamp')
                : y.to([0, height], [0.3, 0], 'clamp')
        drawerStyle = {
            display: y.to((py) => (py < height ? 'flex' : 'none')),
            '--bg-opacity': opacity
        }
        contentStyle = { y }
    } else {
        const opacity =
            position === 'left'
                ? x.to([-width, 0], [0, 0.3], 'clamp')
                : x.to([0, width], [0.3, 0], 'clamp')
        drawerStyle = {
            display: x.to((px) => (px < width ? 'flex' : 'none')),
            '--bg-opacity': opacity
        }
        contentStyle = { x }
    }

    return (
        <Portal target={document.getElementById(ROOT_ID) || document.body}>
            <Spring.animated.div
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                aria-hidden={false}
                {...bind()}
                className={cls.drawer}
                style={drawerStyle as any}
                tabIndex={-1}
                onClick={onDrawerClick}
            >
                <Spring.animated.div
                    role="link"
                    className={classnames(
                        cls,
                        ['drawer__content', position],
                        {
                            rounded,
                            bordered
                        },
                        [className]
                    )}
                    style={{ ...contentStyle, width: contentWidth, height: contentHeight }}
                >
                    {header ||
                        (showClose && (
                            <Row
                                as="span"
                                gap="none"
                                fullWidth={false}
                                justify="end"
                                align="center"
                                className="absolute -left-2 top-4 -translate-x-full text-white"
                            >
                                {header}
                                {showClose && <CloseButton handleClick={closeDrawer} />}
                            </Row>
                        ))}

                    <Col className={cls.body}>{children}</Col>

                    {footer && (
                        <div className={classnames(cls, ['footer'], {}, [styles.footer])}>
                            {footer}
                        </div>
                    )}
                </Spring.animated.div>
            </Spring.animated.div>
        </Portal>
    )
}

const DrawerAsync = (props: DrawerProps) => {
    const { isLoaded } = useAnimationModules()
    return isLoaded ? <DrawerContent {...props} /> : null
}

export const Drawer = (props: DrawerProps) => {
    return <DrawerAsync {...props} />
}
