"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchPosts() {
  const res = await fetch("/api/posts");
  return res.json();
}
async function createPost(input: { title: string; body: string }) {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}
async function updatePost(id: number) {
  const res = await fetch(`/api/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: `已更新 #${id}`, body: `通过 React Query 更新：${Date.now()}` }),
  });
  return res.json();
}
async function deletePost(id: number) {
  const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
  return res.json();
}

export default function ClientReactQueryPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });
  const mCreate = useMutation({
    mutationFn: (input: { title: string; body: string }) => createPost(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
  const mUpdate = useMutation({
    mutationFn: (id: number) => updatePost(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
  const mDelete = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  return (
    <div>
      <h2>客户端组件：React Query</h2>
      {isLoading && <p>加载中...</p>}
      {error && <p>出错了：{String(error)}</p>}
      {data && (
        <>
          <p>帖子数量：{data.posts.length}</p>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <button onClick={() => mCreate.mutate({ title: `RQ 新增 ${Date.now()}`, body: "React Query create" })}>新增</button>
          </div>
          <ul>
            {data.posts.map((p: any) => (
              <li key={p.id}>
                <strong>#{p.id} {p.title}</strong>
                <div><small>{new Date(p.createdAt).toLocaleString()}</small></div>
                <div style={{ display: "flex", gap: ".5rem" }}>
                  <button onClick={() => mUpdate.mutate(p.id)}>更新</button>
                  <button onClick={() => mDelete.mutate(p.id)}>删除</button>
                </div>
                <div>{p.body}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
