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

export const detectDeviceOrientation = (): 'portrait' | 'landscape' => {
    if (typeof window === 'undefined') return 'landscape' // дефолтное значение для SSR

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
    if (typeof window === 'undefined') {
        return {
            width: 0,
            height: 0,
            ratio: 0,
            orientation: 'landscape' as const
        }
    }

    let width
    let height

    if (container) {
        width = container.clientWidth
        height = container.clientHeight
    } else {
        width = window.innerWidth
        height = window.innerHeight
    }

    return {
        width: width,
        height: height,
        ratio: height > 0 ? width / height : 0,
        orientation: detectDeviceOrientation()
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
