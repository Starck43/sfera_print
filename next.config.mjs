import withBundleAnalyzer from '@next/bundle-analyzer'

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    trailingSlash: true,
    reactStrictMode: true,
    productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        // contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;',
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
                hostname: '*.mail.ru',
                port: ''
            },
            {
                protocol: 'https',
                hostname: '*.postimg.cc',
                port: ''
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8005'
            }
        ],
        // minimumCacheTTL: 60 * 60 * 24 * 30
    },
    logging:
        process.env.NODE_ENV === 'development'
            ? {
                fetches: {
                    fullUrl: true
                }
            }
            : {},
    eslint: {
        ignoreDuringBuilds: true
    },
    experimental: {
        //optimizeCss: true,
        scrollRestoration: true,
        globalNotFound: true
    },
    allowedDevOrigins: ['192.168.1.*', '*.local-origin.dev'],
    sassOptions: {
        outputStyle: 'expanded'
    },
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js'
            }
        }
    },
    compress: true,
    poweredByHeader: false
}

export default withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true'
})(nextConfig)
