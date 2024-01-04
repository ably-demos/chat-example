/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@ably-labs/chat"],
  swcMinify: true,
}

export default nextConfig
