"use client";
import useSWR from "swr";
import { useState } from "react";

export default function ClientSWRPage() {
  const { data, error, isLoading, mutate } = useSWR("/api/posts");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function onCreate() {
    const payload = { title: title || `SWR 新增 ${Date.now()}`, body };
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // 调用 mutate 触发本地更新与重新验证
    await mutate();
    setTitle("");
    setBody("");
  }

  return (
    <div>
      <h2>客户端组件：SWR</h2>
      {isLoading && <p>加载中...</p>}
      {error && <p>出错了：{String(error)}</p>}
      {data && (
        <>
          <p>帖子数量：{data.posts.length}</p>
          <ul>
            {data.posts.map((p: any) => (
              <li key={p.id}>
                <strong>#{p.id} {p.title}</strong>
                <div><small>{new Date(p.createdAt).toLocaleString()}</small></div>
                <div>{p.body}</div>
              </li>
            ))}
          </ul>
        </>
      )}

      <section>
        <h3>新增帖子（POST /api/posts + mutate）</h3>
        <label>标题</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="输入标题" />
        <label>内容</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="输入内容" />
        <button onClick={onCreate}>新增</button>
      </section>
    </div>
  );
}
