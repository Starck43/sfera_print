import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { normalizeUrlPath } from '@/shared/lib/helpers/url'

type UrlParams = string[][] | Record<string, string> | string | URLSearchParams | null

interface FetchOptions<T = unknown> {
    params?: UrlParams
    cache?: boolean
    tags?: string[]
    deps?: any[]
    onSuccess?: (data: T) => void
}

const API_SERVER =
    process.env.API_SERVER || process.env.NEXT_PUBLIC_API_SERVER || 'https://sferaprint.istarck.ru'

/**
 * Приводит массив зависимостей к строке, чтобы его можно было использовать
 * в массиве зависимостей эффекта без eslint-отключений
 */
const serializeDeps = (deps: unknown[]): string =>
    deps
        .map((dep) => (typeof dep === 'object' && dep !== null ? JSON.stringify(dep) : String(dep)))
        .join('|')

export const useFetch = <T>(
    endpoint: string | null,
    options: FetchOptions<T> = {}
): {
    data: T | undefined
    isError: boolean
    revalidate: () => void
} => {
    const { params, cache = true, tags = [], deps = [], onSuccess } = options

    const [data, setData] = useState<T>()
    const [error, setError] = useState(false)

    // Колбэк храним в ref, чтобы его смена не перезапускала запрос
    const onSuccessRef = useRef(onSuccess)
    useEffect(() => {
        onSuccessRef.current = onSuccess
    }, [onSuccess])

    const paramsKey = params ? new URLSearchParams(params).toString() : ''
    const tagsKey = tags.join(',')
    const depsKey = serializeDeps(deps)

    // Запрос не выполняется, пока все зависимости пустые (например, id ещё не выбран)
    const shouldFetch = !(deps.length > 0 && deps.every((val) => !val && typeof val !== 'number'))

    const request = useMemo(() => {
        if (!endpoint) return null

        let finalUrl = endpoint

        if (!endpoint.startsWith('http')) {
            finalUrl = `${API_SERVER}/api/${endpoint}/`
        }

        finalUrl = normalizeUrlPath(paramsKey ? `${finalUrl}?${paramsKey}` : finalUrl)

        return {
            url: finalUrl,
            init: {
                cache: cache ? ('force-cache' as const) : ('no-store' as const),
                next: { tags: tagsKey ? tagsKey.split(',') : [] }
            },
            // Ключ зависимостей входит в объект запроса, чтобы повторный запрос
            // происходил даже при неизменном URL
            key: depsKey
        }
    }, [endpoint, paramsKey, cache, tagsKey, depsKey])

    const load = useCallback((url: string, init: RequestInit) => {
        fetch(url, init)
            .then((response) => response.json())
            .then((json: T) => {
                setData(json)
                onSuccessRef.current?.(json)
            })
            .catch((requestError) => {
                console.error('Error fetching data:', requestError)
                setError(true)
            })
    }, [])

    useLayoutEffect(() => {
        if (!request || !shouldFetch) return

        let cancelled = false

        // Обновление состояния выполняется внутри колбэков промиса:
        // так состояние не меняется синхронно в теле эффекта
        fetch(request.url, request.init)
            .then((response) => response.json())
            .then((json: T) => {
                if (cancelled) return
                setData(json)
                onSuccessRef.current?.(json)
            })
            .catch((requestError) => {
                console.error('Error fetching data:', requestError)
                if (!cancelled) setError(true)
            })

        return () => {
            cancelled = true
        }
    }, [request, shouldFetch])

    const revalidate = useCallback(() => {
        if (!request) return
        load(request.url, request.init)
    }, [load, request])

    return {
        data,
        isError: error,
        revalidate
    }
}
