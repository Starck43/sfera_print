import {useCallback, useEffect, useState} from "react"
import {normalizeUrlPath} from "@/shared/lib/helpers/url"

type UrlParams = { [key: string]: number | string }

export const useFetch = <T>(endpoint: string | null, params?: UrlParams, cache = true, deps: any[] = []): {
    data: T | undefined,
    isError: boolean,
    revalidate: () => void
} => {
    const [data, setData] = useState<T>()
    const [error, setError] = useState(false)

    // function to fetch data
    const fetchFn = useCallback(async () => {
        if (!endpoint) return

        const url = normalizeUrlPath(`${process.env.NEXT_PUBLIC_API_SERVER}/api/${endpoint}/`)
        const queryParams = params ? Object.keys(params).map(key => `${key}=${params[key]}`).join('&') : ''
        const finalUrl = queryParams ? `${url}?${queryParams}` : url

        setError(false)

        try {
            const response = await fetch(finalUrl, { cache: cache ? 'force-cache' : 'no-store' })
            const data = await response.json()
            setData(data)
        } catch (error) {
            console.error('Error fetching data:', error)
            setError(true)
        }
    }, [endpoint, params, cache])

    useEffect(() => {
        if (deps.length && deps.every(val => !!val)) return
        fetchFn()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return {
        data,
        isError: error,
        revalidate: fetchFn,
    }
}
