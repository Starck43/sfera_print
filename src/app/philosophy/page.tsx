import { Metadata, ResolvingMetadata } from 'next'

import PageLayout from '@/components/layout/page-layout'

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

export const generateMetadata = async (
    _: any,
    parent: ResolvingMetadata
): Promise<Metadata> => {
    const data = await getPage<Page<any>>('philosophy')
    return constructMetadata(data, await parent)
}

const PhilosophyPage = async () => {
    const {
        content = null,
        title,
        sections: { achievements, stat, partners }
    } = await getPage<Page<any>>('philosophy')
    return (
        <PageLayout
            title={title}
            gap="none"
            sectionMode
            className="philosophy-page"
        >
            {content && (
                <Section className={cls.section}>
                    <div
                        dangerouslySetInnerHTML={{ __html: content }}
                        className={cls.desc}
                    />
                </Section>
            )}
            <Section
                title={'Наши достижения'}
                titleTag="h2"
                align="end"
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
                className={classnames(cls, ['section'], {}, ['green__style'])}
            >
                <CommonStat data={stat as Stat[]} />
            </Section>

            <Section
                title={'Наши заказчики'}
                titleTag="h2"
                align="center"
                transform="upperCase"
                gap={'none'}
                className={classnames(cls, ['section'], {}, [])}
            >
                <ClientsStat data={calculatePercentByGroup(partners)} />
            </Section>

            <Section
                align="center"
                gap={'none'}
                className={classnames(cls, ['section'], {}, [])}
                style={{ paddingTop: 0, marginBottom: '1rem' }}
            >
                <Partners data={partners as Partner[]} />
            </Section>
        </PageLayout>
    )
}

export default PhilosophyPage
