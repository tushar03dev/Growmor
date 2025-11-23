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
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "growmor-bucket.s3.ap-south-1.amazonaws.com",
                pathname: "/**",
            },
        ]
    }
};

module.exports = nextConfig;
