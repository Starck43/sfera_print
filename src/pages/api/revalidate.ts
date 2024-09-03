import {NextApiRequest, NextApiResponse} from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Check for secret to confirm this is a valid request
	if (req.query.secret !== process.env.SECRET_TOKEN) {
		return res.status(401).json({message: 'Invalid token'})
	}

	const path = <string>req.query?.path || '/'

	try {
		if (path == '/') {
			const paths = ['/blog', '/cases', '/contacts', '/documents', '/features', '/philosophy', '/technologies']
			await Promise.any(paths.map(async (path) => {
				await res.revalidate(path)
			}))
		}

		// e.g. "?path=/blog/1"
		await res.revalidate(path, 'layout' as any)
		const html = `
			<h1>Success!</h1>
			<div>Content revalidated</div>
			<a href="/" onclick="window.history.back(); return false;">Go back</a>
		`
		res.setHeader('Content-Type', 'text/html; charset=utf-8')
		return res.status(200).send(html)

	} catch (err) {
		const html = `
			<h1>Error occurred!</h1>
			<div>Content not revalidated</div>
			<a href="/" onclick="window.history.back(); return false;">Go back</a>
		`
		return res.status(500).send(html)
	}
}
