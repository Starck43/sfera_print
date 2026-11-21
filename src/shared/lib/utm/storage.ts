'use client'

import { hasMetrikaConsent } from '@/shared/lib/metrika'

import {
    getTrackingFromUrl,
    isSameTrackingParams,
    mergeTrackingParams,
    TRACKING_KEYS,
    TRACKING_STORAGE_DAYS,
    type TrackingParams
} from './params'

/**
 * Хранение параметров рекламного перехода в двух полосах.
 *
 * 1. `sessionStorage` — всегда, согласие не требуется. Живёт до закрытия
 *    вкладки и покрывает заявки, оставленные в тот же визит, что и переход
 *    по объявлению: к моменту отправки формы параметров в адресе уже нет.
 * 2. `localStorage` на 90 дней — только после согласия на cookie, по тому же
 *    событию, по которому запрашивается ClientID Метрики. Нужна тем, кто
 *    пришёл по объявлению, подумал и вернулся через несколько дней.
 *
 * Два правила на обе полосы: пустым значением сохранённое не перезаписывается
 * (прямой заход не стирает рекламный визит), непустым — перезаписывается
 * (заявку привёл последний клик, а не первый).
 */

/** Ключ хранения — одинаковый в обеих полосах */
const STORAGE_KEY = 'asfp_tracking'

/** Запись долгой полосы: значения и срок годности */
interface DurableRecord {
    values: TrackingParams
    expiresAt: number
}

const isBrowser = (): boolean => typeof window !== 'undefined'

/**
 * Оставить в объекте только известные непустые строки: в хранилище могло
 * попасть что угодно — старая версия данных или ручная правка.
 */
const sanitize = (value: unknown): TrackingParams => {
    if (!value || typeof value !== 'object') return {}

    const source = value as Record<string, unknown>
    const result: TrackingParams = {}

    TRACKING_KEYS.forEach((key) => {
        const item = source[key]
        if (typeof item === 'string' && item) result[key] = item
    })

    return result
}

/**
 * Прочитать полосу. Обращения к хранилищу обёрнуты: в приватном режиме
 * и при запрете в настройках браузера они бросают исключение.
 */
const readSession = (): TrackingParams => {
    if (!isBrowser()) return {}

    try {
        return sanitize(JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? 'null'))
    } catch {
        // Хранилище недоступно — работаем без этой полосы
        return {}
    }
}

const readDurable = (): TrackingParams => {
    if (!isBrowser()) return {}

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (!stored) return {}

        const record: DurableRecord = JSON.parse(stored)
        if (typeof record?.expiresAt !== 'number' || record.expiresAt <= Date.now()) {
            window.localStorage.removeItem(STORAGE_KEY)
            return {}
        }

        return sanitize(record.values)
    } catch {
        // Хранилище недоступно или запись повреждена — работаем без этой полосы
        return {}
    }
}

const writeSession = (values: TrackingParams): void => {
    try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values))
    } catch {
        // Хранилище недоступно — значения останутся только в памяти страницы
    }
}

const writeDurable = (values: TrackingParams): void => {
    const record: DurableRecord = {
        values,
        expiresAt: Date.now() + TRACKING_STORAGE_DAYS * 24 * 60 * 60 * 1000
    }

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
    } catch {
        // Хранилище недоступно — долгая полоса просто не заведётся
    }
}

/**
 * Перенести запомненные значения в долгую полосу (90 дней).
 *
 * Вызывается после согласия на cookie — там же, где запрашивается ClientID,
 * — и при каждом рекламном переходе, если согласие уже получено. Запись
 * перезаписывается целиком, поэтому срок годности отсчитывается от последнего
 * клика: повторный переход по тому же объявлению продлевает хранение.
 */
export function persistTrackingParams(): void {
    if (!isBrowser() || !hasMetrikaConsent()) return

    const values = mergeTrackingParams(readDurable(), readSession())

    if (!Object.keys(values).length) return
    writeDurable(values)
}

/**
 * Запомнить параметры перехода из адреса текущей страницы.
 *
 * Вызывается при каждом входе на сайт и переходе между страницами: человек
 * может прийти по объявлению на /technologies/, а форму отправить уже
 * с /contacts/, где параметров в адресе нет.
 */
export function captureTrackingParams(): void {
    if (!isBrowser()) return

    const fromUrl = getTrackingFromUrl(window.location.href)
    if (!Object.keys(fromUrl).length) return

    const stored = readSession()
    const session = mergeTrackingParams(stored, fromUrl)
    if (!isSameTrackingParams(stored, session)) writeSession(session)

    // Согласие могло быть дано раньше — тогда сразу дублируем в долгую полосу
    if (hasMetrikaConsent()) persistTrackingParams()
}

/**
 * Параметры перехода для подстановки в CRM-форму.
 *
 * Свежий клик (sessionStorage) перекрывает долгую полосу, поэтому в заявку
 * попадает последний клик, а не первый.
 */
export function getTrackingParams(): TrackingParams {
    if (!isBrowser()) return {}

    // К моменту чтения параметры могли появиться в адресе — например,
    // при переходе по ссылке без перезагрузки страницы
    captureTrackingParams()

    return mergeTrackingParams(readDurable(), readSession())
}
