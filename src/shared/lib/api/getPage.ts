// import 'server-only'

async function getPage<T>(slug: string | null = null): Promise<T> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER}/api/page/` + (slug ? slug + '/' : ''),
        {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        }
    )
    if (!res.ok) {
        console.error(res.statusText, `(${res.status})`)
        throw new Error('Failed to fetch data from server\n' + res.url)
    }
    return await res.json()
}

export default getPage
