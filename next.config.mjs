/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
    },
    images: {
      domains: ['assets.b365api.com'], // Add your external domains here
    },
};

export default nextConfig;
