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

export type SharedMemory = {
  path: string;
  url: string;
};

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
      memories.push({ path, url: storage.getPublicUrl(path).data.publicUrl });
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
};

export function isSupportedPhoto(file: File): boolean {
  return Object.hasOwn(extensions, file.type);
}

export async function uploadSharedMemory(file: File): Promise<SharedMemory> {
  const extension = extensions[file.type];
  if (!extension) throw new Error("Please choose a JPG, PNG, WebP or GIF photo.");

  const storage = client().storage.from(BUCKET);
  const path = `${FOLDER}/${crypto.randomUUID()}.${extension}`;
  const { error } = await storage.upload(path, file, {
    contentType: file.type,
    cacheControl: "60",
    upsert: false,
  });
  if (error) throw error;
  return { path, url: storage.getPublicUrl(path).data.publicUrl };
}

export async function deleteSharedMemory(path: string): Promise<void> {
  const { data, error } = await client().storage.from(BUCKET).remove([path]);
  if (error) throw error;
  if (!data?.length) throw new Error("Photo was not removed.");
}
