import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { bucket, configured, r2 } from "../../../lib/r2";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!configured()) return NextResponse.json({ error: "Storage is not configured" }, { status: 503 });
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!token || !url || !key) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const auth = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error } = await auth.auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: moderator, error: roleError } = await auth.from("wedding_moderators").select("user_id").eq("user_id", user.id).maybeSingle();
  if (roleError || !moderator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const path = body?.path;
  if (typeof path !== "string" || !/^uploads\/[a-f0-9-]{36}\.(jpg|png|webp|gif|mp4|mov|webm)$/.test(path))
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  try {
    await r2().send(new DeleteObjectCommand({ Bucket: bucket(), Key: path }));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not remove memory" }, { status: 502 });
  }
}
