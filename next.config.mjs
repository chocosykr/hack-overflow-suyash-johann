/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This forces Turbopack to treat Prisma as a Node.js-only package
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

export default nextConfig;