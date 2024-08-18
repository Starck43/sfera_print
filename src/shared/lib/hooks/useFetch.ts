import {useCallback, useEffect, useState} from "react"
import {normalizeUrlPath} from "@/shared/lib/helpers/url"
import {log} from "node:util";

export const useFetch = <T>(endpoint: string | null, cache = true, deps: any[] = []): {
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
		setError(false)
		try {
			const response = await fetch(url, {cache: cache ? 'force-cache' : 'no-store'})
			const data = await response.json()
			setData(data)
		} catch (error) {
			console.error('Error fetching data:', error)
			setError(true)
		}
	}, [endpoint, cache])

	useEffect(() => {
		fetchFn()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps)

	return {
		data,
		isError: error,
		revalidate: fetchFn,
	}
}