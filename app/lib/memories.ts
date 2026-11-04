const DATABASE_NAME = "kaybee-franca-memories";
const STORE_NAME = "photos";
const DATABASE_VERSION = 1;

export type SavedMemory = {
  id: string;
  image: Blob;
  addedAt: number;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Could not open photo storage."));
  });
}

export async function getSavedMemories(): Promise<SavedMemory[]> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();
    request.onsuccess = () =>
      resolve((request.result as SavedMemory[]).sort((a, b) => a.addedAt - b.addedAt));
    request.onerror = () =>
      reject(request.error ?? new Error("Could not read saved photos."));
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => database.close();
  });
}

export async function saveMemory(memory: SavedMemory): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(memory);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("Could not save this photo."));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error ?? new Error("Saving this photo was interrupted."));
    };
  });
}

export async function deleteMemory(id: string): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("Could not remove this photo."));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error ?? new Error("Removing this photo was interrupted."));
    };
  });
}
