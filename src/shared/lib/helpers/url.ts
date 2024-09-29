export function normalizeUrlPath(str: string): string {
    return str.replace(/([^:]\/)\/+/g, '$1').replace(/\?$/, '')
}

export function buildAbsoluteUrl(base: string, path: string): string {
    if (path.startsWith('http')) return path
    return new URL(path, base).toString()
}
