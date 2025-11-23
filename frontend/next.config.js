let userConfig = {};
try {
    userConfig = require("./v0-user-next.config");
} catch (e) {
    // ignore missing user config
}

/** @type {import('next').NextConfig} */
let nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    experimental: {
        webpackBuildWorker: true,
        parallelServerBuildTraces: true,
        parallelServerCompiles: true,
    },

    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:5000/:path*",
            },
        ];
    },
};

mergeConfig(nextConfig, userConfig);

function mergeConfig(base, user) {
    if (!user) return;
    for (const key in user) {
        if (
            typeof base[key] === "object" &&
            !Array.isArray(base[key])
        ) {
            base[key] = { ...base[key], ...user[key] };
        } else {
            base[key] = user[key];
        }
    }
}

// 🔥 Correct CJS export — must export a function for async rewrites to work
module.exports = () => nextConfig;
