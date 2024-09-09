import { memo } from 'react'
import type { Contact } from './types'
import ContactItem from './ContactItem'

const Contacts = ({ data }: { data: Contact[] | undefined }) => {
    return data?.map((item, key) => (
        <div key={key} className={`contacts__${item.type}`}>
            <ContactItem item={item} />
        </div>
    ))
}

export default memo(Contacts)
