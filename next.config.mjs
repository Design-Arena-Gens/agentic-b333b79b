/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'agentic-b333b79b.vercel.app'
      ]
    }
  }
};

export default nextConfig;
