import { type StaticImageData } from 'next/image'

export type ResponsiveSource = {
    landscape?: string | StaticImageData
    portrait?: string | StaticImageData
    default?: string | StaticImageData
}

export type BreakpointSource = {
    [breakpoint: number]: string | StaticImageData // min-width: src
    landscape?: string | StaticImageData
    portrait?: string | StaticImageData
    default?: string | StaticImageData
}

export type MediaSourceSelector = {
    select: (
        orientation: 'portrait' | 'landscape',
        width: number
    ) => string | StaticImageData | undefined
}

export type MediaSource =
    | string
    | StaticImageData
    | ResponsiveSource
    | BreakpointSource
    | MediaSourceSelector
