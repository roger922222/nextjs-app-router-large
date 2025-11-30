export default async function HomePage() {
  const now = new Date();
  return (
    <div>
      <section>
        <h2>Next.js App Router 大型示例工程</h2>
        <p>
          本工程用于系统演示：服务器组件默认数据获取与三层缓存机制、并行/串行、Suspense 与流式渲染；
          客户端组件使用 SWR 与 React Query 获取与变更；Server Actions（表单）与按需重验证；Route Handlers 自定义 API 端点与 CRUD。
        </p>
        <small>当前服务器时间：{now.toLocaleString()}</small>
      </section>
      <section>
        <h3>快速导航</h3>
        <ul>
          <li>服务器组件缓存演示：/server</li>
          <li>并行获取：/server/parallel</li>
          <li>串行获取：/server/serial</li>
          <li>请求去重：/server/dedup</li>
          <li>整页缓存（60s）：/server/full-route-cache</li>
          <li>Suspense 与流式渲染：/streaming</li>
          <li>客户端 SWR：/client-swr</li>
          <li>客户端 React Query：/client-react-query</li>
          <li>Server Actions（表单）：/mutations</li>
          <li>手动按需重验证：/on-demand-revalidate</li>
        </ul>
      </section>
    </div>
  );
}
