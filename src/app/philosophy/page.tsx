import { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'

import PageLayout from '@/components/layout/page-layout'
import { parseHtml } from '@/components/parse-html'

import getPage from '@/shared/lib/api/getPage'
import { classnames } from '@/shared/lib/helpers/classnames'
import constructMetadata from '@/shared/lib/helpers/metadata'
import { Section } from '@/shared/ui/section'

import type { Page } from '../types'
import type { Achievement, Partner, Stat } from './types'
import { calculatePercentByGroup } from './statistics/helper'
import { Achievements } from './achievements/Achievements'
import CommonStat from './statistics/CommonStat'
import ClientsStat from './statistics/ClientsStat'
import { Partners } from './partners/Partners'

import cls from './Philosophy.module.sass'

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    const data = await getPage<Page<any>>('philosophy')
    return constructMetadata(data, await parent)
}

const PhilosophyPage = async () => {
    const {
        content = null,
        title,
        sections: { achievements, stat, partners }
    } = await getPage<Page<any>>('philosophy')

    const parsedContent = parseHtml(content)

    return (
        <PageLayout title={title} gap="none" sectionMode className="philosophy-page">
            {parsedContent && (
                <Section
                    gap="none"
                    className={classnames(cls, ['section'], {}, ['html-container'])}
                    //style={{ paddingTop: 0 }}
                >
                    {parsedContent}
                </Section>
            )}
            <Section
                title={'Наши достижения'}
                titleTag="h2"
                align="start"
                transform="lowerCase"
                className={classnames(cls, ['section'], {}, ['grey__style'])}
            >
                <Achievements data={achievements as Achievement[]} />
            </Section>

            <Section
                title={'Причины выбрать нас'}
                titleTag="h2"
                align="end"
                transform="lowerCase"
                className={classnames(cls, ['section'], {}, ['darkgrey__style'])}
            >
                <div className={cls.diagram__container}>
                    <Image
                        src={'/images/target_image.png'}
                        alt="Причины выбрать нас"
                        fill
                        style={{ left: '-3%' }}
                    />
                    <CommonStat data={stat as Stat[]} />
                </div>
            </Section>

            <Section
                title={'Наши заказчики'}
                titleTag="h2"
                align="center"
                transform="lowerCase"
                gap={'none'}
                className={classnames(cls, ['section'])}
            >
                <div className={cls.diagram__container}>
                    <Image src={'/images/logo3d.png'} alt="Наши заказчики" fill />
                    <ClientsStat data={calculatePercentByGroup(partners)} />
                </div>
            </Section>

            <Section
                align="center"
                gap={'none'}
                className={classnames(cls, ['section'])}
                style={{ paddingTop: 0 }}
            >
                <Partners data={partners as Partner[]} />
            </Section>
        </PageLayout>
    )
}

export default PhilosophyPage
