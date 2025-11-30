// next.config.ts
// 保留 experimental.serverActions 配置以确保 Server Actions 可用
const nextConfig = {
  experimental: {
    serverActions: true,
  },
} satisfies import('next').NextConfig;

export default nextConfig;
