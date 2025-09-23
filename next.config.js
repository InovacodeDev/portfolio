/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ["postgres", "drizzle-orm"],
    images: {
        domains: ["localhost"],
        unoptimized: true,
    },
    // Remove transpilePackages as we no longer have workspace packages
    webpack: (config) => {
        config.externals.push({
            "pg-native": "pg-native",
            "pg-query-stream": "pg-query-stream",
        });
        return config;
    },
};

export default nextConfig;
