'use client'

import { Fragment, useEffect, useMemo, useState, useCallback, memo } from 'react'

import { checkCookie } from '@/shared/lib/helpers/cookie'
import { useFetch } from '@/shared/lib/hooks/useFetch'
import { getMediaUrl } from '@/shared/lib/helpers/url'
import { Col, Flex } from '@/shared/ui/stack'
import { LazyImage } from '@/shared/ui/lazy-image'
import { CookiePopup } from '@/shared/ui/cookie-popup'

import { ContactItem } from '@/components/contacts'

import type { Menu, Policy, Social } from './types'
import NavItem from './nav-item/NavItem'
import { NavMenu } from './nav-menu/NavMenu'

import cls from './Navbar.module.sass'

interface NavbarProps {
    className?: string
}

const Navbar = ({ className }: NavbarProps) => {
    const { data } = useFetch<Menu>('menu')
    const [isCookieOpen, setIsCookieOpen] = useState(false)

    const transformedData = useMemo(() => {
        if (!data) return null

        return {
            ...data,
            policies: data.policies?.map((policy) => ({
                ...policy,
                file_url: getMediaUrl(policy.file_url)
            }))
        }
    }, [data])

    // Находим cookie политику
    const cookiePolicy = useMemo(() => {
        return transformedData?.policies?.find(
            (policy) => policy.policy_type === 'personal_data_consent'
        )
    }, [transformedData?.policies])

    const checkCookiePolicy = useCallback(() => {
        const cookieStatus = checkCookie('cookie_policy__asfp')
        // Показываем popup, если cookie нет (undefined) и есть политика
        if (cookieStatus === undefined && cookiePolicy) {
            setIsCookieOpen(true)
        }
    }, [cookiePolicy])

    useEffect(() => {
        const timer = setTimeout(() => {
            checkCookiePolicy()
        }, 0)

        return () => clearTimeout(timer)
    }, [checkCookiePolicy])

    const navbarContent = useMemo(() => {
        if (!transformedData) return null

        return (
            <div role="navigation" className={className || ''}>
                <NavMenu>
                    <Col gap="sm" align="baseline" justify="start" className={cls.navmenu}>
                        <Flex gap="xs" justify="between" fullWidth style={{ marginBottom: 'auto' }}>
                            <Col gap="sm" className={cls.navitems}>
                                {transformedData.pages?.map((item) => (
                                    <NavItem key={item.path} {...item} />
                                ))}
                            </Col>

                            {transformedData.socials && (
                                <SocialLinks socials={transformedData.socials} />
                            )}
                        </Flex>

                        <Col gap="xs" className={cls.navbar__links}>
                            {transformedData.contact && (
                                <ContactItem
                                    item={transformedData.contact}
                                    className={cls.contact}
                                />
                            )}

                            <PolicyLinks policies={transformedData.policies} />
                        </Col>
                    </Col>
                </NavMenu>
            </div>
        )
    }, [transformedData, className])

    if (!transformedData) return null

    return (
        <>
            {navbarContent}
            {cookiePolicy && isCookieOpen && (
                <CookiePopup file={cookiePolicy.file_url} onClose={() => setIsCookieOpen(false)} />
            )}
        </>
    )
}

export default Navbar

// Компонент для социальных сетей
const SocialLinks = memo(({ socials }: { socials: Social[] }) => {
    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const element = e.currentTarget
        // Убираем анимацию
        element.style.animation = 'none'
        // Принудительно перерисовываем
        element.offsetHeight
        // Возвращаем анимацию
        element.style.animation = ''
    }

    return (
        <Col gap="xs" align="end" className={cls.socials}>
            <style>
                {socials.map((_, idx) => (
                    <Fragment key={idx}>{`
                        a:nth-child(${idx + 2})::after {
                            animation-delay: ${600 + idx * 200}ms;
                        }
                        a:nth-child(${idx + 2})::before {
                            animation-delay: ${1000 + idx * 200}ms;
                        }
                    `}</Fragment>
                ))}
            </style>
            {socials.map(({ name, title, link, image }, idx) => (
                <a
                    key={'social-' + name}
                    href={link}
                    target="_blank"
                    className={image ? cls.social__image__link : cls.social__link}
                    style={{ animationDelay: `${1000 + idx * 200}ms` }}
                    onMouseEnter={handleMouseEnter}
                >
                    <LazyImage
                        src={image || `/images/socials/${name}.webp`}
                        alt={title}
                        sizes="100%"
                        loading="eager"
                        fill
                    />
                </a>
            ))}
        </Col>
    )
})

SocialLinks.displayName = 'SocialLinks'

// Компонент для политик
const PolicyLinks = memo(({ policies }: { policies?: Policy[] }) => {
    return (
        <>
            {policies?.map((policy) => (
                <div key={'policy-' + policy.id} className="small">
                    <a href={policy.file_url} target="_blank" className={cls.policy}>
                        {policy.title}
                    </a>
                    {policy.description && <p>{policy.description}</p>}
                </div>
            ))}
        </>
    )
})

PolicyLinks.displayName = 'PolicyLinks'
