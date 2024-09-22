import { Timeline } from '@/components/timeline'
import type { Achievement } from '../types'

export const Achievements = ({ data }: { data: Achievement[] }) => (
    <Timeline items={data} />
)
