import type { Partner } from '../types'
import { BrandSlider } from '@/components/brand-slider'

export const Partners = ({ data }: { data: Partner[] }) => {
    return <BrandSlider items={data} />
}
