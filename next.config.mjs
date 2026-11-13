import withBundleAnalyzer from '@next/bundle-analyzer'

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    trailingSlash: true,
    skipProxyUrlNormalize: true,
    reactCompiler: true,
    cacheComponents: true,
    partialPrefetching: true,
    productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
    images: {
        dangerouslyAllowLocalIP: true,
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
                protocol: 'https',
                hostname: '*.twc1.net'
            },
            {
                protocol: 'http',
                hostname: 'localhost'
            }
        ]
        // minimumCacheTTL: 60 * 60 * 24 * 30
    },
    // Проксирование запросов к API бэкенда выполняет src/proxy.ts:
    // адрес бэкенда известен только на сервере (API_SERVER)
    logging:
        process.env.NODE_ENV === 'development'
            ? {
                fetches: {
                    fullUrl: true
                }
            }
            : {},
    experimental: {
        //optimizeCss: true,
        turbopackFileSystemCacheForDev: true,
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
