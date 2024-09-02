'use client'

import {useEffect, useMemo, useState} from "react"
import Image from "next/image"
import {checkCookie} from "@/shared/lib/helpers/cookie"
import {Col, Flex} from "@/shared/ui/stack"
import {CookiePopup} from "@/shared/ui/cookie-popup"

import NavItem from "./nav-item/NavItem"
import {NavMenu} from "./nav-menu/NavMenu"

import {ContactItem} from "@/components/contacts"
import type {Menu} from "./types"

import cls from "./Navbar.module.sass"

interface NavbarProps {
	data: Menu
	className?: string
}

const Navbar = ({data, className}: NavbarProps) => {
	const {
		pages,
		contact,
		socials,
		policy = null,
		agreement = null,
		cookie = null
	} = data
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
							{pages?.map(item =>
								<NavItem key={item.path} {...item} />
							)}
						</Col>

						{socials &&
						<Col gap='xs' align='end' className={cls.socials}>
							{socials.map(({name, title, link, image}) => (
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
						{contact &&
                            <ContactItem item={contact} className={cls.tel}/>
						}

						{policy &&
                            <a href={policy} target="_blank" className={cls.policy}>
                                Политика конфиденциальности
                            </a>
						}

						{agreement &&
                            <a href={agreement} target="_blank" className={cls.policy}>
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
	), [contact, pages, socials, policy, agreement, className,])

	return (
		<>
			{navbarContent}
			{isCookieOpen &&
				<CookiePopup
					file={cookie || ''}
					onClose={() => setIsCookieOpen(false)}
				/>
			}
		</>
	)
}

export default Navbar
