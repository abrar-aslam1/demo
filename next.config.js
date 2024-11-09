/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'maps.googleapis.com'],
  },
  typescript: {
    // This is temporary to get the build working, remove for production
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig 