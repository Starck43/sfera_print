import 'server-only'

import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import PageLayout from '@/components/layout/page-layout'
import { type Contact, Contacts, BitrixForm } from '@/components/contacts'
import { htmlParser } from '@/components/html-parser'

import constructMetadata from '@/shared/lib/helpers/metadata'
import { getPage } from '@/shared/lib/api'
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
        <PageLayout title={title} gap="none" sectionMode className="contacts-page">
            <Col as="section" gap={'md'} align="center" style={{ padding: 0 }}>
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
                    <BitrixForm />
                </div>
            </Col>
        </PageLayout>
    )
}

export default ContactsPage
