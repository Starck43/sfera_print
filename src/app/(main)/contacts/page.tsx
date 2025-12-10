import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import PageLayout from '@/components/layout/page-layout'
import { type Contact, Contacts } from '@/components/contacts'
import { htmlParser } from '@/components/html-parser'
import { BitrixForm } from '@/components/bitrix'

import getPage from '@/shared/lib/api/getPage'
import constructMetadata from '@/shared/lib/helpers/metadata'
import { Section } from '@/shared/ui/section'
import { Col } from '@/shared/ui/stack'
import { Header } from '@/shared/ui/header'

import type { Page } from '../../types'
import cls from './ContactsPage.module.sass'

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    const data = await getPage<Page<Contact>>('contacts')

    if (!data) {
        notFound()
    }

    return constructMetadata(data, await parent)
}

const ContactsPage = async () => {
    const { title, content = null, sections } = await getPage<Page<Contact>>('contacts')

    if (!content && !sections) {
        notFound()
    }

    const parsedContent = htmlParser(content)

    return (
        <Suspense>
            <PageLayout title={title} gap="none" sectionMode className="contacts-page">
                <Col as="section" gap={'md'} align="center" fullWidth style={{ padding: 0 }}>
                    {parsedContent && (
                        <Section
                            as="div"
                            gap={'none'}
                            className="html-container"
                            style={{ paddingTop: 0 }}
                        >
                            {parsedContent}
                        </Section>
                    )}

                    <Col gap="xs" align="center" className={cls.contacts__block}>
                        <Header
                            tag="h3"
                            title="Связаться с нами"
                            transform="upperFirst"
                            className={cls.contacts__title}
                        />
                        <Contacts data={sections as Contact[]} />
                    </Col>

                    {/*Bitrix24 form script*/}
                    <div className={cls.bitrix__form}>
                        <Header
                            tag="h3"
                            title="Форма обратной связи"
                            transform="upperFirst"
                            align="center"
                            className={cls.contacts__title}
                        />

                        <BitrixForm
                            fallbackContact={
                                Array.isArray(sections)
                                    ? sections.find((section: Contact) => section.type === 'email')
                                    : sections
                            }
                        />
                    </div>
                </Col>
            </PageLayout>
        </Suspense>
    )
}

export default ContactsPage
