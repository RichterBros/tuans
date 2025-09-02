/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 13+
  images: {
    domains: ['images.ctfassets.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
    ],
  },
}

module.exports = nextConfig 