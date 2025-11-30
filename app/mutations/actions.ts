"use server";
import { create, update, remove } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") || `SA 新增 ${Date.now()}`);
  const body = String(formData.get("body") || "");
  const post = create({ title, body });

  // 变更后，按需重验证
  revalidateTag("posts");
  revalidatePath("/client-swr");
  revalidatePath("/client-react-query");
  revalidatePath("/server");

  return { ok: true, post };
}

export async function updatePost(formData: FormData) {
  const id = Number(formData.get("id"));
  const title = formData.get("title");
  const body = formData.get("body");
  const post = update(id, {
    title: typeof title === "string" ? title : undefined,
    body: typeof body === "string" ? body : undefined,
  });
  if (!post) return { ok: false, error: "Not Found" } as const;

  revalidateTag("posts");
  revalidatePath("/client-swr");
  revalidatePath("/client-react-query");
  revalidatePath("/server");

  return { ok: true, post };
}

export async function deletePost(formData: FormData) {
  const id = Number(formData.get("id"));
  const ok = remove(id);
  if (!ok) return { ok: false, error: "Not Found" } as const;

  revalidateTag("posts");
  revalidatePath("/client-swr");
  revalidatePath("/client-react-query");
  revalidatePath("/server");

  return { ok: true, id };
}
