'use client'

import {useEffect, useMemo, useState} from "react"
import Image from "next/image"

import {ContactItem} from "@/components/contacts"

import {checkCookie} from "@/shared/lib/helpers/cookie"
import {useFetch} from "@/shared/lib/hooks/useFetch"

import {Col, Flex} from "@/shared/ui/stack"
import {Loader} from "@/shared/ui/loader"
import {CookiePopup} from "@/shared/ui/cookie-popup"

import type {Menu} from "./types"
import NavItem from "./nav-item/NavItem"
import {NavMenu} from "./nav-menu/NavMenu"

import cls from "./Navbar.module.sass"

interface NavbarProps {
	className?: string
}

const Navbar = ({className}: NavbarProps) => {
	const {data} = useFetch<Menu>('menu')
	const [isCookieOpen, setIsCookieOpen] = useState(false)

	useEffect(() => {
		//removeCookie('cookie_policy')
		if (!checkCookie('cookie_policy')) {
			setIsCookieOpen(true)
		}
	}, [])

	const navbarContent = useMemo(() => (
		<div role="navigation" className={className || ''}>
			<NavMenu>
				<Col gap='sm' align='baseline' justify='start' className={cls.navmenu}>
					<Flex gap='xs' justify='between' fullWidth style={{marginBottom: 'auto'}}>
						<Col gap='sm' className={cls.navitems}>
							{data?.pages?.map(item =>
								<NavItem key={item.path} {...item} />
							)}
						</Col>

						{data?.socials &&
						<Col gap='xs' align='end' className={cls.socials}>
							{data.socials.map(({name, title, link, image}) => (
								<a
									key={'social-' + name}
									href={link} target="_blank"
									className={image? cls.social__image__link : cls.social__link}
								>
									<Image src={image || `/svg/socials/${name}.svg`} alt={title} sizes="100%" fill/>
								</a>
							))}
						</Col>
						}
					</Flex>

					<Col gap="none" className={cls.navbar__links}>
						{data?.contact &&
                            <ContactItem item={data.contact} className={cls.tel}/>
						}

						{data?.policy &&
                            <a href={data.policy} target="_blank" className={cls.policy}>
                                Политика конфиденциальности
                            </a>
						}

						{data?.agreement &&
                            <a href={data.agreement} target="_blank" className={cls.policy}>
                                Соглашение на использование материалов
                            </a>
						}
						<div onClick={() => setIsCookieOpen(true)} className={cls.policy}>
							Соглашение на обработку персональных данных
						</div>
					</Col>
				</Col>
			</NavMenu>
		</div>
	), [data, className])

	if (!data) return <Loader/>

	return (
		<>
			{navbarContent}
			{data?.cookie && isCookieOpen &&
				<CookiePopup
					file={data.cookie}
					onClose={() => setIsCookieOpen(false)}
				/>
			}
		</>
	)
}

export default Navbar
