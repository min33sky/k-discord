// ws관련 에러뜰 때
// https://github.com/netlify/netlify-lambda/issues/179#issuecomment-1613183143

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    });
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['uploadthing.com', 'utfs.io'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
