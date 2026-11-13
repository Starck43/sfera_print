import {
    ORG_ALTERNATE_NAME,
    ORG_CITY,
    ORG_COUNTRY,
    ORG_EMAIL,
    ORG_FOUNDING_DATE,
    ORG_LEGAL_NAME,
    ORG_PHONE,
    ORG_STREET,
    OG_IMAGE,
    OG_IMAGE_ALT
} from '@/shared/const/seo'
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/shared/const/page'

export const getSiteUrl = (): string => (process.env.URL || SITE_URL).replace(/\/+$/, '')

/**
 * Абсолютный адрес страницы с завершающим слэшем.
 * Слэш обязателен: в next.config.mjs включён trailingSlash, а canonical и sitemap
 * должны указывать на один и тот же вариант адреса.
 */
export const buildUrl = (path?: string | null): string => {
    const base = getSiteUrl()

    if (!path) return `${base}/`

    const clean = `/${path}`.replace(/\/{2,}/g, '/').replace(/\/+$/, '')

    return `${base}${clean}/`
}

export const stripHtml = (html?: string | null): string => {
    if (!html) return ''

    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
}

export const truncate = (text: string, max: number = 160): string => {
    if (!text) return ''
    if (text.length <= max) return text

    const cut = text.slice(0, max - 1).trim()
    const lastSpace = cut.lastIndexOf(' ')

    return `${(lastSpace > max / 3 ? cut.slice(0, lastSpace) : cut).trim()}…`
}

/**
 * Собирает описание страницы из нескольких частей и приводит его к рекомендуемой длине.
 */
export const buildDescription = (
    parts: (string | null | undefined)[],
    max: number = 160
): string => {
    const text = parts
        .filter((part): part is string => Boolean(part && part.trim()))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()

    return truncate(text, max)
}

export const resolveImageSrc = (source: unknown): string | undefined => {
    if (!source) return undefined
    if (typeof source === 'string') return source
    if (typeof source === 'object' && 'src' in source) {
        const { src } = source as { src?: string }
        return src || undefined
    }

    return undefined
}

export const getDefaultOgImage = (): string => `${getSiteUrl()}${OG_IMAGE}`

const organizationId = () => `${getSiteUrl()}/#organization`

export const organizationJsonLd = () => ({
    '@type': 'Organization',
    '@id': organizationId(),
    name: SITE_TITLE,
    legalName: ORG_LEGAL_NAME,
    alternateName: ORG_ALTERNATE_NAME,
    url: `${getSiteUrl()}/`,
    logo: getDefaultOgImage(),
    foundingDate: ORG_FOUNDING_DATE,
    description: SITE_DESCRIPTION,
    email: ORG_EMAIL,
    telephone: ORG_PHONE,
    address: {
        '@type': 'PostalAddress',
        streetAddress: ORG_STREET,
        addressLocality: ORG_CITY,
        addressCountry: ORG_COUNTRY
    },
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: ORG_PHONE,
        email: ORG_EMAIL,
        availableLanguage: ['ru']
    }
})

export const localBusinessJsonLd = () => ({
    '@type': 'LocalBusiness',
    '@id': `${getSiteUrl()}/#localbusiness`,
    name: SITE_TITLE,
    url: `${getSiteUrl()}/`,
    image: getDefaultOgImage(),
    telephone: ORG_PHONE,
    email: ORG_EMAIL,
    address: {
        '@type': 'PostalAddress',
        streetAddress: ORG_STREET,
        addressLocality: ORG_CITY,
        addressCountry: ORG_COUNTRY
    },
    parentOrganization: { '@id': organizationId() }
})

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: buildUrl(item.path)
    }))
})

interface ArticleJsonLdProps {
    url: string
    title: string
    description: string
    image?: string
    publishedTime?: string
}

export const blogPostingJsonLd = ({
    url,
    title,
    description,
    image,
    publishedTime
}: ArticleJsonLdProps) => ({
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: title,
    description,
    image: [image || getDefaultOgImage()],
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: { '@type': 'Organization', '@id': organizationId() },
    publisher: { '@type': 'Organization', '@id': organizationId() },
    inLanguage: 'ru'
})

export const articleJsonLd = ({
    url,
    title,
    description,
    image,
    publishedTime
}: ArticleJsonLdProps) => ({
    '@type': 'Article',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: title,
    description,
    image: [image || getDefaultOgImage()],
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: { '@type': 'Organization', '@id': organizationId() },
    publisher: { '@type': 'Organization', '@id': organizationId() },
    inLanguage: 'ru'
})

interface ServiceJsonLdProps {
    url: string
    name: string
    description: string
    image?: string
}

export const serviceJsonLd = ({ url, name, description, image }: ServiceJsonLdProps) => ({
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    description,
    serviceType: name,
    url,
    image: image || getDefaultOgImage(),
    provider: { '@type': 'Organization', '@id': organizationId() },
    areaServed: { '@type': 'Country', name: 'Россия' },
    inLanguage: 'ru'
})

export const jsonLdGraph = (nodes: Record<string, unknown>[]) => ({
    '@context': 'https://schema.org',
    '@graph': nodes
})

export { OG_IMAGE, OG_IMAGE_ALT }
