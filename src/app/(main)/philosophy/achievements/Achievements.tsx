'use server'

import { Timeline } from '@/components/timeline'
import type { Achievement } from '../types'

import AchieveIcon from '@/svg/achieve.svg'

export const Achievements = async ({ data }: { data: Achievement[] }) => {
    const iconElement = <AchieveIcon /> // вызываем функцию на сервере
    return <Timeline items={data} icon={iconElement} />
}
