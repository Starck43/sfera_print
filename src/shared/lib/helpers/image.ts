import type { Media } from '@/components/post'

export const createSrcSet = (srcset: Array<string> | undefined) => {
    if (!srcset) return undefined

    return srcset.reduce((acc, value, index) => {
        const arr = value.match(/(?!_)\d+w/g)
        if (!arr) return acc
        return `${acc + value} ${arr.pop()}${index < srcset.length - 1 ? ', ' : ''}`
    }, '')
}

export function getDeviceSrc(image?: Media['image'] | null, thumb = false): string | undefined {
    if (!image) return

    return typeof image === 'object' && 'src' in image ? (thumb ? image.srcset?.[0] || image.src : image.src) : image
}
