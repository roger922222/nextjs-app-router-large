import { getBaseUrl } from "@/lib/http";

// 在服务器组件中演示 Data Cache 与 no-store
export default async function ServerCacheDemoPage() {
  const baseUrl = await getBaseUrl();

  // Data Cache：通过 tags + revalidate 控制数据缓存；注意这只是数据缓存，不是整页缓存
  const dataCacheRes = await fetch(`${baseUrl}/api/posts`, {
    next: { tags: ["posts"], revalidate: 120 },
  });
  const dataCache = await dataCacheRes.json();

  // no-store：每次请求均直达源头，不参与缓存
  const noStoreRes = await fetch(`${baseUrl}/api/posts?delay=500`, { cache: "no-store" });
  const noStore = await noStoreRes.json();

  return (
    <div>
      <section>
        <h2>服务器组件：数据缓存（Data Cache）</h2>
        <p>fetch 配置 next(tags=['posts'], revalidate=120)，与 revalidateTag 配合可按需重验证。</p>
        <pre>时间戳（data cache）：{new Date(dataCache.ts).toLocaleString()}</pre>
        <pre>帖子数量：{dataCache.posts.length}</pre>
      </section>
      <section>
        <h2>服务器组件：no-store</h2>
        <p>fetch 配置 cache='no-store'，每次渲染都会重新获取数据。</p>
        <pre>时间戳（no-store）：{new Date(noStore.ts).toLocaleString()}</pre>
        <pre>帖子数量：{noStore.posts.length}</pre>
      </section>
    </div>
  );
}
