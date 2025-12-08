import { useCallback, useLayoutEffect, useState } from 'react'
import { normalizeUrlPath } from '@/shared/lib/helpers/url'

type UrlParams = string[][] | Record<string, string> | string | URLSearchParams | null

export const useFetch = <T>(
    endpoint: string | null,
    params?: UrlParams,
    cache = true,
    deps: any[] = []
): {
    data: T | undefined
    isError: boolean
    revalidate: () => void
} => {
    const [data, setData] = useState<T>()
    const [error, setError] = useState(false)

    // function to fetch data
    const fetchFn = useCallback(async () => {
        if (!endpoint) return
        let finalUrl = endpoint

        if (!endpoint.startsWith('http')) {
            const url = `${process.env.API_SERVER || process.env.NEXT_PUBLIC_API_SERVER}/api/${endpoint}/`
            finalUrl = normalizeUrlPath(
                params ? `${url}?${new URLSearchParams(params).toString()}` : url
            )
        }

        try {
            const response = await fetch(finalUrl, {
                cache: cache ? 'force-cache' : 'no-store'
            })
            setData(await response.json())
            // console.info(finalUrl)
        } catch (error) {
            console.error('Error fetching data:', error)
            setError(true)
        }
    }, [endpoint, params, cache])

    useLayoutEffect(() => {
        if (deps.length && deps.every((val) => !val && typeof val !== 'number')) return
        fetchFn()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return {
        data,
        isError: error,
        revalidate: fetchFn
    }
}
