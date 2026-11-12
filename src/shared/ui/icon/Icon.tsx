import { lazy, Suspense, type ComponentType, type SVGProps } from 'react'
import { classnames } from '@/shared/lib/helpers/classnames'

import cls from './Icon.module.sass'

interface IconProps extends SVGProps<SVGSVGElement> {
    className?: string
    iconName: string
}

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

// Кэш ленивых иконок: компонент не пересоздаётся при каждом рендере
const iconCache = new Map<string, IconComponent>()

const loadIcon = (iconName: string): IconComponent => {
    const cached = iconCache.get(iconName)
    if (cached) return cached

    const component = lazy(() => import(`@/svg/${iconName}.svg`)) as IconComponent
    iconCache.set(iconName, component)

    return component
}

// Компонент вынесен на уровень модуля, чтобы не создавать его во время рендера
const IconRenderer = ({
    component: Component,
    ...other
}: { component: IconComponent } & SVGProps<SVGSVGElement>) => <Component {...other} />

export const Icon = (props: IconProps) => {
    const { className, iconName, ...other } = props

    return (
        <Suspense fallback={null}>
            <IconRenderer
                component={loadIcon(iconName)}
                className={classnames(cls, ['icon', 'svg-icon'], {}, [className])}
                {...other}
            />
        </Suspense>
    )
}
