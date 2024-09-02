import 'server-only'

import {Metadata, ResolvingMetadata} from "next"

import PageLayout from "@/components/layout/page-layout"
import {type Contact, Contacts} from "@/components/contacts"
import constructMetadata from "@/shared/lib/helpers/metadata"
import {getPage} from "@/shared/lib/api"

import {Section} from "@/shared/ui/section"
import {Col} from "@/shared/ui/stack"

import type {Page} from "../types"
import cls from "./ContactsPage.module.sass"


export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
	const data = await getPage<Page<Contact>>('contacts')
	return constructMetadata(data, await parent)
}


const ContactsPage = async () => {
	const {title, content = null, sections} = await getPage<Page<Contact>>('contacts')
	return (
		<PageLayout
			title={title}
			gap='none'
			sectionMode
			className='contacts-page'
		>
			<Section gap={'none'} align='center' style={{paddingTop: 0}}>
				{content &&
                    <div dangerouslySetInnerHTML={{__html: content}}/>
				}
				<Col gap='xs' className={cls.contacts__block}>
					<Contacts data={sections as Contact[]}/>
				</Col>
				Форма Битрикс
			</Section>
		</PageLayout>
	)
}

export default ContactsPage
