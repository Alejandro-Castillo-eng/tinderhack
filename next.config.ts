import type { NextConfig } from "next";

// En GitHub Pages la app vive en https://<usuario>.github.io/<repo>/, así que el workflow
// define NEXT_PUBLIC_BASE_PATH="/tinderhack". En local queda vacío.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
