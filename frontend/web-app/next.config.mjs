/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            enabled: true
        }
    },
    images: {
        domains: ['cdn.pixabay.com', 'th.bing.com']
    },
    output: 'standalone'
};

export default nextConfig;
