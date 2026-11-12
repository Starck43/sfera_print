'use client'

import { getCookieValue } from '@/shared/lib/helpers/cookie'

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
const GOAL_RETRY_DELAY = 500
const GOAL_RETRY_LIMIT = 20

type ClientIDListener = (clientID: string) => void

let clientID: string | null = null
let clientIDPromise: Promise<string | null> | null = null
let consentGranted = false
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

export const hasMetrikaConsent = isConsentGranted

export const isMessengerLink = (href: string): boolean => {
    try {
        const hostname = new URL(href, 'https://asfp.pro').hostname.replace(/^www\./, '')

        return MESSENGER_HOSTS.includes(hostname)
    } catch {
        return false
    }
}

export const isMetrikaGoal = (value: string): value is MetrikaGoal =>
    (METRIKA_GOALS as readonly string[]).includes(value)

/**
 * Ожидание появления счётчика: на первом визите скрипт Метрики
 * поднимается после согласия на cookie, поэтому `ym` может появиться позже.
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

const flushPendingGoals = () => {
    const counter = getCounter()
    if (!counter) {
        pendingAttempts += 1
        if (pendingAttempts < GOAL_RETRY_LIMIT) {
            scheduleGoalFlush()
        } else {
            pendingGoals.length = 0
        }
        return
    }

    pendingAttempts = 0
    const goals = pendingGoals.splice(0, pendingGoals.length)
    goals.forEach((goal) => counter(METRIKA_ID, 'reachGoal', goal))
}

const scheduleGoalFlush = () => {
    if (pendingTimer) return
    pendingTimer = setTimeout(() => {
        pendingTimer = null
        flushPendingGoals()
    }, GOAL_RETRY_DELAY)
}

/**
 * Отправка цели в Метрику
 */
export const reachGoal = (goal: MetrikaGoal): void => {
    const counter = getCounter()
    if (!counter) {
        pendingGoals.push(goal)
        scheduleGoalFlush()
        return
    }

    counter(METRIKA_ID, 'reachGoal', goal)
}

export const getClientID = (): string | null => clientID

/**
 * Запрос ClientID. Вызывается только после получения согласия на cookie.
 */
export const requestClientID = (): Promise<string | null> => {
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
