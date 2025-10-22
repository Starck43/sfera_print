'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

import { type Contact } from '@/components/contacts/types'
import { Loader } from '@/shared/ui/loader'

export default function BitrixForm({ fallbackContact }: { fallbackContact?: Contact }) {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const src = process.env.NEXT_PUBLIC_BITRIX_FORM_SRC
    const data = process.env.NEXT_PUBLIC_BITRIX_FORM_DATA

    useEffect(() => {
        if (!src || !data) return

        // Function to move the form back to our container
        const moveFormBack = () => {
            const form = document.querySelector('.b24-form')
            const container = containerRef.current

            if (form && container && form.parentNode !== container) {
                container.appendChild(form)
                return true
            }
            return false
        }

        // Try to move the form immediately if it is already there
        if (moveFormBack()) {
            setIsLoading(false)
            return
        }

        // Set up a mutation observer to watch for the form being added to the DOM
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    if (moveFormBack()) {
                        observer.disconnect()
                        setIsLoading(false)
                        break
                    }
                }
            }
        })

        // Start observing the document with the configured parameters
        observer.observe(document.body, { childList: true, subtree: true })

        // Set a timeout to stop observing after 10 seconds
        const timeout = setTimeout(() => {
            observer.disconnect()
            if (isLoading) {
                console.warn('Timed out waiting for Bitrix form to load')
                setIsLoading(false)
            }
        }, 10000)

        return () => {
            observer.disconnect()
            clearTimeout(timeout)
        }
    }, [src, data, isLoading])

    if (!src || !data) {
        return (
            <div className="bitrix-form-error">
                <p>Отсутствует конфигурация формы Bitrix</p>
                {fallbackContact && (
                    <p>
                        Пожалуйста, свяжитесь с нами напрямую по электронной почте{' '}
                        <a href={fallbackContact.link}>{fallbackContact.value}</a>
                    </p>
                )}
            </div>
        )
    }

    return (
        <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
            <Script
                id="bitrix24-form-script"
                src={`${src}?${(Date.now() / 180000) | 0}`}
                strategy="lazyOnload"
                data-b24-form={data}
                data-skip-moving="true"
                onError={() => {
                    console.error('Failed to load Bitrix form script')
                    setError(
                        'Ошибка загрузки формы. Пожалуйста, свяжитесь с нами напрямую по электронной почте'
                    )
                    setIsLoading(false)
                }}
            />

            {isLoading && <Loader />}

            {error && fallbackContact && (
                <div className="bitrix-form-error">
                    <h4>
                        {error}
                        {': '}
                    </h4>
                    <a href={fallbackContact.link}>{fallbackContact.value}</a>
                </div>
            )}

            <div id="bx24_form_inline">
                {/* The form will be injected here by Bitrix */}
            </div>
        </div>
    )
}
