// lib/db.ts
// 简单的内存数据层。注意：在生产环境中应替换为真实数据库。

export type Post = {
  id: number;
  title: string;
  body: string;
  createdAt: number; // unix ms
};

let _id = 3;
const posts: Post[] = [
  { id: 1, title: "Hello Next.js", body: "欢迎使用 App Router！", createdAt: Date.now() - 1000 * 60 * 60 },
  { id: 2, title: "Server Components", body: "默认在服务端获取数据，支持流式渲染。", createdAt: Date.now() - 1000 * 60 * 30 },
  { id: 3, title: "SWR & React Query", body: "在客户端进行数据获取与变更。", createdAt: Date.now() - 1000 * 60 * 10 },
];

export function list(): Post[] {
  return posts.slice().sort((a, b) => b.createdAt - a.createdAt);
}

export function get(id: number): Post | undefined {
  return posts.find((p) => p.id === id);
}

export function create(input: { title: string; body: string }): Post {
  const post: Post = {
    id: ++_id,
    title: input.title ?? "Untitled",
    body: input.body ?? "",
    createdAt: Date.now(),
  };
  posts.push(post);
  return post;
}

export function update(id: number, patch: Partial<Pick<Post, "title" | "body">>): Post | undefined {
  const p = posts.find((x) => x.id === id);
  if (!p) return undefined;
  if (typeof patch.title === "string") p.title = patch.title;
  if (typeof patch.body === "string") p.body = patch.body;
  return p;
}

export function remove(id: number): boolean {
  const idx = posts.findIndex((x) => x.id === id);
  if (idx >= 0) {
    posts.splice(idx, 1);
    return true;
  }
  return false;
}
