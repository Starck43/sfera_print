import { lazy, Suspense, SVGProps } from 'react'
import { classnames } from '@/shared/lib/helpers/classnames'

import cls from './Icon.module.sass'

interface IconProps extends SVGProps<SVGSVGElement> {
    className?: string
    iconName: string
}

export const Icon = (props: IconProps) => {
    const { className, iconName, ...other } = props
    const LazyIcon = lazy(
        () =>
            import(
                /* @vite-ignore */
                `/src/shared/assets/icons/${iconName}.svg?react`
            )
    )

    return (
        <Suspense fallback={null}>
            <LazyIcon
                className={classnames(cls, ['icon', 'svg-icon'], {}, [
                    className
                ])}
                {...other}
            />
        </Suspense>
    )
}
