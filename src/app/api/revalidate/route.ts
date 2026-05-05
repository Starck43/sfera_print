import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const type = searchParams.get('type') || 'page'
    const path = searchParams.get('path')
    const tag = searchParams.get('tag')

    // Check for secret to confirm this is a valid request
    if (secret !== process.env.SECRET_TOKEN) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    // Определяем тип ревалидации (по умолчанию 'page')
    const revalidateType = type === 'layout' ? 'layout' : 'page'

    try {
        // Если передан tag - ревалидируем его
        if (tag) {
            revalidateTag(tag, 'max')
            console.log(`[Revalidate] Tag revalidated: ${tag}`)
        }

        // Обработка массовой ревалидации
        if (path === '/') {
            const paths = [
                '/',
                '/menu',
                '/blog',
                '/cases',
                '/contacts',
                '/documents',
                '/policies',
                '/features',
                '/philosophy',
                '/technologies'
            ]

            for (const p of paths) {
                const slug = p === '/' ? '' : p.slice(1)
                revalidateTag(slug, 'max')
                revalidatePath(p, revalidateType)
            }

            console.log('[Revalidate] All paths revalidated')
        }
        // Обработка конкретного пути
        else if (path) {
            revalidatePath(path, revalidateType)

            // Если путь - это один сегмент, ревалидируем его как тег
            const pathParts = path.split('/').filter(Boolean)
            if (pathParts.length === 1) {
                revalidateTag(pathParts[0], 'max')
                console.log(`[Revalidate] Path: ${path}, Tag: ${pathParts[0]}`)
            }
        }

        // Проверка: есть ли что ревалидировать
        if (!path && !tag) {
            return NextResponse.json(
                { message: 'Either path or tag parameter is required' },
                { status: 400 }
            )
        }

        const html = `
            <h1>Success!</h1>
            <div>${
                path === '/' ? 'All paths revalidated' : 'Path: ' + path || 'Tag: ' + tag
            } (type: ${revalidateType})</div>
            ${path && path !== '/' ? `<a href="${path}" target="_blank">View page</a> | ` : ''}
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
