import withBundleAnalyzer from '@next/bundle-analyzer'

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;',
        deviceSizes: [50, 320, 576, 768, 992, 1200, 1400],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.istarck.ru',
                port: ''
            },
            {
                protocol: 'https',
                hostname: '*.yandex.ru',
                port: ''
            },
            {
                protocol: 'https',
                hostname: 'i.postimg.cc',
                port: ''
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000'
            }
        ],
        minimumCacheTTL: 60 * 60 * 24 * 30,
    },
    logging:
        process.env.NODE_ENV === 'development'
            ? {
                fetches: {
                    fullUrl: true
                }
            }
            : {},
    experimental: {
        cssChunking: 'loose' // default
    },
    sassOptions: {
        outputStyle: 'expanded'
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    webpack(config, { dev }) {
        if (dev) {
            Object.defineProperty(config, 'devtool', {
                get() {
                    return 'source-map'
                },
                set() {
                }
            })
        }

        const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'))

        config.module.rules.push(
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/
            },
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: {
                    not: [...fileLoaderRule.resourceQuery.not, /url/]
                }, // exclude if *.svg?url
                use: ['@svgr/webpack']
            }
        )

        fileLoaderRule.exclude = /\.svg$/i

        return config
    }
}

export default withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true'
})(nextConfig)
