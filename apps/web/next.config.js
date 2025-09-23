/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    serverExternalPackages: ["postgres", "drizzle-orm"],
    images: {
        domains: ["localhost"],
        unoptimized: true,
    },
    transpilePackages: ["@inovacode/db"],
    webpack: (config) => {
        config.externals.push({
            "pg-native": "pg-native",
            "pg-query-stream": "pg-query-stream",
        });
        return config;
    },
};

export default nextConfig;
