'use client'

import { getCookieValue } from '@/shared/lib/helpers/cookie'
import { SITE_URL } from '@/shared/const/page'

/**
 * Модуль Яндекс.Метрики.
 *
 * Данные разделены на две независимые части:
 *
 * 1. Цели (`reachGoal`) — обезличенный факт действия на сайте
 *    (клик по телефону, отправка формы и т.п.). Согласие на cookie
 *    для них не требуется: счётчик и так работает независимо от баннера,
 *    а цель не содержит данных, позволяющих опознать посетителя.
 *
 * 2. ClientID (`requestClientID`, `resolveClientID`) — идентификатор
 *    посетителя, который связывает визит с человеком в следующий заход.
 *    Запрашивается и передаётся в CRM только после согласия на cookie.
 */

/**
 * Идентификаторы целей Яндекс.Метрики.
 * Значения нельзя менять — под них заведены цели в счётчике.
 */
export const METRIKA_GOALS = ['zayavka', 'phone', 'email', 'messenger'] as const

export type MetrikaGoal = (typeof METRIKA_GOALS)[number]

/** Счётчик Метрики asfp.pro */
export const METRIKA_ID = Number(process.env.NEXT_PUBLIC_YANDEX_ID) || 104401535

/** Cookie с решением по cookie-политике */
export const METRIKA_CONSENT_COOKIE = 'cookie_policy__asfp'

/** Ключ скрытого свойства CRM-формы, в который передаётся ClientID */
export const YM_CLIENT_ID_PROPERTY = 'ym_client_id'

/** Социальные сети, которые считаются мессенджерами */
export const MESSENGER_SOCIALS: readonly string[] = ['tg', 'max', 'vk']

/** Домены мессенджеров — запасной способ распознать ссылку на мессенджер */
const MESSENGER_HOSTS = ['t.me', 'max.ru', 'vk.ru', 'vk.com']

const CLIENT_ID_TIMEOUT = 5000

/** Базовый интервал между попытками отправки накопленных целей */
const GOAL_RETRY_BASE_DELAY = 500
/** Максимальный интервал между попытками */
const GOAL_RETRY_MAX_DELAY = 5000
/** Число автоматических повторов (~5 минут) */
const GOAL_RETRY_MAX_ATTEMPTS = 60

type ClientIDListener = (clientID: string) => void

let clientID: string | null = null
let clientIDPromise: Promise<string | null> | null = null
let consentGranted = false
let consentDeclined = false
const clientIDListeners = new Set<ClientIDListener>()

const pendingGoals: MetrikaGoal[] = []
let pendingTimer: ReturnType<typeof setTimeout> | null = null
let pendingAttempts = 0

const getCounter = (): YandexMetrikaApi | null => {
    if (typeof window === 'undefined') return null
    return typeof window.ym === 'function' ? window.ym : null
}

const isConsentGranted = (): boolean =>
    consentGranted || getCookieValue(METRIKA_CONSENT_COOKIE) === 'true'

const isConsentDeclined = (): boolean =>
    consentDeclined || getCookieValue(METRIKA_CONSENT_COOKIE) === 'false'

export const hasMetrikaConsent = isConsentGranted

export const isMessengerLink = (href: string): boolean => {
    try {
        const hostname = new URL(href, SITE_URL).hostname.replace(/^www\./, '')

        return MESSENGER_HOSTS.includes(hostname)
    } catch {
        return false
    }
}

export const isMetrikaGoal = (value: string): value is MetrikaGoal =>
    (METRIKA_GOALS as readonly string[]).includes(value)

/**
 * Ожидание появления счётчика: скрипт Метрики поднимается на каждой
 * странице, поэтому `ym` может появиться позже (гидрации, медленная сеть).
 */
const waitForCounter = (timeout: number): Promise<YandexMetrikaApi | null> =>
    new Promise((resolve) => {
        const counter = getCounter()
        if (counter) {
            resolve(counter)
            return
        }

        const startedAt = Date.now()
        const timer = setInterval(() => {
            const readyCounter = getCounter()
            if (readyCounter) {
                clearInterval(timer)
                resolve(readyCounter)
                return
            }
            if (Date.now() - startedAt >= timeout) {
                clearInterval(timer)
                resolve(null)
            }
        }, 100)
    })

/**
 * Отправка накопленных целей.
 *
 * Возвращает false, если счётчик ещё не готов — очередь при этом
 * остаётся нетронутой, чтобы ни одна цель не потерялась молча.
 */
const flushPendingGoals = (): boolean => {
    const counter = getCounter()
    if (!counter) return false

    if (pendingTimer) {
        clearTimeout(pendingTimer)
        pendingTimer = null
    }
    pendingAttempts = 0

    const goals = pendingGoals.splice(0, pendingGoals.length)
    goals.forEach((goal) => counter(METRIKA_ID, 'reachGoal', goal))

    return true
}

/**
 * Повторная отправка с экспоненциальной паузой: не долбим счётчик
 * чаще, чем он успевает подняться. Очередь не очищается — цели уйдут,
 * как только счётчик появится (см. `notifyCounterReady`).
 */
const scheduleGoalFlush = () => {
    if (pendingTimer) return
    if (pendingAttempts >= GOAL_RETRY_MAX_ATTEMPTS) return

    const delay = Math.min(GOAL_RETRY_BASE_DELAY * 2 ** pendingAttempts, GOAL_RETRY_MAX_DELAY)
    pendingTimer = setTimeout(() => {
        pendingTimer = null
        pendingAttempts += 1

        if (!flushPendingGoals()) {
            scheduleGoalFlush()
        }
    }, delay)
}

/**
 * Отправка цели в Метрику.
 *
 * Цель — обезличенный факт действия на сайте, поэтому отправляется
 * всегда, независимо от согласия на cookie. Согласие требуется только
 * для идентификатора посетителя (ClientID), см. `requestClientID`.
 */
export const reachGoal = (goal: MetrikaGoal): void => {
    const counter = getCounter()
    if (!counter) {
        pendingGoals.push(goal)
        // Бюджет повторов исчерпан — новая цель открывает новый,
        // очередь при этом не теряется
        if (pendingAttempts >= GOAL_RETRY_MAX_ATTEMPTS) pendingAttempts = 0
        scheduleGoalFlush()
        return
    }

    // Счётчик появился — сначала досылаем накопленное, затем текущую цель
    flushPendingGoals()
    counter(METRIKA_ID, 'reachGoal', goal)
}

/**
 * Счётчик загрузился — отправляем накопленные цели, не дожидаясь таймера,
 * и запрашиваем ClientID, если посетитель дал согласие.
 */
export const notifyCounterReady = (): void => {
    flushPendingGoals()
    applyConsentState()
    resolveClientID()
}

/**
 * Передаёт счётчику решение посетителя по cookie.
 *
 * Отказ нужно передать счётчику, иначе он продолжит собирать cookie.
 * Проверяется и решение текущей сессии, и cookie с прошлого визита:
 * счётчик поднимается на каждой странице, а отказ мог быть дан раньше.
 */
const applyConsentState = (): void => {
    const counter = getCounter()
    if (!counter || !isConsentDeclined()) return

    counter(METRIKA_ID, 'setUserParams', { cookie_consent: false })
}

export const getClientID = (): string | null => clientID

/**
 * Запрос ClientID. Вызывается только после получения согласия на cookie.
 */
export const requestClientID = (): Promise<string | null> => {
    // Идентификатор посетителя — данные, привязывающие визит к человеку,
    // поэтому без согласия его получить нельзя
    if (!isConsentGranted()) return Promise.resolve(null)
    if (clientID) return Promise.resolve(clientID)
    if (clientIDPromise) return clientIDPromise

    clientIDPromise = (async () => {
        const counter = await waitForCounter(CLIENT_ID_TIMEOUT)
        if (!counter) return null

        return new Promise<string | null>((resolve) => {
            const timer = setTimeout(() => resolve(clientID), CLIENT_ID_TIMEOUT)

            counter(METRIKA_ID, 'getClientID', (id: string) => {
                clearTimeout(timer)

                if (id) {
                    clientID = id
                    clientIDListeners.forEach((listener) => listener(id))
                }

                resolve(clientID)
            })
        })
    })().finally(() => {
        clientIDPromise = null
    })

    return clientIDPromise
}

/**
 * Подписка на получение ClientID
 */
export const onClientID = (listener: ClientIDListener): (() => void) => {
    clientIDListeners.add(listener)
    if (clientID) listener(clientID)

    return () => {
        clientIDListeners.delete(listener)
    }
}

/**
 * Запрос ClientID для согласия, полученного в прошлом визите
 */
export const resolveClientID = (): void => {
    if (!isConsentGranted()) return
    void requestClientID()
}

/**
 * Событие согласия на cookie: после него можно запрашивать ClientID
 */
export const notifyConsentGranted = (): void => {
    consentGranted = true
    resolveClientID()
}

/**
 * Событие отказа от cookie: счётчику нужно сообщить, что cookie собирать нельзя
 */
export const notifyConsentDeclined = (): void => {
    consentDeclined = true
    applyConsentState()
}
