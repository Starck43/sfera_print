export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
    return new Date(date).toLocaleDateString(
        'ru-RU',
        options || {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        }
    )
}
