/** @type {import('next').NextConfig} */

module.exports = {
  // 베포 전용 옵션
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  experimental: { appDir: true },
  compiler: {
    styledComponents: true,
  },
};
