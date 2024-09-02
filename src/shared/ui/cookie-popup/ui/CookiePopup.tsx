import React, {MutableRefObject, useEffect, useRef, useState} from 'react'

import {checkCookie, setCookie} from "@/shared/lib/helpers/cookie"
import {classnames} from "@/shared/lib/helpers/classnames"
import {Button} from "@/shared/ui/button"
import {NavLink} from "@/shared/ui/link"
import {Row} from "@/shared/ui/stack"

import cls from './CookiePopup.module.sass'

interface CookiePopupProps {
	file: string
	onClose: () => void
}

const CookiePopup = ({file, onClose}: CookiePopupProps) => {
	const approved_policy = checkCookie('cookie_policy')
	const [visible, setVisible] = useState(false)
	const timer = useRef(null) as MutableRefObject<any>

	useEffect(() => {
		if (approved_policy && file) {
			window.open(file, '_blank')
		}

		timer.current = setTimeout(() => {
			//const cookiePolicyAccepted = checkCookie('cookie_policy')
			setVisible(true)
		}, !approved_policy ? 2000 : 0)

		return () => clearTimeout(timer.current)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleClose = () => {
		setCookie('cookie_policy', 'true', 365);
		setVisible(false)

		timer.current = setTimeout(() => {
			onClose()
		}, 600)

		return () => clearTimeout(timer.current)
	}

	return (
		<Row align="center" justify="between" className={classnames(cls, ['cookie__popup'], {visible})}>
			<p>
				Этот сайт использует файлы cookie для улучшения пользовательского опыта. Продолжая пользоваться
				сайтом, Вы {!approved_policy ? 'соглашаетесь' : 'согласились'} с использованием файлов cookie. Рекомендуем ознакомиться с политикой &nbsp;
				<NavLink href={file} title='здесь' target="_blank" rel="noopener noreferrer"/>.
			</p>
			<Button rounded onClick={handleClose}>{!approved_policy ? 'Принять' : 'ОК'}</Button>
		</Row>
	);
}


export default CookiePopup