'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { captureTrackingParams } from '@/shared/lib/utm'

/**
 * Запоминает yclid и UTM-метки из адреса страницы при каждом входе на сайт
 * и переходе между страницами. К моменту отправки CRM-формы параметров
 * в адресе уже нет — их нужно было сохранить заранее.
 *
 * Ничего не рендерит.
 */
const TrackingParams = () => {
    const pathname = usePathname()
    const search = useSearchParams().toString()

    useEffect(() => {
        captureTrackingParams()
    }, [pathname, search])

    return null
}

export default TrackingParams
