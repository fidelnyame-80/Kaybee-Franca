import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// These are public browser credentials. Authorization is enforced by Supabase
// Storage policies, never by a service-role key in the website.
function createMemoryClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) return null;
  try {
    return createClient(supabaseUrl, supabaseKey);
  } catch {
    return null;
  }
}

export const memoryClient = createMemoryClient();

export type SharedMemory = { path: string; url: string; kind: "photo" | "video" };
const extensions: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
  "image/gif": "gif", "video/mp4": "mp4", "video/quicktime": "mov", "video/webm": "webm",
};
export function isSupportedMemory(file: File): boolean { return Object.hasOwn(extensions, file.type); }
export async function getSharedMemories(): Promise<SharedMemory[]> {
  const response = await fetch("/api/memories", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load memories");
  return response.json() as Promise<SharedMemory[]>;
}
export async function uploadSharedMemory(file: File, onProgress?: (percent: number) => void): Promise<SharedMemory> {
  if (!isSupportedMemory(file)) throw new Error("Unsupported file type");
  const prepared = await fetch("/api/memories/upload", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: file.type, size: file.size }),
  });
  if (!prepared.ok) throw new Error("Could not prepare upload");
  const { path, url, uploadUrl } = await prepared.json() as { path: string; url: string; uploadUrl: string };
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (event) => { if (event.lengthComputable) onProgress?.(Math.round(event.loaded / event.total * 100)); };
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed"));
    xhr.onerror = () => reject(new Error("Upload failed. Check R2 CORS configuration."));
    xhr.send(file);
  });
  return { path, url, kind: file.type.startsWith("video/") ? "video" : "photo" };
}
export async function downloadSharedMemory(memory: SharedMemory): Promise<void> {
  const response = await fetch(memory.url);
  if (!response.ok) throw new Error("Could not download this memory.");
  const blobUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = `wedding-memory-${memory.path.split("/").pop()}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
}

export async function deleteSharedMemory(path: string): Promise<void> {
  if (!memoryClient) throw new Error("Moderator sign-in is unavailable");
  const { data: { session } } = await memoryClient.auth.getSession();
  if (!session) throw new Error("Please sign in as a moderator");
  const response = await fetch("/api/memories/delete", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify({ path }),
  });
  if (!response.ok) throw new Error("Could not remove memory");
}
