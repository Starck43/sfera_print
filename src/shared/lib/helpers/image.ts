import type { Media } from '@/components/post'

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

export const createThumbUrl = (src: string, width: number) => {
    const path = src?.split('.')
    if (path && path.length > 1) {
        const ext = path.pop()
        const thumbName = '_' + width + 'w'
        return path.join('.') + thumbName + '.' + ext
    }
    return src
}
