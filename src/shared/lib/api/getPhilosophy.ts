// import 'server-only'

async function getPhilosophy<T>(): Promise<T> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/philosophy/`)
    if (!res.ok) {
        console.error(res.statusText, `(${res.status})`)
        throw new Error('Failed to fetch data from server\n' + res.url)
    }
    return await res.json()
}

export default getPhilosophy
