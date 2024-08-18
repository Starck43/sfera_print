import {SVGProps} from "react"

export interface SvgContentProps {
	svgContent: string
	newText?: string
	newAttributes?: SVGProps<SVGTextElement>
}

export const changeSvgText = ({svgContent, newText, newAttributes}: SvgContentProps) => {
    if (!newText) return svgContent

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const textElement = doc.querySelector("text");

    if (textElement) {
        textElement.textContent = newText

        // Применяем новые атрибуты, если они есть
        if (newAttributes) {
            Object.entries(newAttributes).forEach(([key, value]) => {
                textElement.setAttribute(key, value)
            });
        }

        // Возвращаем обновленный SVG контент
        return new XMLSerializer().serializeToString(doc)
    }

    return svgContent
}

interface CalculateStrokeWidthProps {
    viewport: [number, number]
    viewBox: [number, number]
    strokeWidth?: number
    scaleFactor: number
}

export const calculateStrokeWidth = ({viewport, viewBox, strokeWidth=1, scaleFactor}: CalculateStrokeWidthProps) => {

	const widthRatio = viewport[0] / viewBox[0];
	const heightRatio = viewport[1] / viewBox[1];

	return  strokeWidth * Math.min(widthRatio, heightRatio) * scaleFactor;
}