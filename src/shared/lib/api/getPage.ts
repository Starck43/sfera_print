// import 'server-only'

async function getPage<T>(slug: string | null = null): Promise<T> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/page/` + (slug ? slug + '/' : ''))
	if (!res.ok) {
		throw new Error('Failed to fetch data')
	}
	return await res.json()
}

export default getPage