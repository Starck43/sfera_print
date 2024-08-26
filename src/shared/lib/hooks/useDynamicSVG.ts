import {SVGProps, useCallback, useEffect, useState} from 'react'
import {changeSvgText, type SvgContentProps} from "@/shared/lib/helpers/svg"


interface UseDynamicSVGProps {
	svgPath: string
	textAttributes: SVGProps<SVGTextElement>
}

const useDynamicSVG = ({svgPath, textAttributes}: UseDynamicSVGProps) => {
	const [svgContent, setSvgContent] = useState<string>("")
	const [attributes, setAttributes] = useState<SVGProps<SVGTextElement>>(textAttributes || {})

	useEffect(() => {
		const fetchSVG = async () => {
			const response = await fetch(svgPath)
			return await response.text()
		}

		fetchSVG().then(svg => setSvgContent(svg))

	}, [svgPath])

	const handleTextChange = useCallback(({newText, newAttributes}: SvgContentProps) => {
		setAttributes((prevAttributes) => newAttributes || prevAttributes)

		const updatedSvgContent = changeSvgText({svgContent, newText, newAttributes} as SvgContentProps)
		if (updatedSvgContent) {
			setSvgContent(updatedSvgContent)
		}
	}, [svgContent])


	return {svgContent, attributes, handleTextChange}
}

export default useDynamicSVG
