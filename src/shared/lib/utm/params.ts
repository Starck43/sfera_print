/**
 * Параметры рекламного перехода.
 *
 * `yclid` и UTM-метки — признаки объявления, по которому человек пришёл
 * (номер клика и названия кампании), а не идентификатор посетителя: они
 * приходят в адресе страницы и в связке с именем и телефоном человека
 * не опознают. Согласие на cookie для них не требуется — в отличие от
 * ClientID Метрики.
 *
 * Имена ключей менять нельзя: под них в CRM-форме заведены скрытые поля,
 * и они же передаются в форму через `setProperty`.
 */
export const TRACKING_KEYS = [
    'yclid',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term'
] as const

export type TrackingKey = (typeof TRACKING_KEYS)[number]

/** Известные значения параметров: пустых строк здесь не бывает */
export type TrackingParams = Partial<Record<TrackingKey, string>>

/** Срок жизни долгой полосы хранения — 90 дней */
export const TRACKING_STORAGE_DAYS = 90

const empty = (): TrackingParams => ({})

/**
 * Прочитать параметры перехода из адреса страницы.
 *
 * Пустые значения отбрасываются: переход по закладке или прямой заход
 * не должен стирать то, что сохранено с рекламного визита.
 */
export function getTrackingFromUrl(url: string): TrackingParams {
    let params: URLSearchParams

    try {
        params = new URL(url, 'https://asfp.pro').searchParams
    } catch {
        return empty()
    }

    const result: TrackingParams = {}

    TRACKING_KEYS.forEach((key) => {
        const value = params.get(key)?.trim()
        if (value) result[key] = value
    })

    return result
}

/**
 * Наложить новые значения на сохранённые.
 *
 * Непустое значение перекрывает старое — заявку привёл последний клик,
 * а не первый. Пустое не трогает сохранённое.
 */
export function mergeTrackingParams(base: TrackingParams, patch: TrackingParams): TrackingParams {
    const result: TrackingParams = {}

    TRACKING_KEYS.forEach((key) => {
        const value = patch[key] ?? base[key]
        if (value) result[key] = value
    })

    return result
}

/**
 * Совпадают ли наборы значений — чтобы не писать в хранилище без изменений
 */
export function isSameTrackingParams(first: TrackingParams, second: TrackingParams): boolean {
    return TRACKING_KEYS.every((key) => first[key] === second[key])
}
