import React, { useEffect, useRef, useState } from 'react'

import { checkCookie, setCookie } from '@/shared/lib/helpers/cookie'
import { classnames } from '@/shared/lib/helpers/classnames'
import { Button } from '@/shared/ui/button'
import { NavLink } from '@/shared/ui/link'
import { Col } from '@/shared/ui/stack'

import cls from './CookiePopup.module.sass'

interface CookiePopupProps {
    file: string
    onClose: () => void
}

const CookiePopup = ({ file, onClose }: CookiePopupProps) => {
    const approved_policy = checkCookie('cookie_policy')
    const [visible, setVisible] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (approved_policy && file) {
            window.open(file, '_blank')
        }

        timerRef.current = setTimeout(
            () => {
                setVisible(true)
            },
            !approved_policy ? 2000 : 0
        )

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [approved_policy, file])

    const handleClose = () => {
        setCookie('cookie_policy__asfp', 'true', 365)
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
            <Col gap="xs" align="end">
                <p>
                    Продолжая пользоваться сайтом, Вы{' '}
                    {!approved_policy ? 'соглашаетесь' : 'согласились'} с использованием файлов
                    cookie. Ознакомиться с политикой можно &nbsp;
                    <NavLink href={file} title="здесь" target="_blank" rel="noopener noreferrer" />.
                </p>
                <Button size="small" feature="inverted" bordered rounded onClick={handleClose}>
                    {!approved_policy ? 'Принять' : 'ОК'}
                </Button>
            </Col>
        </div>
    )
}

export default CookiePopup
