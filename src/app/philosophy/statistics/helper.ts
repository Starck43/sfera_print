import type {Partner} from "../types"

interface RefSvgProps {
	path: string,
	text: { x: number; y: number, singX: number, singY: number }
}


export function calculatePercentByGroup(partners: Partner[]): { group: string; percent: number }[] {
	const categoryCountMap: { [key: string]: number } = {}

	// Count the amount of partners for each group
	partners.forEach(partner => {
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
	const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	};
}

function describeArc(
	x: number,
	y: number,
	radius: number,
	startAngle: number,
	endAngle: number,
	rotation: number
): string {
	const start = polarToCartesian(x, y, radius, startAngle + rotation);
	const end = polarToCartesian(x, y, radius, endAngle + rotation);

	const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

	return [
		"M", start.x, start.y,
		"A", radius, radius, 0, arcSweep, 1, end.x, end.y
	].join(" ");
}

function generateCirclePath(centerX: number, centerY: number, radius: number, startAngle: number): string {
	const start = polarToCartesian(centerX, centerY, radius, startAngle);
	const end = polarToCartesian(centerX, centerY, radius, startAngle + 180);

	return [
		"M", start.x, start.y,
		"A", radius, radius, 0, 0, 0, end.x, end.y,
		"A", radius, radius, 0, 0, 0, start.x, start.y, "Z"
	].join(" ");
}

function describeReference(
	x: number,
	y: number,
	radius: number,
	angle: number,
	rotation: number,
	distance: number
): RefSvgProps {

	const {x: startX, y: startY} = polarToCartesian(x, y, radius, angle + rotation);
	const {x: endX, y: endY} = polarToCartesian(x, y, radius + distance, angle + rotation);

	return {
		path: `M ${startX} ${startY} L ${endX} ${endY}`,
		text: {
			x: endX,
			y: endY,
			singX: Math.sign(startX - endX),
			singY: Math.sign(startY - endY)
		}
	};
}

export function generateSvgChart(
	data: { group: string, percent: number }[],
	viewBoxWidth: number,
	chartRadius: number
): { arcs: string[], refs: RefSvgProps[] } {

	const arcPaths: string[] = []
	const refPaths: RefSvgProps[] = []
	const initialRotation = -45
	let cumulativePercent = 0

	data?.forEach((item, index) => {
		const {percent} = item

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

	return {arcs: arcPaths.reverse(), refs: refPaths}
}

export function generateSvgDiagram(
	data: { title: string, desc: string }[],
	viewBoxWidth: number,
	startRadius: number,
	orbitRadiusStep: number
): { orbits: string[], satellites: { x: number, y: number }[], refs: RefSvgProps[] } {
	const orbitPaths: ReturnType<typeof generateCirclePath>[] = []
	const satellitePaths: ReturnType<typeof polarToCartesian>[] = []
	const refPaths: ReturnType<typeof describeReference>[] = []
	const startAngle = Math.random() * 360

	data?.forEach((item, index) => {
		const orbitRadius = startRadius + (index + 1) * orbitRadiusStep
		const center = viewBoxWidth / 2
		const offsetAngle = (startAngle + 360 / data.length * index) % 360
		const orbitPath = generateCirclePath(center, center, orbitRadius, offsetAngle)
		const satelliteCoords = polarToCartesian(center, center, orbitRadius, offsetAngle)
		const ref = describeReference(center, center, orbitRadius, offsetAngle, 0, 1)
		orbitPaths.push(orbitPath)
		satellitePaths.push(satelliteCoords)
		refPaths.push(ref)
	})

	return {orbits: orbitPaths, satellites: satellitePaths, refs: refPaths}
}