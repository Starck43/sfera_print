//import 'server-only'

async function getContacts() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/contacts/`)
	if (!res.ok) {
		throw new Error('Failed to fetch data')
	}
	return await res.json()
}

export default getContacts