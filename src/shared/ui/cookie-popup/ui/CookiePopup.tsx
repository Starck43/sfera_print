import React, {memo, MutableRefObject, useEffect, useRef, useState} from 'react'

import {checkCookie, setCookie} from "@/shared/lib/helpers/cookie"
import {classnames} from "@/shared/lib/helpers/classnames"
import {Button} from "@/shared/ui/button"
import {NavLink} from "@/shared/ui/link"
import {Row} from "@/shared/ui/stack"

import cls from './CookiePopup.module.sass'

interface CookiePopupProps {
	onClose: () => void
	file: string
}

const CookiePopup = ({onClose, file}: CookiePopupProps) => {
	const policy_status = checkCookie('cookie_policy')
	const [visible, setVisible] = useState(false)
	const timer = useRef(null) as MutableRefObject<any>

	useEffect(() => {
		timer.current = setTimeout(() => {
			const cookiePolicyAccepted = checkCookie('cookie_policy')
			setVisible(true)
		}, !policy_status ? 2000 : 0)

		return () => clearTimeout(timer.current)
	}, [policy_status])

	const handleClose = () => {
		setVisible(false)

		if (!policy_status) {
			setCookie('cookie_policy', 'true', 365);
		}
		timer.current = setTimeout(() => {
			onClose()
		}, 600)

		return () => clearTimeout(timer.current)
	}

	return (
		<Row className={classnames(cls, ['cookie__popup'], {visible})}>
			<p>
				Этот сайт использует файлы cookie для улучшения пользовательского опыта. Продолжая пользоваться
				сайтом, Вы {!policy_status ? 'соглашаетесь' : 'согласились'} с использованием файлов cookie. Рекомендуем ознакомиться с политикой &nbsp;
				<NavLink href={`${file}`} target="_blank" rel="noopener noreferrer">здесь</NavLink>.
			</p>
			<Button rounded onClick={handleClose}>{!policy_status ? 'Принять' : 'ОК'}</Button>
		</Row>
	);
}


export default memo(CookiePopup)