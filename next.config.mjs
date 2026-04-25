/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // Turbopack ko disable karo
    turbo: false,
  },
};

export default nextConfig;
