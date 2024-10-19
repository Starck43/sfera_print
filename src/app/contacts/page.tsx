import 'server-only'

import { Metadata, ResolvingMetadata } from 'next'

import PageLayout from '@/components/layout/page-layout'
import { type Contact, Contacts } from '@/components/contacts'
import { htmlParser } from '@/components/html-parser'

import constructMetadata from '@/shared/lib/helpers/metadata'
import { getPage } from '@/shared/lib/api'
import { Section } from '@/shared/ui/section'
import { Col } from '@/shared/ui/stack'

import type { Page } from '../types'
import cls from './ContactsPage.module.sass'
import { Header } from '@/shared/ui/header'

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    const data = await getPage<Page<Contact>>('contacts')
    return constructMetadata(data, await parent)
}

const ContactsPage = async () => {
    const { title, content = null, sections } = await getPage<Page<Contact>>('contacts')
    const parsedContent = htmlParser(content)

    return (
        <PageLayout title={title} gap="none" sectionMode className="contacts-page">
            <Section gap={'xl'} align="center" style={{ paddingTop: 0 }}>
                {parsedContent && (
                    <Section as="div" className="html-container">
                        {parsedContent}
                    </Section>
                )}

                <Col gap="xs" align="center" className={cls.contacts__block}>
                    <Header tag="h3" title="Связаться с нами" transform="upperFirst" className={cls.contacts__title}/>
                    <Contacts data={sections as Contact[]} />
                </Col>

                {/*Bitrix24 form script*/}
                <code className={cls.bitrix__form}>
                <div dangerouslySetInnerHTML={{ __html:
                        `<script data-b24-form="inline/37/5moh7g" data-skip-moving="true">
                            (function(w,d,u){
                                var s=d.createElement('script');
                                s.async=true;s.src=u+'?'+(Date.now()/180000|0);
                                var h=d.getElementsByTagName('script')[0];
                                h.parentNode.insertBefore(s,h);
                            })(window,document,'https://cdn-ru.bitrix24.ru/b20292920/crm/form/loader_37.js');
                        </script>`
                    }}
                />
                </code>
            </Section>
        </PageLayout>
    )
}

export default ContactsPage
