import withBundleAnalyzer from '@next/bundle-analyzer'

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    productionBrowserSourceMaps: false,
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        deviceSizes: [50, 320, 576, 768, 992, 1200, 1400, 1920],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.sfera-print.ru',
                port: '',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
            },
        ],
        minimumCacheTTL: 60 * 60 * 24 * 365,
    },
    experimental: {
        cssChunking: 'loose', // default
    },
    webpack(config, {isServer}) {
        if (isServer) {
            config.devtool = 'eval-source-map'
        }

        const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.(".svg"));

        config.module.rules.push(
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/,
            },
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: {not: [...fileLoaderRule.resourceQuery.not, /url/]}, // exclude if *.svg?url
                use: ["@svgr/webpack"],
            },
        );

        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    },
}

export default withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})(nextConfig);
//export default nextConfig;
