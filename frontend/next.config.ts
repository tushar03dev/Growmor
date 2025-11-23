/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        localPatterns: [
            {
                pathname: "/**", // match any file
            },
            {
                pathname: "/**",
                search: "*", // match any ?query=value
            }
        ]
    }
};

module.exports = nextConfig;
