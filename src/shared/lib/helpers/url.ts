export function normalizeUrlPath(str: string): string {
    return str.replace(/([^:]\/)\/+/g, '$1').replace(/\?$/, '')
}

export function buildAbsoluteUrl(base: string, path: string): string {
    if (path.startsWith('http')) return path
    return new URL(path, base).toString()
}

export const getMediaUrl = (path: string): string => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) return path

    return path.replace(/^\/media\//, '/')
}
