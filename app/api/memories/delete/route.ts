import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { createHash, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { bucket, configured, r2 } from "../../../lib/r2";

const ADMIN_EMAIL = "nyamefidel7@gmail.com";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!configured()) return NextResponse.json({ error: "Storage is not configured" }, { status: 503 });
  const body = await request.json().catch(() => null);
  const path = body?.path;
  if (typeof path !== "string" || !/^uploads\/[a-f0-9-]{36}\.(jpg|png|webp|gif|mp4|mov|webm)$/.test(path))
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });

  let authorized = false;
  const deleteToken = body?.deleteToken;
  const ownerKey = `ownership/${path.slice("uploads/".length)}.sha256`;
  if (typeof deleteToken === "string" && /^[a-f0-9-]{72}$/.test(deleteToken)) {
    try {
      const stored = await r2().send(new GetObjectCommand({ Bucket: bucket(), Key: ownerKey }));
      const expected = (await stored.Body?.transformToString())?.trim() ?? "";
      const actual = createHash("sha256").update(deleteToken).digest("hex");
      authorized = expected.length === actual.length && timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
    } catch {
      authorized = false;
    }
  }
  if (!authorized) {
    const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!token || !url || !key) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const auth = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: { user }, error } = await auth.auth.getUser(token);
    if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.email?.toLowerCase() !== ADMIN_EMAIL) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { data: moderator, error: roleError } = await auth.from("wedding_moderators").select("user_id").eq("user_id", user.id).maybeSingle();
    if (roleError || !moderator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    await r2().send(new HeadObjectCommand({ Bucket: bucket(), Key: path }));
    await r2().send(new DeleteObjectCommand({ Bucket: bucket(), Key: path }));
    await r2().send(new DeleteObjectCommand({ Bucket: bucket(), Key: ownerKey }));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not remove memory" }, { status: 502 });
  }
}
