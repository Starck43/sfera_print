'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Script from 'next/script'

import { type Contact } from '@/components/contacts/types'
import { Loader } from '@/shared/ui/loader'
import { getUtmFromCookies, type UtmParams } from '@/shared/lib/utm'
import { getClientID, onClientID, reachGoal, YM_CLIENT_ID_PROPERTY } from '@/shared/lib/metrika'

// Временная метка для обновления скрипта формы
const BITRIX_TIMESTAMP = Math.floor(Date.now() / 180000)

/** Контроллер CRM-формы, доступный из события b24:form:init */
interface BitrixFormController {
    setProperty?: (key: string, value: string) => void
}

interface BitrixWindow extends Window {
    b24form?: {
        App?: {
            list?: () => BitrixFormController[]
        }
    }
}

/**
 * Контроллер формы из реестра виджета — резервный способ получить объект формы
 */
const findFormController = (): BitrixFormController | null => {
    const forms = (window as BitrixWindow).b24form?.App?.list?.()
    if (!Array.isArray(forms)) return null

    return forms.find((form) => typeof form?.setProperty === 'function') ?? null
}

// Ключи скрытых полей CRM-формы для UTM-меток
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
    const containerRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<BitrixFormController | null>(null)

    const src = process.env.NEXT_PUBLIC_BITRIX_FORM_SRC
    const data = process.env.NEXT_PUBLIC_BITRIX_FORM_DATA

    // Проверяем наличие конфигурации
    if (!src || !data) {
        console.error('Bitrix: Отсутствует конфигурация формы')
    }

    /**
     * Передаёт в CRM-форму скрытые поля: ClientID Метрики и UTM-метки.
     * Значения уходят в properties, поэтому в CRM-форме должны быть
     * соответствующие скрытые поля с шаблонами %ym_client_id%, %UTM_SOURCE% и т.д.
     */
    const applyProperties = useCallback((form?: BitrixFormController | null) => {
        const target = form ?? formRef.current
        const setProperty = target?.setProperty
        if (!setProperty) return

        const clientID = getClientID()
        if (clientID) {
            setProperty(YM_CLIENT_ID_PROPERTY, clientID)
        }

        const utmParams = getUtmFromCookies()
        Object.entries(UTM_FIELD_MAP).forEach(([utmKey, fieldName]) => {
            const value = utmParams[utmKey as keyof UtmParams]
            if (value) {
                setProperty(fieldName, value)
            }
        })
    }, [])

    /**
     * Перемещает форму в наш контейнер
     */
    const moveFormBack = useCallback((): boolean => {
        const form = document.querySelector('.b24-form')
        const container = containerRef.current

        if (form && container && form.parentNode !== container) {
            container.appendChild(form)
            return true
        }
        return false
    }, [])

    /**
     * События CRM-формы Bitrix24:
     * b24:form:init — объект формы, b24:form:send:success — успешная отправка
     */
    useEffect(() => {
        const handleInit = (event: Event) => {
            const detail = (event as CustomEvent<{ object?: BitrixFormController }>).detail
            const form = detail?.object
            if (!form?.setProperty) return

            formRef.current = form
            applyProperties(form)
        }

        const handleSuccess = () => {
            reachGoal('zayavka')
        }

        const handleError = (event: Event) => {
            console.warn(
                'Bitrix: Отправка формы завершилась ошибкой',
                (event as CustomEvent<{ data?: unknown }>).detail?.data
            )
        }

        window.addEventListener('b24:form:init', handleInit)
        window.addEventListener('b24:form:send:success', handleSuccess)
        window.addEventListener('b24:form:send:error', handleError)

        const unsubscribe = onClientID(() => applyProperties())

        return () => {
            window.removeEventListener('b24:form:init', handleInit)
            window.removeEventListener('b24:form:send:success', handleSuccess)
            window.removeEventListener('b24:form:send:error', handleError)
            unsubscribe()
        }
    }, [applyProperties])

    // Отслеживаем появление формы, загруженной скриптом Bitrix24
    useEffect(() => {
        if (!src || !data) return

        const observer = new MutationObserver(() => {
            if (!moveFormBack()) return

            observer.disconnect()
            setIsLoading(false)
            applyProperties(findFormController())
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })

        return () => observer.disconnect()
    }, [src, data, moveFormBack, applyProperties])

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
                    if (moveFormBack()) {
                        setIsLoading(false)
                        applyProperties(findFormController())
                    }
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
