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
  try {
    const uploadUrl = await getSignedUrl(r2(), new PutObjectCommand({ Bucket: bucket(), Key: path, ContentType: type }), { expiresIn: 120 });
    return NextResponse.json({ path, url: publicUrl(path), uploadUrl });
  } catch {
    return NextResponse.json({ error: "Could not prepare upload" }, { status: 502 });
  }
}
