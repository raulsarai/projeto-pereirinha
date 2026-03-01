/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // O Next.js 16 gerencia o lint de forma diferente. 
  // Remova o bloco 'eslint' daqui para evitar o erro de 'Unrecognized key'.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;