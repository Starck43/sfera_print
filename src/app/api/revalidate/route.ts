import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const path = searchParams.get('path') || '/'
    const tag = searchParams.get('tag')

    // Check for secret to confirm this is a valid request
    if (secret !== process.env.SECRET_TOKEN) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    try {
        if (tag) {
            // Revalidate by tag (more reliable for dynamic routes)
            revalidateTag(tag, 'max')
            console.log(`[Revalidate] Tag revalidated: ${tag}`)
        }

        if (path === '/') {
            const paths = [
                '/',
                '/blog',
                '/cases',
                '/contacts',
                '/documents',
                '/features',
                '/philosophy',
                '/technologies'
            ]

            await Promise.all(
                paths.map(async (p) => {
                    const slug = p === '/' ? '' : p.slice(1) // 'blog', 'cases', и т.д.
                    revalidateTag(slug, 'max')
                    revalidatePath(p, 'page')
                })
            )

            console.log('[Revalidate] All paths revalidated')
        } else {
            revalidatePath(path, 'page')

            // Extract and revalidate the specific endpoint tag
            const pathParts = path.split('/').filter(Boolean)
            if (pathParts.length === 1) {
                const tag = pathParts[0]
                revalidateTag(tag, 'max')
                console.log(`[Revalidate] Path: ${path}, Tag: ${tag}`)
            }
        }

        const html = `
            <h1>Success!</h1>
            <div>Content revalidated for path: ${path}${tag ? ` and tag: ${tag}` : ''}</div>
            <a href="${path}" target="_blank">View page</a> | 
            <a href="/" onclick="window.history.back(); return false;">Go back</a>
        `

        return new Response(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-store, no-cache, must-revalidate'
            }
        })
    } catch (err) {
        console.error('Revalidation error:', err)
        const html = `
            <h1>Error occurred!</h1>
            <div>Content not revalidated: ${
                err instanceof Error ? err.message : 'Unknown error'
            }</div>
            <a href="/" onclick="window.history.back(); return false;">Go back</a>
        `
        return new Response(html, {
            status: 500,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        })
    }
}
