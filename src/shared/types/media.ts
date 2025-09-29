
import { type StaticImageData } from 'next/image'

export type ResponsiveSource = {
    landscape?: string | StaticImageData
    portrait?: string | StaticImageData
    default?: string | StaticImageData
}
export type BreakpointSource = {
    [breakpoint: number]: string | StaticImageData // min-width: src
    default?: string | StaticImageData
}
export type MediaSource = string | StaticImageData | ResponsiveSource | BreakpointSource
