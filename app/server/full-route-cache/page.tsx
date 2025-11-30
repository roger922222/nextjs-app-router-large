export const revalidate = 60; // Full Route Cache：整页缓存 60s
import { getBaseUrl } from "@/lib/http";

export default async function FullRouteCachePage() {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/posts`);
  const data = await res.json();
  const now = new Date();
  return (
    <div>
      <section>
        <h2>整页缓存（Full Route Cache）</h2>
        <p>本页导出 revalidate = 60，整体页面缓存 60s。若需强制刷新整页，可使用 revalidatePath。</p>
        <pre>当前服务器时间：{now.toLocaleString()}</pre>
        <pre>数据时间戳：{new Date(data.ts).toLocaleString()}</pre>
        <pre>帖子数量：{data.posts.length}</pre>
      </section>
    </div>
  );
}
