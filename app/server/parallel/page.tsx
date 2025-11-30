import { getBaseUrl } from "@/lib/http";

export default async function ServerParallelPage() {
  const baseUrl = getBaseUrl();
  const opts: RequestInit = { cache: "no-store" };

  const [aRes, bRes] = await Promise.all([
    fetch(`${baseUrl}/api/posts?delay=800`, opts),
    fetch(`${baseUrl}/api/posts?delay=1600`, opts),
  ]);

  const [a, b] = await Promise.all([aRes.json(), bRes.json()]);

  return (
    <div>
      <section>
        <h2>服务器组件：并行获取（Promise.all）</h2>
        <pre>A 时间戳：{new Date(a.ts).toLocaleString()}（delay=800ms）</pre>
        <pre>B 时间戳：{new Date(b.ts).toLocaleString()}（delay=1600ms）</pre>
      </section>
    </div>
  );
}
