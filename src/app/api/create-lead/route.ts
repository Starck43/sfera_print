import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const leadData = await request.json()

        // Получаем переменные окружения
        const B24_REST_ENDPOINT = process.env.BITRIX24_REST_ENDPOINT
        const B24_TOKEN = process.env.BITRIX24_TOKEN

        if (!B24_REST_ENDPOINT || !B24_TOKEN) {
            console.error('Bitrix24: Не заданы переменные окружения')
            return NextResponse.json(
                { success: false, error: 'Настройки Bitrix24 не заданы' },
                { status: 500 }
            )
        }

        // Формируем данные для отправки
        const payload = {
            auth: B24_TOKEN,
            fields: {
                ...leadData.fields,
                UTM_SOURCE: leadData.fields.UTM_SOURCE || '',
                UTM_MEDIUM: leadData.fields.UTM_MEDIUM || '',
                UTM_CAMPAIGN: leadData.fields.UTM_CAMPAIGN || '',
                UTM_CONTENT: leadData.fields.UTM_CONTENT || '',
                UTM_TERM: leadData.fields.UTM_TERM || ''
            }
        }

        // Вызов метода crm.lead.add через REST API
        const response = await fetch(`${B24_REST_ENDPOINT}/crm.lead.add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        const result = await response.json()

        if (!response.ok || !result.result) {
            console.error('Bitrix24 API error:', result)
            throw new Error(result.error_description || 'Ошибка при создании лида')
        }

        console.log('Bitrix24: Лид успешно создан, ID:', result.result)

        return NextResponse.json({ success: true, result: result.result }, { status: 200 })
    } catch (error: any) {
        console.error('Ошибка API create-lead:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Внутренняя ошибка сервера' },
            { status: 500 }
        )
    }
}

