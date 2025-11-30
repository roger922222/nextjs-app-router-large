import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Next.js App Router 大型示例",
  description:
    "演示服务器组件数据获取与三层缓存、并行/串行、Suspense 流式渲染、SWR/React Query、Server Actions、Route Handlers 全套 CRUD",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <nav>
          <div className="container">
            <Link href="/">首页</Link>
            <Link href="/server">服务器组件 - 缓存演示</Link>
            <Link href="/server/parallel">服务器组件 - 并行获取</Link>
            <Link href="/server/serial">服务器组件 - 串行获取</Link>
            <Link href="/server/dedup">服务器组件 - 请求去重</Link>
            <Link href="/server/full-route-cache">整页缓存</Link>
            <Link href="/streaming">Suspense 与流式渲染</Link>
            <Link href="/client-swr">客户端 SWR</Link>
            <Link href="/client-react-query">客户端 React Query</Link>
            <Link href="/mutations">Server Actions（表单与变更）</Link>
            <Link href="/on-demand-revalidate">按需重验证</Link>
          </div>
        </nav>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
