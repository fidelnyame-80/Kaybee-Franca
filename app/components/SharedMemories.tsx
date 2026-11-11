"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import MemoryModerator from "./MemoryModerator";
import { WeddingWall, WeddingWallPageIntro } from "./WeddingWall";
import {
  deleteSharedMemory,
  downloadSharedMemory,
  getSharedMemories,
  isSupportedMemory,
  uploadSharedMemory,
  type SharedMemory,
} from "../lib/shared-memories";

const MAX_PHOTO_SIZE = 15 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
const MAX_FILES_PER_UPLOAD = 10;

export default function SharedMemories({ savedOnDevice }: { savedOnDevice: ReactNode }) {
  const [memories, setMemories] = useState<SharedMemory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const revision = useRef(0);
  const mutationsInFlight = useRef(0);

  useEffect(() => {
    let active = true;
    let pending = false;
    const refresh = (initial = false) => {
      if (pending || (!initial && (document.hidden || mutationsInFlight.current > 0))) return;
      pending = true;
      const startedAt = revision.current;
      void getSharedMemories().then((photos) => {
        if (active && startedAt === revision.current && mutationsInFlight.current === 0) {
          setMemories(photos);
          setLoadFailed(false);
        }
      }).catch(() => {
        if (active && initial) setLoadFailed(true);
      }).finally(() => {
        pending = false;
        if (active && initial) setIsLoading(false);
      });
    };
    const refreshWhenVisible = () => { if (!document.hidden) refresh(); };
    refresh(true);
    const interval = window.setInterval(() => refresh(), 15000);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  const retry = async () => {
    setIsLoading(true);
    setLoadFailed(false);
    try {
      setMemories(await getSharedMemories());
    } catch {
      setLoadFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    input.value = "";
    if (!files.length) return;
    if (files.length > MAX_FILES_PER_UPLOAD) {
      setStatus(`Please choose no more than ${MAX_FILES_PER_UPLOAD} photos or videos at a time.`);
      return;
    }
    if (files.some((file) => !isSupportedMemory(file))) {
      setStatus("Please choose JPG, PNG, WebP or GIF photos, or MP4, MOV or WebM videos.");
      return;
    }
    if (files.some((file) => file.size > (file.type.startsWith("video/") ? MAX_VIDEO_SIZE : MAX_PHOTO_SIZE))) {
      setStatus("Photos must be 15 MB or smaller, and videos 50 MB or smaller.");
      return;
    }

    setIsUploading(true);
    revision.current += 1;
    mutationsInFlight.current += 1;
    setStatus("Adding your memories…");
    let added = 0;
    for (const [index, file] of files.entries()) {
      try {
        const photo = await uploadSharedMemory(file, (percent) => {
          setStatus(`Adding memory ${index + 1} of ${files.length}… ${percent}%`);
        });
        setMemories((current) => [photo, ...current]);
        added += 1;
      } catch {
        // Keep successful uploads visible even if another upload fails.
      }
    }
    setStatus(
      added === files.length
        ? `${added} memor${added === 1 ? "y" : "ies"} added to the shared wall.`
        : `${added} of ${files.length} memories added. Please try the others again.`,
    );
    mutationsInFlight.current -= 1;
    setIsUploading(false);
  };

  const download = async (memory: SharedMemory) => {
    setDownloading(memory.path);
    setStatus("Preparing your download…");
    try {
      await downloadSharedMemory(memory);
      setStatus("Your download is ready.");
    } catch {
      setStatus("Could not download this memory. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const remove = async (memory: SharedMemory) => {
    if (!window.confirm("Remove this memory from the shared wall for everyone?")) return;
    revision.current += 1;
    mutationsInFlight.current += 1;
    try {
      await deleteSharedMemory(memory.path);
      setMemories((current) => current.filter((item) => item.path !== memory.path));
      setStatus("Memory removed from the shared wall.");
    } catch {
      setStatus("Could not remove this memory. Check your sign-in and try again.");
    } finally {
      mutationsInFlight.current -= 1;
    }
  };

  return (
    <section className="couple-memories wedding-wall-page__content" aria-labelledby="wedding-wall-page-heading">
      <WeddingWallPageIntro shared accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm" disabled={isUploading || isLoading || loadFailed} isUploading={isUploading} onUpload={(event) => void handleUpload(event)} />
      <p className="couple-memories__status" role="status" aria-live="polite">
        {isLoading ? "Loading shared memories…" : loadFailed ? "The shared wall could not be loaded." : status}
      </p>
      {loadFailed && <button className="memory-moderator__action" type="button" onClick={() => void retry()}>Try again</button>}
      <WeddingWall>
        {memories.map((memory, index) => (
          <figure className="couple-memories__card" key={memory.path}>
            <div className="couple-memories__photo">
              {memory.kind === "video" ? (
                <video src={memory.url} controls playsInline preload="metadata" aria-label={`Wedding video ${index + 1}`} />
              ) : (
                <Image src={memory.url} alt={`A guest's wedding photo ${index + 1}`} fill sizes="(max-width: 900px) 44vw, 230px" unoptimized />
              )}
            </div>
            <figcaption>A moment to keep</figcaption>
            <button className="couple-memories__download" type="button" disabled={downloading !== null} onClick={() => void download(memory)} aria-label={`Download ${memory.kind} ${index + 1}`}>
              {downloading === memory.path ? "Preparing…" : "Download"}
            </button>
            {isModerator && (
              <button className="couple-memories__remove" type="button" aria-label={`Remove ${memory.kind} ${index + 1}`} onClick={() => void remove(memory)}>×</button>
            )}
          </figure>
        ))}
      </WeddingWall>
      <MemoryModerator onAccessChange={setIsModerator} />
      {savedOnDevice}
    </section>
  );
}
