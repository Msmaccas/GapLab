/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  // When exporting static site the base path can be configured via
  // NEXT_PUBLIC_API_BASE_URL. The client will fetch from this URL
  // at runtime.
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || ''
  }
};

module.exports = nextConfig;