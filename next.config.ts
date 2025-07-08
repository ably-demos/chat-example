import path from "path"
import type { NextConfig } from "next"
import dotenv from "dotenv"

dotenv.config({ path: path.resolve(process.cwd(), "./.env") })

const nextConfig: NextConfig = {
  reactStrictMode: false,
  env: {
    ABLY_API_KEY: process.env.ABLY_API_KEY,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
