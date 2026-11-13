'use client'

import { useEffect } from 'react'

import {
    isMessengerLink,
    isMetrikaGoal,
    reachGoal,
    resolveClientID,
    type MetrikaGoal
} from '@/shared/lib/metrika'

const GOAL_ATTRIBUTE = 'data-metrika-goal'

const resolveGoal = (anchor: Element): MetrikaGoal | null => {
    const explicit = anchor.getAttribute(GOAL_ATTRIBUTE)
    if (explicit && isMetrikaGoal(explicit)) return explicit

    const href = anchor.getAttribute('href') || ''
    if (href.startsWith('tel:')) return 'phone'
    if (href.startsWith('mailto:')) return 'email'
    if (isMessengerLink(href)) return 'messenger'

    return null
}

const MetrikaGoals = () => {
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target
            if (!(target instanceof Element)) return

            const anchor = target.closest('a[href]')
            if (!anchor) return

            const goal = resolveGoal(anchor)
            if (goal) reachGoal(goal)
        }

        document.addEventListener('click', handleClick)

        // Согласие могло быть дано в прошлом визите — события согласия не будет
        resolveClientID()

        return () => document.removeEventListener('click', handleClick)
    }, [])

    return null
}

export default MetrikaGoals
