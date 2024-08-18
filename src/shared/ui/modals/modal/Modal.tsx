import {Button, CloseButton} from "@/shared/ui/button"
import {Header} from "@/shared/ui/header"
import {Portal} from "@/shared/ui/portal"
import {Col, Flex, Row} from "@/shared/ui/stack"
import {ROOT_ID} from "@/shared/const/page"
import {classnames} from "@/shared/lib/helpers/classnames"

import SubmitIcon from "/public/svg//check.svg"
import CancelIcon from "/public/svg/close.svg"
import type {ModalProps} from "../types"
import {Overlay} from "../overlay/Overlay"
import {useModal} from "../lib/hooks/useModal"

import styles from "../styles/Modals.module.sass"
import cls from "./Modal.module.sass"


export const Modal = (props: ModalProps) => {
	const {
		lazy = false,
		open = false,
		onSubmit,
		onClose,
		submitBtnLabel,
		closeBtnLabel = "",
		header,
		footer,
		closeOnOverlayClick = false,
		animationTime = 180,
		showClose = true,
		rounded = false,
		bordered = true,
		size,
		fullSize = false,
		fullWidth = false,
		className,
		style,
		zIndex,
		children,
	} = props

	const modalProps = useModal({
		onSubmit,
		onClose,
		isOpen: open,
		animationTime,
	})
	const {isMounted, isShown: show, handleSubmit, handleClose} = modalProps

	if (lazy && !isMounted) return null

	return (
		<Portal target={document.getElementById(ROOT_ID) || document.body}>
			<Overlay
				open={open}
				show={show}
				onClick={closeOnOverlayClick ? handleClose : undefined}
				style={{transitionDuration: `${animationTime}ms`, zIndex}}
			/>
			<Col
				justify="between"
				gap="sm"
				className={classnames(
					cls,
					["modal", "shadowed", size],
					{
						open,
						show,
						fullSize,
						rounded,
						bordered,
					},
					[
						styles.modals,
						open ? styles.open : "",
						bordered ? styles.bordered : "",
						fullSize ? styles.fullSize : "",
						className,
					],
				)}
				style={{...style, transitionDuration: `${animationTime}ms`, zIndex}}
			>
				<Row gap="sm" fullWidth justify="between" align="center" className={styles.header}>
					{typeof header === "string" ? <Header tag="h4" title={header} align="start"/> : header}
					{showClose && <CloseButton className={styles.close__button} handleOnClick={handleClose}/>}
				</Row>

				<div className={styles.body}>
					<Row className={styles.content} justify="between" wrap fullWidth>
						{children}
					</Row>
				</div>

				{closeBtnLabel || submitBtnLabel || footer
					? <Flex justify="center" wrap fullWidth className={styles.footer}>
						{footer}
						{onSubmit && submitBtnLabel && (
							<Button
								feature="inverted"
								type="submit"
								bordered
								Icon={<SubmitIcon className={styles.icon}/>}
								onClick={onSubmit}
							>
								{submitBtnLabel}
							</Button>
						)}

						{handleClose && closeBtnLabel && (
							<Button
								feature="blank"
								bordered
								Icon={<CancelIcon className={styles.icon}/>}
								onClick={handleClose}
							>
								{closeBtnLabel}
							</Button>
						)}
					</Flex>
					: null
				}
			</Col>
		</Portal>
	)
}
