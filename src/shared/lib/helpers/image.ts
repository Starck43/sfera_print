import { type StaticImageData } from 'next/image'
import type { Media } from '@/components/post'
import {
    BreakpointSource,
    MediaSource,
    MediaSourceSelector,
    ResponsiveSource
} from '@/shared/types/media'

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
const isBreakpointSource = (source: MediaSource): source is BreakpointSource => {
    if (typeof source !== 'object' || isStaticImageData(source)) return false

    const keys = Object.keys(source)
    return keys.some((key) => !isNaN(Number(key)))
}

const isResponsiveSource = (source: MediaSource): source is ResponsiveSource => {
    return (
        typeof source === 'object' &&
        ('landscape' in source || 'portrait' in source || 'default' in source)
    )
}

const isStaticImageData = (source: any): source is StaticImageData => {
    return source && typeof source === 'object' && 'src' in source
}

const isMediaSourceSelector = (source: MediaSource): source is MediaSourceSelector => {
    return typeof source === 'object' && 'select' in source && typeof source.select === 'function'
}

// Получение актуального источника на основе условий
export const getCurrentSource = (
    source: MediaSource | undefined,
    orientation: 'landscape' | 'portrait',
    windowWidth: number
): string | StaticImageData | undefined => {
    if (!source) return undefined

    // MediaSourceSelector (приоритет самый высокий)
    if (isMediaSourceSelector(source)) {
        return source.select(orientation, windowWidth)
    }

    // Простая строка или StaticImageData
    if (typeof source === 'string' || isStaticImageData(source)) {
        return source
    }

    // Breakpoint source (приоритет над ориентацией)
    if (isBreakpointSource(source)) {
        // Сортируем брейкпоинты по убыванию
        const breakpoints = Object.keys(source)
            .filter((key) => !isNaN(Number(key)))
            .map(Number)
            .sort((a, b) => b - a)

        // Находим подходящий брейкпоинт (ширина >= breakpoint)
        const matchingBreakpoint = breakpoints.find((breakpoint) => windowWidth >= breakpoint)

        if (matchingBreakpoint && source[matchingBreakpoint]) {
            return source[matchingBreakpoint]
        }

        // Если брейкпоинт не найден, проверяем ориентацию
        if (source[orientation]) {
            return source[orientation]
        }

        // Затем дефолтное значение
        return source.default
    }

    // Responsive source (только ориентация)
    if (isResponsiveSource(source)) {
        if (source[orientation]) {
            return source[orientation]
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
