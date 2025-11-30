import { getBaseUrl } from "@/lib/http";

export default async function ServerSerialPage() {
  const baseUrl = getBaseUrl();
  const opts: RequestInit = { cache: "no-store" };

  const aRes = await fetch(`${baseUrl}/api/posts?delay=800`, opts);
  const a = await aRes.json();
  const bRes = await fetch(`${baseUrl}/api/posts?delay=1600`, opts);
  const b = await bRes.json();

  return (
    <div>
      <section>
        <h2>服务器组件：串行获取（依次 await）</h2>
        <pre>A 时间戳：{new Date(a.ts).toLocaleString()}（delay=800ms）</pre>
        <pre>B 时间戳：{new Date(b.ts).toLocaleString()}（delay=1600ms）</pre>
      </section>
    </div>
  );
}
