// ws관련 에러뜰 때
// https://github.com/netlify/netlify-lambda/issues/179#issuecomment-1613183143

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['uploadthing.com', 'utfs.io'],
  },
  experimental: {
    serverActions: true,
  },
  reactStrictMode: true,
};

module.exports = {
  ...nextConfig,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals.push({
        bufferutil: 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
        'supports-color': 'supports-color',
      });
    }

    return config;
  },
};
