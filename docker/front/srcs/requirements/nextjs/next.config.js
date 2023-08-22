/** @type {import('next').NextConfig} */

module.exports = {
  // output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  experimental: { appDir: true },
  compiler: {
    styledComponents: true,
  },
};
