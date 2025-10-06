import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const path = searchParams.get('path') || '/'

    // Check for secret to confirm this is a valid request
    if (secret !== process.env.SECRET_TOKEN) {
        return NextResponse.json(
            { message: 'Invalid token' },
            { status: 401 }
        )
    }

    try {
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
                    revalidatePath(p)
                })
            )
        } else {
            revalidatePath(path)
        }

        const html = `
            <h1>Success!</h1>
            <div>Content revalidated</div>
            <a href="/" onclick="window.history.back(); return false;">Go back</a>
        `
        
        return new Response(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        })
    } catch (err) {
        console.error('Revalidation error:', err)
        const html = `
            <h1>Error occurred!</h1>
            <div>Content not revalidated</div>
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
