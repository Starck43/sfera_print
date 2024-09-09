export function normalizeUrlPath(str: string): string {
    return str.replace(/([^:]\/)\/+/g, '$1').replace(/\?$/, '')
}
