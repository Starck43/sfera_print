import { lazy, memo, Suspense } from 'react'
import type { Contact } from './types'

import { NavLink } from '@/shared/ui/link'

interface ContactItemProps {
    item: Contact
    className?: string
}

const ContactItem = ({ item, className }: ContactItemProps) => {
    const Icon = lazy(() => import(`@/svg/${item.type}.svg`))
    
    return item.link ? (
        <NavLink
            title={item.value}
            href={item.link}
            alt={item.value}
            Icon={() => (
                <Suspense fallback={null}>
                    <Icon />
                </Suspense>
            )}
            target={item.type === 'email' || item.type === 'tel' ? undefined : '_blank'}
            className={className}
        />
    ) : (
        item.value
    )
}

export default memo(ContactItem)
