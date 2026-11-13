import React from 'react'

type JsonLdData = Record<string, unknown> | Record<string, unknown>[]

interface JsonLdProps {
    data: JsonLdData
}

/**
 * Server-компонент, который отдаёт разметку Schema.org в исходном HTML.
 * Значения экранируются, чтобы инъекция не смогла закрыть тег script.
 */
const JsonLd = ({ data }: JsonLdProps) => {
    const json = JSON.stringify(data).replace(/</g, '\\u003c')

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

export default JsonLd
