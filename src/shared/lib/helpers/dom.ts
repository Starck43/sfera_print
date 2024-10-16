export function detectMobile() {
    if (typeof window === 'undefined') return null

    const devicesToMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ]

    return devicesToMatch.some((device) => navigator.userAgent.match(device))
}

export const detectDeviceOrientation = (): 'portrait' | 'landscape' | null => {
    if (typeof window === 'undefined') return null

    const isMobile = window.matchMedia
    if (!isMobile) return null

    const device = isMobile('(pointer:coarse)')
    if (device.matches) {
        return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape'
    }
    return null
}

export const getWindowDimensions = (container?: Element | null) => {
    let width = 0
    let height = 0

    if (container) {
        width = container.clientWidth
        height = container.clientHeight
    } else if (typeof container === 'undefined' && typeof window !== 'undefined') {
        width = window.innerWidth
        height = window.innerHeight
    }

    return {
        width: width,
        height: height,
        ratio: height > 0 ? width / height : 0,
        orientation: typeof window === 'undefined' ? null : detectDeviceOrientation()
    }
}

export const getScrollElement = (node: HTMLElement | undefined): HTMLElement | null => {
    if (!node) return null
    if (node.scrollHeight > node.clientHeight) {
        return node
    } else {
        return getScrollElement(node.parentElement as HTMLElement)
    }
}

export const smoothScroll = (
    target: Element | null,
    offset: number = 0,
    parent: Window | null = null
) => {
    if (typeof window === 'undefined' || !target) return null
    if (!parent) {
        parent = window
    }
    const parentOffset = parent.innerHeight

    const childOffset = target.getBoundingClientRect().top
    parent.scrollTo({
        top: childOffset + parentOffset + offset,
        behavior: 'smooth'
    })
}
