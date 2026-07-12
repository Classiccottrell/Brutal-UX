import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // basePath is injected by actions/configure-pages in the Pages workflow
}

export default nextConfig
