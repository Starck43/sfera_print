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

    // Для мобильных устройств используем медиа-запрос orientation
    const isMobile = window.matchMedia('(pointer:coarse)').matches
    if (isMobile) {
        return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape'
    }

    // Для десктопа определяем ориентацию по соотношению сторон
    const aspectRatio = window.innerWidth / window.innerHeight
    return aspectRatio > 1 ? 'landscape' : 'portrait'
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
