import { type StaticImageData } from 'next/image'
import type { Media } from '@/components/post'
import { BreakpointSource, MediaSource, ResponsiveSource } from '@/shared/types/media'

export const createSrcSet = (srcset: string[] | undefined) => {
    if (!srcset) return { media: undefined, srcset: undefined }
    let media

    const srcSet = srcset.reduce((acc, value, index) => {
        const arr = value.match(/(?!_)\d+w/g)
        const width = arr && arr.length ? arr.pop() : ''
        if (width && index === srcset.length - 1) {
            media = `(max-width: ${parseInt(width, 10)}px)`
        }
        return `${acc + value} ${width}${index < srcset.length - 1 ? ', ' : ''}`
    }, '')

    return {
        media,
        srcSet
    }
}

export function getDeviceImage(
    image?: Media['image'] | null,
    thumb = false
): {
    src: string | undefined
    srcSet: string[] | undefined
} {
    if (!image) return { src: undefined, srcSet: undefined }

    return typeof image === 'object' && 'src' in image
        ? {
              src: thumb ? image.srcset?.[0] || image.src : image.src,
              srcSet: image.srcset
          }
        : {
              src: image,
              srcSet: undefined
          }
}

// Вспомогательные функции для работы с источниками
const isResponsiveSource = (source: MediaSource): source is ResponsiveSource => {
    return typeof source === 'object' && ('landscape' in source || 'portrait' in source)
}
const isBreakpointSource = (source: MediaSource): source is BreakpointSource => {
    return (
        typeof source === 'object' &&
        !('landscape' in source) &&
        !('portrait' in source) &&
        !('src' in source)
    )
}
const isStaticImageData = (source: any): source is StaticImageData => {
    return source && typeof source === 'object' && 'src' in source
}
// Получение актуального источника на основе условий
export const getCurrentSource = (
    source: MediaSource | undefined,
    orientation: string | null,
    windowWidth: number
): string | StaticImageData | undefined => {
    if (!source) return undefined

    // Простая строка или StaticImageData
    if (typeof source === 'string' || isStaticImageData(source)) {
        return source
    }

    // Responsive source (ориентация)
    if (isResponsiveSource(source)) {
        const isLandscape = orientation === 'landscape'

        if (isLandscape && source.landscape) {
            return source.landscape
        }

        if (!isLandscape && source.portrait) {
            return source.portrait
        }

        return source.default
    }

    // Breakpoint source
    if (isBreakpointSource(source)) {
        // Сортируем брейкпоинты по убыванию
        const breakpoints = Object.keys(source)
            .filter((key) => key !== 'default')
            .map(Number)
            .sort((a, b) => b - a)

        // Находим подходящий брейкпоинт
        const matchingBreakpoint = breakpoints.find((breakpoint) => windowWidth >= breakpoint)

        if (matchingBreakpoint && source[matchingBreakpoint]) {
            return source[matchingBreakpoint]
        }

        return source.default
    }

    return undefined
}
// Получение строкового URL из источника
export const getSourceUrl = (source: string | StaticImageData | undefined): string | undefined => {
    if (!source) return undefined
    return typeof source === 'string' ? source : source.src
}
