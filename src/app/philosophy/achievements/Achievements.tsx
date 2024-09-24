import { Timeline } from '@/components/timeline'
import type { Achievement } from '../types'

import AchieveIcon from '@/svg/achieve.svg'

export const Achievements = ({ data }: { data: Achievement[] }) => (
    <Timeline items={data} icon={<AchieveIcon />} />
)
