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

const BUCKET = "wedding-memories";
const FOLDER = "uploads";
const PAGE_SIZE = 100;
const RESUMABLE_CHUNK_SIZE = 6 * 1024 * 1024;

export type SharedMemory = {
  path: string;
  url: string;
  kind: "photo" | "video";
};

function mediaKind(path: string): SharedMemory["kind"] {
  return /\.(mp4|mov|webm)$/i.test(path) ? "video" : "photo";
}

function client(): SupabaseClient {
  if (!memoryClient) throw new Error("The shared photo wall is not configured yet.");
  return memoryClient;
}

export async function getSharedMemories(): Promise<SharedMemory[]> {
  const storage = client().storage.from(BUCKET);
  const memories: SharedMemory[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await storage.list(FOLDER, {
      limit: PAGE_SIZE,
      offset,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) throw error;

    for (const item of data) {
      if (!item.id || item.name === ".emptyFolderPlaceholder") continue;
      const path = `${FOLDER}/${item.name}`;
      memories.push({ path, url: storage.getPublicUrl(path).data.publicUrl, kind: mediaKind(path) });
    }

    if (data.length < PAGE_SIZE) return memories;
    offset += data.length;
  }
}

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};

export function isSupportedMemory(file: File): boolean {
  return Object.hasOwn(extensions, file.type);
}

export async function uploadSharedMemory(file: File, onProgress?: (percent: number) => void): Promise<SharedMemory> {
  const extension = extensions[file.type];
  if (!extension) throw new Error("Please choose a supported photo or video.");

  const storage = client().storage.from(BUCKET);
  const path = `${FOLDER}/${crypto.randomUUID()}.${extension}`;
  if (file.size > RESUMABLE_CHUNK_SIZE) {
    if (!supabaseUrl || !supabaseKey) throw new Error("The shared wall is not configured.");
    const { Upload } = await import("tus-js-client");
    const { data: { session }, error } = await client().auth.getSession();
    if (error) throw error;
    await new Promise<void>((resolve, reject) => {
      const upload = new Upload(file, {
        endpoint: `${supabaseUrl.replace(/\/$/, "")}/storage/v1/upload/resumable`,
        retryDelays: [0, 1000, 3000, 5000],
        headers: {
          apikey: supabaseKey,
          authorization: `Bearer ${session?.access_token ?? supabaseKey}`,
          "x-upsert": "false",
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        chunkSize: RESUMABLE_CHUNK_SIZE,
        metadata: { bucketName: BUCKET, objectName: path, contentType: file.type, cacheControl: "60" },
        onProgress: (sent, total) => onProgress?.(Math.round((sent / total) * 100)),
        onError: reject,
        onSuccess: () => resolve(),
      });
      upload.start();
    });
  } else {
    const { error } = await storage.upload(path, file, {
      contentType: file.type,
      cacheControl: "60",
      upsert: false,
    });
    if (error) throw error;
  }
  return { path, url: storage.getPublicUrl(path).data.publicUrl, kind: mediaKind(path) };
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
  const { data, error } = await client().storage.from(BUCKET).remove([path]);
  if (error) throw error;
  if (!data?.length) throw new Error("Photo was not removed.");
}
