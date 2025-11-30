import { NextResponse } from "next/server";
import { list, create } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const delay = parseInt(searchParams.get("delay") || "0", 10) || 0;
  if (delay > 0) {
    await new Promise((r) => setTimeout(r, delay));
  }
  return NextResponse.json({ posts: list(), ts: Date.now() });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const post = create({ title: payload.title || "新帖子", body: payload.body || "" });
  return NextResponse.json({ ok: true, post, ts: Date.now() }, { status: 201 });
}
