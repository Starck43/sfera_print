import React, { useEffect, useRef, useState } from 'react'

import { checkCookie, setCookie } from '@/shared/lib/helpers/cookie'
import { classnames } from '@/shared/lib/helpers/classnames'
import { notifyConsentDeclined, notifyConsentGranted } from '@/shared/lib/metrika'
import { Button } from '@/shared/ui/button'
import { NavLink } from '@/shared/ui/link'
import { Col, Flex } from '@/shared/ui/stack'

import cls from './CookiePopup.module.sass'

interface CookiePopupProps {
    file: string
    onClose: () => void
}

const CookiePopup = ({ file, onClose }: CookiePopupProps) => {
    const approved_policy = checkCookie('cookie_policy__asfp')
    const [visible, setVisible] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // Если уже есть решение (true или false) — не показываем
        if (approved_policy !== undefined && file) {
            window.open(file, '_blank')
            return
        }

        timerRef.current = setTimeout(() => {
            setVisible(true)
        }, 2000)

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [approved_policy, file])

    const handleAccept = () => {
        // Согласие на cookie
        setCookie('cookie_policy__asfp', 'true', 365)
        setVisible(false)

        // После согласия можно запрашивать ClientID Метрики
        notifyConsentGranted()

        timerRef.current = setTimeout(() => {
            onClose()
        }, 600)
    }

    const handleDecline = () => {
        // Отказ от cookie — ставим флаг, чтобы не показывать снова
        setCookie('cookie_policy__asfp', 'false', 365)

        // Сообщаем счётчику Метрики, что cookie собирать нельзя.
        // Счётчик поднимается на каждой странице, поэтому отказ из
        // прошлого визита тоже нужно учесть — это делает сам модуль.
        notifyConsentDeclined()

        setVisible(false)

        timerRef.current = setTimeout(() => {
            onClose()
        }, 600)
    }

    // Очистка таймера при размонтировании
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [])

    return (
        <div className={classnames(cls, ['cookie__popup'], { visible })}>
            <Flex gap="xs" align="baseline">
                <p>
                    Продолжая пользоваться сайтом, Вы{' '}
                    {!approved_policy ? 'соглашаетесь' : 'согласились'} с использованием
                    файлов&nbsp;
                    <NavLink href={file} title="cookie" target="_blank" rel="noopener noreferrer" />
                    .
                </p>
                <Col gap="auto" align="end" className={cls.btn__group}>
                    <Button size="small" feature="inverted" bordered rounded onClick={handleAccept}>
                        {!approved_policy ? 'Принять' : 'ОК'}
                    </Button>
                    {!approved_policy && (
                        <Button size="small" bordered rounded onClick={handleDecline}>
                            Отказаться
                        </Button>
                    )}
                </Col>
            </Flex>
        </div>
    )
}

export default CookiePopup
