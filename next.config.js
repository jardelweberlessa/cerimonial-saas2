/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'lib/supabaseClient$': path.resolve(__dirname, 'lib/supabaseClient.js'),
      'lib/supabaseclient$': path.resolve(__dirname, 'lib/supabaseClient.js'),
      'lib/SupabaseClient$': path.resolve(__dirname, 'lib/supabaseClient.js'),
      '@/lib/supabaseClient$': path.resolve(__dirname, 'lib/supabaseClient.js'),
    };
    return config;
  },
};
module.exports = nextConfig;
