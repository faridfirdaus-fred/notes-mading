/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ngrok-free.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ngrok-free.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ngrok.io',
        pathname: '/**',
      },
    ],
  },
  // Disable response compression for better proxy handling
  compress: false,
  // Allow proxy/tunneling
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
        ],
      },
    ];
  },
  // Disable Next.js caching in production
  experimental: {
    disableOptimizedLoading: true,
  },
};

export default nextConfig;
