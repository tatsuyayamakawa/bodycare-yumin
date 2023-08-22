/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NEXT_PUBLIC_NODE_ENV === 'development',
});

const nextConfig = withPWA({
  reactStrictMode: true,
});

module.exports = nextConfig;
