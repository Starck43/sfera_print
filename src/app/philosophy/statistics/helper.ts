import type { Partner } from '../types'

interface RefSvgProps {
    path: string
    text: { x: number; y: number; singX: number; singY: number }
}

/*
 * Convert hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const match = hex.replace('#', '').match(/.{1,2}/g)
    return match && match.length === 3
        ? {
              r: parseInt(match[0], 16),
              g: parseInt(match[1], 16),
              b: parseInt(match[2], 16)
          }
        : { r: 0, g: 0, b: 0 }
}

/*
 * Convert RGB to HSV
 */
function rgbToHsl(rgb: { r: number; g: number; b: number }): { h: number; s: number; l: number } {
    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    let h, s, l

    // Calculate hue
    switch (true) {
        case max === r:
            h = ((g - b) / delta) % 6
            break
        case max === g:
            h = (b - r) / delta + 2
            break
        case max === b:
            h = (r - g) / delta + 4
            break
        default:
            h = 0
    }

    h = Math.round(h * 60)
    if (h < 0) {
        h += 360
    }
    // Calculate lightness
    l = (max + min) / 2

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1)
    l = +(l * 100).toFixed(1)

    return { h, s, l }
}

export function calculatePercentByGroup(partners: Partner[]): { group: string; percent: number }[] {
    const categoryCountMap: { [key: string]: number } = {}

    // Count the amount of partners for each group
    partners.forEach((partner) => {
        categoryCountMap[partner.group] = (categoryCountMap[partner.group] || 0) + 1
    })

    // Calculate the total amount of partners
    const totalPartners = partners.length

    // Calculate the percentage for each group
    return Object.entries(categoryCountMap)
        .map(([group, count]) => ({
            group,
            percent: (count / totalPartners) * 100
        }))
        .sort((a, b) => b.percent - a.percent)
}

function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
): { x: number; y: number } {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
    }
}

function describeArc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    rotation: number
): string {
    const start = polarToCartesian(x, y, radius, startAngle + rotation)
    const end = polarToCartesian(x, y, radius, endAngle + rotation)

    const arcSweep = endAngle - startAngle <= 180 ? '0' : '1'

    return ['M', start.x, start.y, 'A', radius, radius, 0, arcSweep, 1, end.x, end.y].join(' ')
}

function generateCirclePath(
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number
): string {
    const start = polarToCartesian(centerX, centerY, radius, startAngle)
    const end = polarToCartesian(centerX, centerY, radius, startAngle + 180)

    return [
        'M',
        start.x,
        start.y,
        'A',
        radius,
        radius,
        0,
        0,
        0,
        end.x,
        end.y,
        'A',
        radius,
        radius,
        0,
        0,
        0,
        start.x,
        start.y,
        'Z'
    ].join(' ')
}

function describeReference(
    x: number,
    y: number,
    radius: number,
    angle: number,
    rotation: number,
    distance: number
): RefSvgProps {
    const { x: startX, y: startY } = polarToCartesian(x, y, radius, angle + rotation)
    const { x: endX, y: endY } = polarToCartesian(x, y, radius + distance, angle + rotation)

    return {
        path: `M ${startX} ${startY} L ${endX} ${endY}`,
        text: {
            x: endX,
            y: endY,
            singX: Math.sign(startX - endX),
            singY: Math.sign(startY - endY)
        }
    }
}

export function generateSvgChart(
    data: { group: string; percent: number }[],
    viewBoxWidth: number,
    chartRadius: number
): { arcs: string[]; refs: RefSvgProps[] } {
    const arcPaths: string[] = []
    const refPaths: RefSvgProps[] = []
    const initialRotation = -45
    let cumulativePercent = 0

    data?.forEach((item, index) => {
        const { percent } = item

        // Calculate coordinates for the start and end points on the circle circumference
        const radius = chartRadius
        const startX = viewBoxWidth / 2
        const startY = viewBoxWidth / 2
        const startAngle = 0 // cumulativePercent * 3.6 // Start angle based on cumulative percentage
        // Adjust end angle for the last segment to prevent a full circle
        cumulativePercent += percent
        let endAngle = cumulativePercent * 3.6 // End angle based on cumulative percentage
        // Adjust the end angle slightly for the last segment
        if (index === data.length - 1) endAngle -= 0.01

        // Construct path for the segment as an arc
        const path = describeArc(startX, startY, radius, startAngle, endAngle, initialRotation)
        arcPaths.push(path)
        // Construct ray path with text coords
        const ref = describeReference(startX, startY, radius, endAngle, initialRotation - 10, 30)
        refPaths.push(ref)
    })

    return { arcs: arcPaths.reverse(), refs: refPaths }
}

export function generateSvgDiagram(
    data: { title: string; desc: string }[],
    viewBoxWidth: number,
    startRadius: number,
    orbitRadiusStep: number
): {
    orbits: string[]
    satellites: { x: number; y: number }[]
    refs: RefSvgProps[]
} {
    if (!data?.length) return { orbits: [], satellites: [], refs: [] }

    const orbitPaths: ReturnType<typeof generateCirclePath>[] = []
    const satellitePaths: ReturnType<typeof polarToCartesian>[] = []
    const refPaths: ReturnType<typeof describeReference>[] = []
    const startAngle = 45 //Math.random() * 360

    data?.forEach((_, index) => {
        const orbitRadius = startRadius + (index + 1) * orbitRadiusStep
        const center = viewBoxWidth / 2
        const offsetAngle = (startAngle + (360 / data.length) * index) % 360
        const orbitPath = generateCirclePath(center, center, orbitRadius, offsetAngle)
        const satelliteCoords = polarToCartesian(center, center, orbitRadius, offsetAngle)
        const ref = describeReference(center, center, orbitRadius, offsetAngle, 0, 1)
        orbitPaths.push(orbitPath)
        satellitePaths.push(satelliteCoords)
        refPaths.push(ref)
    })

    return { orbits: orbitPaths, satellites: satellitePaths, refs: refPaths }
}

export function splitTextIntoArray(text: string, charsPerLine: number = 15) {
    const textArray = []
    const words = text.split(' ')
    let currentText = ''
    let currentCharCount = 0

    for (const w of words) {
        const word = w.trim()
        if (charsPerLine <= currentCharCount + word.length) {
            textArray.push(currentText.trim())
            currentText = word
            currentCharCount = word.length
        } else {
            if (currentText) {
                currentText += ' '
            }
            currentText += word
            currentCharCount += word.length + 1
        }
    }

    if (currentText) {
        textArray.push(currentText.trim())
    }

    return textArray
}

/**
 * Calculates the color of the wheel based on the current position.
 *
 * @param startColor - The starting color of the wheel.
 * @param endColor - The ending color of the wheel.
 * @param colorLength - The total amount of colors in the wheel.
 * @return {function(index: number): string} A function that takes the current position and returns the HSV color of the wheel at that position.
 */
export function calcWheelColor(
    startColor: string,
    endColor: string | number | null,
    colorLength: number
): (index: number) => string {
    const startHsl = rgbToHsl(hexToRgb(startColor))

    console.log(startHsl)
    if (!endColor || endColor === startColor || typeof endColor === 'number') {
        const MAX_LIGHTNESS = typeof endColor === 'number' ? endColor : 80

        return (index: number): string => {
            const lightness = Math.round(
                MAX_LIGHTNESS - ((MAX_LIGHTNESS - startHsl.l) * index) / colorLength
            )
            return `hsl(${Math.round(startHsl.h)}, ${startHsl.s}%, ${lightness}%)`
        }
    } else {
        const endHsl = rgbToHsl(hexToRgb(endColor))
        const hueStep = (endHsl.h - startHsl.h) / colorLength
        return (index: number): string => {
            const currentHue = startHsl.h + hueStep * index
            return `hsl(${currentHue}, ${startHsl.s}%, ${startHsl.l}%)`
        }
    }
}
