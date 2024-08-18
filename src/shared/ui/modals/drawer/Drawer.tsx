import {CSSProperties, useCallback, useEffect, useRef} from "react"
import {AnimatedProps, InterpolatorArgs} from "@react-spring/web"

import {AnimationProvider, useAnimationModules} from "@/shared/lib/providers/AnimationProvider"
import {useWindowDimensions} from "@/shared/lib/hooks/useWindowDimensions"
import {classnames} from "@/shared/lib/helpers/classnames"
import {getScrollElement} from "@/shared/lib/helpers/dom"

import {Col, Row} from "@/shared/ui/stack"
import {Portal} from "@/shared/ui/portal"
import {ROOT_ID} from "@/shared/const/page"

import type {DrawerProps} from "../types"
import {CloseButton} from "../../button"
import {Overlay} from "../overlay/Overlay"

import styles from "../styles/Modals.module.sass"
import cls from "./Drawer.module.sass"


const DrawerContent = (props: DrawerProps) => {
	const {
		open,
		onClose,
		header = null,
		footer = null,
		closeOnOverlayClick = false,
		animationTime = 300,
		showClose = true,
		position = "bottom",
		fullSize = false,
		rounded = false,
		bordered = false,
		className,
		children,
	} = props

	const {width, height} = useWindowDimensions()
	const {Spring, Gesture} = useAnimationModules()
	const [
		{x, y},
		api
	] = Spring.useSpring(() => ({x: width, y: height}))

	const bodyRef = useRef<HTMLDivElement | null>(null)

	const checkScrollBody = useCallback(() => {
		if (!bodyRef?.current) return

		const scrollParent = getScrollElement(bodyRef?.current?.firstChild as HTMLElement);
		if (scrollParent) {
			bodyRef?.current?.classList?.add("scrollable")
		} else {
			bodyRef?.current?.classList?.remove("scrollable")
		}

	}, [bodyRef])

	useEffect(() => {
		checkScrollBody()
	}, [checkScrollBody, height])


	const openDrawer = useCallback(() => {
		api.start({
			x: 0, y: 0, immediate: false, onResolve: () => checkScrollBody()
		})
	}, [api, checkScrollBody])

	useEffect(() => {
		if (open) openDrawer()
	}, [open, openDrawer])


	const closeDrawer = useCallback((velocity = 0) => {
		api.start({
			x: width,
			y: height,
			immediate: false,
			config: {...Spring.config.stiff, velocity, duration: animationTime},
			onStart: footer?.props?.onClick?.(),
			onResolve: onClose,
		})
		document.body.style.overflow = ""
	}, [api, width, height, Spring.config.stiff, animationTime, footer?.props, onClose])


	const bind = Gesture.useDrag(
		({last, velocity: [vx, vy], direction: [dx, dy], movement: [mx, my], cancel}) => {
			if (position === "top" || position === "bottom") {
				if (my < -60) cancel()

				if (last) {
					if (my > height * 0.5 || (vy > 0.5 && dy > 0)) {
						closeDrawer()
					} else {
						openDrawer()
					}
				} else {
					api.start({y: my, immediate: false})
				}
			} else {
				if (mx < -60) cancel()

				if (last) {
					if (mx > height * 0.5 || (vx > 0.5 && dx > 0)) {
						closeDrawer()
					} else {
						openDrawer()
					}
				} else {
					api.start({x: mx, immediate: false})
				}
			}
		},
		{
			from: () => [x.get(), y.get()],
			duration: animationTime,
			filterTaps: true,
			bounds: {top: 0, left: 0},
			rubberband: true,
		},
	)

	if (!open) return null

	let overlayStyle = {}
	let drawerStyle = {}
	let contentStyle = {}

	if (position === "bottom") {
		const display = y.to(py => py < height ? "block" : "none")
		overlayStyle = {
			display,
			opacity: y.to([0, height], [1, 0], "clamp"),
		}
		drawerStyle = {display, bottom: 0, y}
		contentStyle = {}
	} else {
		const display = x.to(px => px < width ? "block" : "none")

		overlayStyle = {
			display,
			opacity: x.to([0, width], [1, 0], "clamp"),
		}
		drawerStyle = {display, right: 0, x}
		contentStyle = {}
	}

	return (
		<Portal target={document.getElementById(ROOT_ID) || document.body}>
			<Overlay as={Spring.a.div} open show style={overlayStyle}/>
			<Spring.a.div
				{...bind()}
				className={cls.drawer}
				style={drawerStyle as any}
				onClick={closeOnOverlayClick ? () => closeDrawer(0) : undefined as any}
			>
				<Col
					role="link"
					gap="xs"
					align="start"
					justify="between"
					className={classnames(
						cls,
						["drawer__content", "show", "shadowed", position],
						{
							rounded,
							bordered,
							fullSize,
						},
						[
							styles.modals,
							styles.open,
							bordered ? styles.bordered : "",
							fullSize ? styles.fullSize : "",
							className,
						],
					)}
					style={contentStyle}
				>
					<Row gap="sm" fullWidth justify="between" align="center" className={styles.header}>
						{header}
						{showClose && (
							<CloseButton className={styles.close__button} handleOnClick={() => closeDrawer()}/>
						)}
					</Row>

					<div ref={bodyRef} className={classnames(cls, ["body"], {}, [styles.body])}>
						{children}
					</div>

					{footer &&
                        <div className={classnames(cls, ["footer"], {}, [styles.footer])}>
							{footer}
                        </div>
					}
				</Col>
			</Spring.a.div>
		</Portal>
	)
}

const DrawerAsync = (props: DrawerProps) => {
	const {isLoaded} = useAnimationModules()
	return isLoaded ? <DrawerContent {...props} /> : null
}

export const Drawer = (props: DrawerProps) => (
	<AnimationProvider>
		<DrawerAsync {...props} />
	</AnimationProvider>
)
