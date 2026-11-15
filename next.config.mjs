/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.31.98'],
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  transpilePackages: ['gsap'],
}

export default nextConfig
