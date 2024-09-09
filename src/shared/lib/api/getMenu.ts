//import 'server-only'

async function getMenu() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/menu/`)
    if (!res.ok) {
        console.log(res.statusText)
        //throw new Error('Failed to fetch data')
    }
    return await res.json()
}

export default getMenu
