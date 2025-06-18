/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      "i.pinimg.com",
      "knight-fall.vercel.app",
      "cdn.anotherhost.net",
      // Add any other domains you use for game images
    ],
  },
  env: {
    // Clerk variables
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    
    // Database
    DATABASE_URL: process.env.DATABASE_URL,
    
    // API URL - use Vercel's automatically provided URL in production
    NEXT_PUBLIC_API_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api`
      : process.env.NEXT_PUBLIC_API_URL,
  },
  webpack: (config) => {
    config.externals.push({
      'pg-hstore': 'commonjs pg-hstore',
      pg: 'commonjs pg',
    });
    return config;
  }
}

export default nextConfig;