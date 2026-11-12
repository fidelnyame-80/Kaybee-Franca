import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { bucket, configured, MAX_PHOTO, MAX_VIDEO, mediaTypes, publicUrl, r2 } from "../../../lib/r2";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!configured()) return NextResponse.json({ error: "Storage is not configured" }, { status: 503 });
  const body = await request.json().catch(() => null);
  const type = typeof body?.type === "string" ? body.type : "";
  const size = body?.size;
  const ext = mediaTypes[type];
  if (!ext || !Number.isSafeInteger(size) || size <= 0 || size > (type.startsWith("video/") ? MAX_VIDEO : MAX_PHOTO))
    return NextResponse.json({ error: "Unsupported file type or size" }, { status: 400 });
  const path = `uploads/${crypto.randomUUID()}.${ext}`;
  const deleteToken = crypto.randomUUID() + crypto.randomUUID();
  const tokenHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(deleteToken));
  const ownerHash = Array.from(new Uint8Array(tokenHash), b => b.toString(16).padStart(2, "0")).join("");
  try {
    const uploadUrl = await getSignedUrl(r2(), new PutObjectCommand({ Bucket: bucket(), Key: path, ContentType: type }), { expiresIn: 120 });
    await r2().send(new PutObjectCommand({ Bucket: bucket(), Key: `ownership/${path.slice("uploads/".length)}.sha256`, Body: ownerHash, ContentType: "text/plain" }));
    return NextResponse.json({ path, url: publicUrl(path), uploadUrl, deleteToken });
  } catch {
    return NextResponse.json({ error: "Could not prepare upload" }, { status: 502 });
  }
}
