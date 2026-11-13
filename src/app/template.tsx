import PageHeader from '@/components/page-header'
import { BrandLogo } from '@/components/brand-logo'
import { BurgerButton, Navbar } from '@/components/navbar'
import type { PostType } from '@/components/post'

import { getFeatures } from '@/shared/lib/api'

export default async function Template({ children }: { children: React.ReactNode }) {
    // Карусель на главной должна приходить в HTML с сервера: первый кадр является
    // LCP-элементом и не должен ждать гидрации клиента.
    const features = await getFeatures<PostType>().catch(() => [] as PostType[])

    return (
        <>
            <header id="header">
                <BrandLogo />
                <BurgerButton />
                <Navbar className="navbar" />
            </header>
            <main id="main">
                <PageHeader items={features} />
                {children}
            </main>
        </>
    )
}
