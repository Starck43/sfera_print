import { NextResponse } from 'next/server'

/**
 * Health check endpoint для систем мониторинга.
 * Возвращает статус 200 OK, если приложение работает.
 */
export async function GET() {
    return NextResponse.json(
        {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        },
        { status: 200 }
    )
}
