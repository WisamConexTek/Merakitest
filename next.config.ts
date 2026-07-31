import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* The parent folder is its own git repo, so Turbopack would otherwise infer
     the workspace root one level up — where there is no node_modules — and fail
     to resolve `tailwindcss` from globals.css. */
  turbopack: {
    root: process.cwd(),
  },
  outputFileTracingRoot: process.cwd(),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
