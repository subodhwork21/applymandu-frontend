/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Or specify particular IPs/domains like 'http://192.168.1.100:3000'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  
  // If you need to specify which hosts can access your app
  async rewrites() {
    return {
      beforeFiles: [
        // Allow requests from specific local IPs
        {
          source: '/api/:path*',
          destination: '/api/:path*',
          has: [
            {
              type: 'host',
              value: '192.168.1.5|localhost:3000|127.0.0.1:3000',
            },
          ],
        },
      ],
    };
  },

};

module.exports = nextConfig;
