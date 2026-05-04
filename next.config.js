/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // i18n routing handled in middleware, not in next.config
}

module.exports = nextConfig
