/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['uploadthing.com', 'utfs.io'],
  },
};

module.exports = nextConfig;
