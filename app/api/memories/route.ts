import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { bucket, configured, kind, publicUrl, r2 } from "../../lib/r2";

export const runtime = "nodejs";
export async function GET() {
  if (!configured()) return NextResponse.json({ error: "Storage is not configured" }, { status: 503 });
  try {
    const items: { path: string; url: string; kind: "photo" | "video" }[] = [];
    let cursor: string | undefined;
    do {
      const page = await r2().send(new ListObjectsV2Command({ Bucket: bucket(), Prefix: "uploads/", ContinuationToken: cursor, MaxKeys: 1000 }));
      for (const obj of page.Contents ?? []) {
        if (obj.Key && obj.Key !== "uploads/") items.push({ path: obj.Key, url: publicUrl(obj.Key), kind: kind(obj.Key) });
      }
      cursor = page.IsTruncated ? page.NextContinuationToken : undefined;
    } while (cursor && items.length < 3000);
    return NextResponse.json(items.reverse(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not load memories" }, { status: 502 });
  }
}
