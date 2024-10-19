'use client'

import React from 'react'
import { Bitrix24Form } from 'react-bitrix24-form'

const BitrixForm = () => {
    const src = process.env.NEXT_PUBLIC_BITRIX_FORM_SRC
    const data = process.env.NEXT_PUBLIC_BITRIX_FORM_DATA
    if (!src || !data) return null

    return (
        <Bitrix24Form
            src={src}
            data={data}
        />
    )
}

export default BitrixForm
