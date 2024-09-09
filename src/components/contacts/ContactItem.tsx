import { memo } from 'react'
import type { Contact } from './types'

import { NavLink } from '@/shared/ui/link'

interface ContactItemProps {
    item: Contact
    className?: string
}

const ContactItem = ({ item, className }: ContactItemProps) => {
    return item.link ? (
        <NavLink
            title={item.value}
            href={item.link}
            alt={item.value}
            Icon={`/svg/${item.type}.svg`}
            target={
                item.type === 'email' || item.type === 'tel'
                    ? undefined
                    : '_blank'
            }
            className={className}
        />
    ) : (
        item.value
    )
}

export default memo(ContactItem)
