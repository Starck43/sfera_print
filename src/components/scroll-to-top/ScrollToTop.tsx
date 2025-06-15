'use client'
import { RefObject, useEffect, useMemo, useRef, useState } from 'react'

import { classnames } from '@/shared/lib/helpers/classnames'
import { useScrollPosition } from '@/shared/lib/hooks/useScrollPosition'
import { Button } from '@/shared/ui/button'

import TopIcon from '@/svg/arrow-top.svg'
import cls from './ScrollToTop.module.sass'

const ScrollToTop = () => {
    const scrollRef = useRef(null) as RefObject<HTMLButtonElement>
    const [container, setContainer] = useState<HTMLElement | null>(null)
    const scroll = useScrollPosition(container)

    useEffect(() => {
        if (scrollRef.current) {
            setContainer(scrollRef.current.parentElement)
        }
    }, [scrollRef])

    //console.log(scrollRef)
    const scrollToTop = () => {
        container?.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return useMemo(
        () => (
            <Button
                ref={scrollRef}
                Icon={<TopIcon />}
                feature="inverted"
                bordered
                rounded
                size="medium"
                onClick={scrollToTop}
                className={classnames(cls, [
                    'scroll_to_top',
                    scroll?.reachedTarget ? 'visible' : ''
                ])}
            />
        ),
        [scroll?.reachedTarget, scrollToTop]
    )
}

export default ScrollToTop
