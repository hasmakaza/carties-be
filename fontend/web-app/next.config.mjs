/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },
    images:{
        domains:['cdn.pixabay.com','th.bing.com']
    },
    output: 'standalone'
};

export default nextConfig;
