import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  turbopack: {}, // Suppress webpack config warning
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withPWA(nextConfig);
