import { useEffect, useRef, useState } from 'react'

import { OVERLAY_Z_INDEX } from '@/shared/const/page'
import { addEscapeLayer } from '@/shared/lib/helpers/escape'

/**
 * Escape закрывает открытую страницу так же, как стрелка «назад» в её шапке.
 * Слой страницы лежит выше меню, поэтому первым Escape забирает страница,
 * и меню под ней остаётся открытым.
 */
export const useEscapeToClose = (onClose: () => void, isActive?: () => boolean) => {
    const [id] = useState(() => Symbol('page'))
    const onCloseRef = useRef(onClose)
    const isActiveRef = useRef(isActive)

    useEffect(() => {
        onCloseRef.current = onClose
        isActiveRef.current = isActive
    })

    useEffect(
        () =>
            addEscapeLayer(
                id,
                OVERLAY_Z_INDEX + 2,
                () => onCloseRef.current(),
                () => isActiveRef.current?.() ?? true
            ),
        [id]
    )
}
