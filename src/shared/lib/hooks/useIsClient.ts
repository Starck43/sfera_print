'use client'

import { useSyncExternalStore } from 'react'

// Подписка не нужна: значение меняется только при переходе с сервера в браузер
const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

/**
 * Признак того, что компонент уже отрисован в браузере.
 * Нужен для клиентских библиотек, которые нельзя выполнять на сервере.
 */
export const useIsClient = (): boolean =>
    useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
