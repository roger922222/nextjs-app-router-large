import { Suspense } from "react";

async function SlowBlock({ ms, label }: { ms: number; label: string }) {
  // 服务器子组件：人为延迟，模拟慢速数据源
  await new Promise((r) => setTimeout(r, ms));
  return (
    <section>
      <h3>{label}</h3>
      <p>我是一个慢速服务器组件，延迟 {ms / 1000}s 后才渲染。</p>
    </section>
  );
}

export default function StreamingPage() {
  return (
    <div>
      <h2>Suspense 与流式渲染</h2>
      <Suspense fallback={<section><h3>块 1 加载中...</h3></section>}>
        {/* 2s 后显示 */}
        <SlowBlock ms={2000} label="块 1（2s）" />
      </Suspense>
      <Suspense fallback={<section><h3>块 2 加载中...</h3></section>}>
        {/* 4s 后显示 */}
        <SlowBlock ms={4000} label="块 2（4s）" />
      </Suspense>
    </div>
  );
}
