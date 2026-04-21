import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const path = searchParams.get('path')
    const tag = searchParams.get('tag')
    const type = searchParams.get('type') || 'page'

    // Check for secret to confirm this is a valid request
    if (secret !== process.env.SECRET_TOKEN) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    // Определяем тип ревалидации (по умолчанию 'page')
    const revalidateType = type === 'layout' ? 'layout' : type === 'page' ? 'page' : undefined

    try {
        if (tag) {
            // Revalidate by tag with 'max' option for Next.js 16+
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
                '/policies',
                '/features',
                '/philosophy',
                '/technologies'
            ]

            // Используем for...of для последовательного выполнения
            for (const p of paths) {
                const slug = p === '/' ? '' : p.slice(1)
                revalidateTag(slug, 'max')
                revalidatePath(p, revalidateType)
            }

            console.log('[Revalidate] All paths revalidated')

            const html = `
                <h1>Success!</h1>
                <div>All paths revalidated</div>
                <a href="/" onclick="window.history.back(); return false;">Go back</a>
            `

            return new Response(html, {
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-store, no-cache, must-revalidate'
                }
            })
        }

        if (path) {
            revalidatePath(path, revalidateType)

            // Extract and revalidate the specific endpoint tag
            const pathParts = path.split('/').filter(Boolean)
            if (pathParts.length === 1) {
                const extractedTag = pathParts[0]
                revalidateTag(extractedTag, 'max')
                console.log(`[Revalidate] Path: ${path}, Tag: ${extractedTag}`)
            }

            const html = `
                <h1>Success!</h1>
                <div>Content revalidated for path: ${path} (type: ${revalidateType})</div>
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
        }

        // Если нет ни path, ни tag, возвращаем ошибку
        return NextResponse.json(
            { message: 'Either path or tag parameter is required' },
            { status: 400 }
        )
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
