/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Disable all i18n routing - we'll handle language selection in the app
  i18n: undefined,
  // Explicitly use App Router
  appDir: true,
}

module.exports = nextConfig
