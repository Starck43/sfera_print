import { Metadata, ResolvingMetadata } from 'next'

import { JsonLd } from '@/components/json-ld'
import { VideoPlayer } from '@/shared/ui/video-player'

import constructMetadata from '@/shared/lib/helpers/metadata'
import { PAGE_DESCRIPTIONS, PAGE_TITLES } from '@/shared/const/seo'
import { jsonLdGraph, localBusinessJsonLd, organizationJsonLd } from '@/shared/lib/helpers/seo'

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    return constructMetadata(
        {
            title: PAGE_TITLES.home,
            description: PAGE_DESCRIPTIONS.home,
            path: '/',
            type: 'website'
        },
        await parent
    )
}

const isDev = process.env.NODE_ENV === 'development'

const Home = () => {
    return (
        <>
            <JsonLd data={jsonLdGraph([organizationJsonLd(), localBusinessJsonLd()])} />

            <section className="visually-hidden" aria-label="О компании">
                <h1>
                    Производство рекламы полного цикла: наружная, интерьерная реклама и рекламная
                    продукция
                </h1>
                <p>
                    «Атмосфера Пространств» — федеральная производственная компания полного цикла.
                    Собственное производство в Кирове: 3000 кв. м площадей, более 50 единиц
                    современного оборудования, штат из 100+ специалистов и 5 бригад по монтажу.
                </p>
                <p>
                    Мы разрабатываем дизайн и фирменный стиль, проектируем и изготавливаем вывески,
                    световые конструкции, объёмные буквы, навигацию и элементы оформления интерьера,
                    готовим документацию для тендеров и выполняем монтаж по всей России — от
                    Калининграда до Владивостока.
                </p>
                <p>
                    Производство и офис: Киров, ул. Ломоносова, 5А. Телефон +7 (8332) 211-011, email
                    welcome@asfp.pro.
                </p>
            </section>

            <VideoPlayer
                src={{
                    608: '/videos/atmo-h-video.mp4',
                    portrait: '/videos/atmo-v-video.mp4',
                    landscape: '/videos/atmo-h-video.mp4',
                    default: '/videos/atmo-h-video.mp4'
                }}
                autoPlay={!isDev}
                controls={false}
                loop={!isDev}
                style={{ width: '100%', height: '100%' }}
            />
        </>
    )
}

export default Home
