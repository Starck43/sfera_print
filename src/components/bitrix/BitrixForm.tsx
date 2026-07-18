'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

import { type Contact } from '@/components/contacts/types'
import { Loader } from '@/shared/ui/loader'
import { getUtmFromCookies, type UtmParams } from '@/shared/lib/utm'

// Временная метка для обновления скрипта формы
const BITRIX_TIMESTAMP = Math.floor(Date.now() / 180000)

// Константы для UTM полей формы Bitrix
const UTM_FIELD_MAP = {
    utm_source: 'UTM_SOURCE',
    utm_medium: 'UTM_MEDIUM',
    utm_campaign: 'UTM_CAMPAIGN',
    utm_content: 'UTM_CONTENT',
    utm_term: 'UTM_TERM'
} as const

export default function BitrixForm({ fallbackContact }: { fallbackContact?: Contact }) {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFormReady, setIsFormReady] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const src = process.env.NEXT_PUBLIC_BITRIX_FORM_SRC
    const data = process.env.NEXT_PUBLIC_BITRIX_FORM_DATA

    // Проверяем наличие конфигурации
    if (!src || !data) {
        console.error('Bitrix: Отсутствует конфигурация формы')
    }

    /**
     * Заполняет UTM-поля в форме Bitrix
     */
    const fillUtmFields = () => {
        // Получаем UTM из cookies
        const utmParams = getUtmFromCookies()

        // Проверяем, есть ли хоть какие-то UTM
        const hasAnyUtm = Object.values(utmParams).some((value) => value)
        if (!hasAnyUtm) {
            console.warn('Bitrix: UTM-метки не найдены')
            return
        }

        console.log('Bitrix: Заполнение UTM-полей:', utmParams)

        // Ищем форму Bitrix в DOM
        const form = document.querySelector('.b24-form') as HTMLFormElement
        if (!form) {
            console.warn('Bitrix: Форма не найдена в DOM')
            return
        }

        // Ищем скрытые поля или создаем их
        Object.entries(UTM_FIELD_MAP).forEach(([utmKey, fieldName]) => {
            const value = utmParams[utmKey as keyof UtmParams]
            if (!value) return

            // Ищем существующее поле
            let input = form.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement

            // Если поле не найдено, создаем его
            if (!input) {
                input = document.createElement('input')
                input.type = 'hidden'
                input.name = fieldName
                form.appendChild(input)
            }

            input.value = value
        })

        // Дополнительно: пытаемся найти и заполнить поля через iframe, если есть
        const iframe = document.querySelector('.b24-form-iframe') as HTMLIFrameElement
        if (iframe && iframe.contentWindow) {
            try {
                // Отправляем сообщение в iframe с UTM данными
                iframe.contentWindow.postMessage(
                    {
                        type: 'FILL_UTM_FIELDS',
                        data: utmParams
                    },
                    '*'
                )
            } catch (e) {
                // Игнорируем ошибки
            }
        }
    }

    /**
     * Перемещает форму обратно в наш контейнер
     */
    const moveFormBack = (): boolean => {
        const form = document.querySelector('.b24-form')
        const container = containerRef.current

        if (form && container && form.parentNode !== container) {
            container.appendChild(form)

            // После перемещения формы заполняем UTM
            setTimeout(fillUtmFields, 100)
            return true
        }
        return false
    }

    /**
     * Перехватывает отправку формы для добавления UTM
     */
    const interceptFormSubmit = () => {
        const form = document.querySelector('.b24-form') as HTMLFormElement
        if (!form) return

        // Проверяем, существует ли метод submit
        if (typeof form.submit !== 'function') {
            console.warn('Bitrix: form.submit не является функцией')
            return
        }

        // Сохраняем оригинальный метод отправки
        const originalSubmit = form.submit.bind(form)

        // Переопределяем метод submit
        form.submit = function () {
            // Заполняем UTM перед отправкой
            fillUtmFields()
            // Вызываем оригинальный метод
            return originalSubmit()
        }

        // Также перехватываем событие submit
        form.addEventListener('submit', () => {
            fillUtmFields()
        })
    }

    // Эффект для отслеживания появления формы
    useEffect(() => {
        if (!src || !data) return

        // Флаг для предотвращения повторных вызовов
        let isMounted = true

        // Пытаемся переместить форму сразу, если она уже есть
        if (moveFormBack()) {
            setIsLoading(false)
            setIsFormReady(true)
            interceptFormSubmit()
            return
        }

        // Настраиваем MutationObserver для отслеживания появления формы
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    if (moveFormBack()) {
                        observer.disconnect()
                        if (isMounted) {
                            setIsLoading(false)
                            setIsFormReady(true)
                            interceptFormSubmit()
                        }
                        break
                    }
                }
            }
        })

        // Начинаем наблюдение за document.body
        observer.observe(document.body, {
            childList: true,
            subtree: true
        })

        // Таймаут для остановки ожидания
        const timeout = setTimeout(() => {
            observer.disconnect()
            if (isMounted && isLoading) {
                console.warn('Bitrix: Истекло время ожидания загрузки формы')
                setIsLoading(false)
                // Пробуем заполнить UTM, если форма все же появилась
                setTimeout(fillUtmFields, 500)
            }
        }, 10000)

        // Обработчик сообщений от iframe
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'FORM_READY') {
                if (isMounted) {
                    setIsLoading(false)
                    setIsFormReady(true)
                    fillUtmFields()
                }
            }
        }

        window.addEventListener('message', handleMessage)

        return () => {
            isMounted = false
            observer.disconnect()
            clearTimeout(timeout)
            window.removeEventListener('message', handleMessage)
        }
    }, [src, data]) // eslint-disable-line react-hooks/exhaustive-deps

    // Дополнительный эффект для попытки заполнения UTM при изменении формы
    useEffect(() => {
        if (isFormReady) {
            // Периодически проверяем, не появились ли новые поля
            const interval = setInterval(() => {
                fillUtmFields()
            }, 2000)

            // Останавливаем проверку через 10 секунд
            const timeout = setTimeout(() => {
                clearInterval(interval)
            }, 10000)

            return () => {
                clearInterval(interval)
                clearTimeout(timeout)
            }
        }
    }, [isFormReady])

    // Если нет конфигурации, показываем ошибку
    if (!src || !data) {
        return (
            <div className="bitrix-form-error" style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ color: 'var(--grey-color)' }}>Отсутствует конфигурация формы Bitrix</p>
                {fallbackContact && (
                    <p>
                        Пожалуйста, свяжитесь с нами напрямую по электронной почте{' '}
                        <a href={fallbackContact.link} style={{ color: 'var(--link-color)' }}>
                            {fallbackContact.value}
                        </a>
                    </p>
                )}
            </div>
        )
    }

    return (
        <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
            {/* Скрипт загрузки формы Bitrix */}
            <Script
                id="bitrix24-form-script"
                src={`${src}?${BITRIX_TIMESTAMP}`}
                strategy="lazyOnload"
                data-b24-form={data}
                data-skip-moving="true"
                onError={() => {
                    console.error('Bitrix: Ошибка загрузки скрипта формы')
                    setError(
                        'Ошибка загрузки формы. Пожалуйста, свяжитесь с нами напрямую по электронной почте'
                    )
                    setIsLoading(false)
                }}
                onLoad={() => {
                    console.log('Bitrix: Скрипт формы загружен')
                    // Пробуем заполнить UTM после загрузки
                    setTimeout(fillUtmFields, 1000)
                }}
            />

            {/* Индикатор загрузки */}
            {isLoading && <Loader />}

            {/* Сообщение об ошибке */}
            {error && fallbackContact && (
                <div className="bitrix-form-error" style={{ padding: '20px', textAlign: 'center' }}>
                    <h4 style={{ color: '#cc0000', marginBottom: '10px' }}>{error}</h4>
                    <a href={fallbackContact.link} style={{ color: 'var(--link-color)' }}>
                        {fallbackContact.value}
                    </a>
                </div>
            )}

            {/* Контейнер для формы */}
            <div id="bx24_form_inline" />
        </div>
    )
}
