import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        nodeMiddleware: true,
    },
    async redirects() {
        return [
            // Basic redirect
            {
                source: '/',
                destination: process.env.SYSTEM_PREFIX!,
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
