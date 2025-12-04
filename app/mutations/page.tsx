import { list } from "@/lib/db";
import { createPost, updatePost, deletePost } from "./actions";
import { getBaseUrl } from "@/lib/http";
import SubmitButton from "@/app/components/SubmitButton";

function PostsList() {
  const posts = list();
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>
          <strong>#{p.id} {p.title}</strong>
          <div><small>{new Date(p.createdAt).toLocaleString()}</small></div>
          <div>{p.body}</div>
        </li>
      ))}
    </ul>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={{ marginTop: "0.5rem" }}>{children}</h3>;
}

export default async function MutationsPage() {
  // 也可以在此展示通过内部 API 获取的数据
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/posts`, { cache: "no-store" });
  const data = await res.json();

  return (
    <div>
      <h2>Server Actions：创建 / 更新 / 删除 与按需重验证</h2>
      <p>提交表单后，会调用 Server Actions 对内存数据进行变更，并执行 revalidateTag('posts') 与对相关页面的 revalidatePath。</p>

      <section>
        <SectionTitle>当前帖子（来自 API）</SectionTitle>
        <pre>数量：{data.posts.length}，时间戳：{new Date(data.ts).toLocaleString()}</pre>
      </section>

      <section>
        <SectionTitle>创建帖子</SectionTitle>
        <form action={createPost}>
          <label>标题</label>
          <input name="title" placeholder="输入标题" />
          <label>内容</label>
          <textarea name="body" placeholder="输入内容" />
          <SubmitButton>创建</SubmitButton>
        </form>
      </section>

      <section>
        <SectionTitle>更新帖子</SectionTitle>
        <form action={updatePost}>
          <label>帖子 ID</label>
          <input name="id" placeholder="例如 1" />
          <label>新标题（可选）</label>
          <input name="title" placeholder="新标题" />
          <label>新内容（可选）</label>
          <textarea name="body" placeholder="新内容" />
          <SubmitButton>更新</SubmitButton>
        </form>
      </section>

      <section>
        <SectionTitle>删除帖子</SectionTitle>
        <form action={deletePost}>
          <label>帖子 ID</label>
          <input name="id" placeholder="例如 1" />
          <SubmitButton>删除</SubmitButton>
        </form>
      </section>

      <section>
        <SectionTitle>服务器侧渲染的帖子列表（直接读取内存层）</SectionTitle>
        <PostsList />
      </section>
    </div>
  );
}
