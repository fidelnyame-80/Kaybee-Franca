import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

export const MAX_PHOTO = 15 * 1024 * 1024;
export const MAX_VIDEO = 50 * 1024 * 1024;
export const mediaTypes: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
  "image/gif": "gif", "video/mp4": "mp4", "video/quicktime": "mov", "video/webm": "webm",
};
export function configured() {
  return Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET_NAME && process.env.R2_PUBLIC_URL);
}
export function bucket() { return process.env.R2_BUCKET_NAME!; }
export function publicUrl(key: string) {
  return process.env.R2_PUBLIC_URL!.replace(/\/$/, "") + "/" + key.split("/").map(encodeURIComponent).join("/");
}
export function r2() {
  if (!configured()) throw new Error("R2 is not configured");
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
  });
}
export function kind(key: string): "photo" | "video" { return /\.(mp4|mov|webm)$/i.test(key) ? "video" : "photo"; }
