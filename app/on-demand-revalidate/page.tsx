import { revalidateTag } from "next/cache";
import SubmitButton from "@/app/components/SubmitButton";

export default function OnDemandRevalidatePage() {
  async function trigger() {
    "use server";
    revalidateTag("posts");
  }

  return (
    <div>
      <h2>按需重验证（手动触发）</h2>
      <p>点击下方按钮将调用一个 Server Action，执行 revalidateTag('posts')。</p>
      <form action={trigger}>
        <SubmitButton>触发重验证</SubmitButton>
      </form>
      <small>提交后相关数据缓存会被标记为过期；客户端页面可感知到变更。</small>
    </div>
  );
}
