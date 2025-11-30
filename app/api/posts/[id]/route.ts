import { NextResponse } from "next/server";
import { get, update, remove } from "@/lib/db";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const id = Number(ctx.params.id);
  const post = get(id);
  if (!post) return NextResponse.json({ ok: false, error: "Not Found" }, { status: 404 });
  return NextResponse.json({ ok: true, post, ts: Date.now() });
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const id = Number(ctx.params.id);
  const patch = await req.json().catch(() => ({}));
  const p = update(id, { title: patch.title, body: patch.body });
  if (!p) return NextResponse.json({ ok: false, error: "Not Found" }, { status: 404 });
  return NextResponse.json({ ok: true, post: p, ts: Date.now() });
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const id = Number(ctx.params.id);
  const ok = remove(id);
  if (!ok) return NextResponse.json({ ok: false, error: "Not Found" }, { status: 404 });
  return NextResponse.json({ ok: true, id, ts: Date.now() });
}
