/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build autonome pour une image Docker minimale.
  output: 'standalone',
  async rewrites() {
    // Proxy les appels navigateurs vers l'API NestJS (évite les problèmes de CORS)
    const apiUrl = process.env.API_URL ?? 'http://localhost:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
