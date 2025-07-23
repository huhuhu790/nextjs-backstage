import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["@confluentinc/kafka-javascript"],
    experimental: {
        nodeMiddleware: true,
    }
};

export default nextConfig;
