import { getBaseUrl } from "@/lib/http";

export default async function ServerDedupPage() {
  const baseUrl = getBaseUrl();
  // 同一请求上下文中，两次完全相同的 fetch 调用会被 Request Memoization 去重
  const options: RequestInit = { cache: "no-store" };
  const r1 = await fetch(`${baseUrl}/api/metrics`, options);
  const r2 = await fetch(`${baseUrl}/api/metrics`, options);
  const [a, b] = await Promise.all([r1.json(), r2.json()]);

  return (
    <div>
      <section>
        <h2>服务器组件：请求去重（Request Memoization）</h2>
        <p>预期同一渲染内仅调用一次后端，两个结果相同（count 不会增长两次）。</p>
        <pre>第一次返回：count={a.count} ts={new Date(a.ts).toLocaleTimeString()}</pre>
        <pre>第二次返回：count={b.count} ts={new Date(b.ts).toLocaleTimeString()}</pre>
      </section>
    </div>
  );
}
