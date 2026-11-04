"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import MemoryModerator from "./MemoryModerator";
import {
  deleteSharedMemory,
  getSharedMemories,
  isSupportedPhoto,
  uploadSharedMemory,
  type SharedMemory,
} from "../lib/shared-memories";

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_FILES_PER_UPLOAD = 10;

export default function SharedMemories({ savedOnDevice }: { savedOnDevice: ReactNode }) {
  const [memories, setMemories] = useState<SharedMemory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
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
      setStatus(`Please choose no more than ${MAX_FILES_PER_UPLOAD} photos at a time.`);
      return;
    }
    if (files.some((file) => !isSupportedPhoto(file))) {
      setStatus("Please choose JPG, PNG, WebP or GIF photos.");
      return;
    }
    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      setStatus("Each photo must be smaller than 15 MB.");
      return;
    }

    setIsUploading(true);
    revision.current += 1;
    mutationsInFlight.current += 1;
    setStatus("Adding your photos…");
    let added = 0;
    for (const file of files) {
      try {
        const photo = await uploadSharedMemory(file);
        setMemories((current) => [photo, ...current]);
        added += 1;
      } catch {
        // Keep successful uploads visible even if another upload fails.
      }
    }
    setStatus(
      added === files.length
        ? `${added} photo${added === 1 ? "" : "s"} added to the shared wall.`
        : `${added} of ${files.length} photos added. Please try the others again.`,
    );
    mutationsInFlight.current -= 1;
    setIsUploading(false);
  };

  const remove = async (photo: SharedMemory) => {
    if (!window.confirm("Remove this photo from the shared wall for everyone?")) return;
    revision.current += 1;
    mutationsInFlight.current += 1;
    try {
      await deleteSharedMemory(photo.path);
      setMemories((current) => current.filter((item) => item.path !== photo.path));
      setStatus("Photo removed from the shared wall.");
    } catch {
      setStatus("Could not remove this photo. Check your sign-in and try again.");
    } finally {
      mutationsInFlight.current -= 1;
    }
  };

  return (
    <section className="couple-memories" id="memories" aria-labelledby="memories-heading">
      <ScrollReveal className="couple-memories__intro">
        <p className="section-kicker">MADE MORE SPECIAL BY YOU</p>
        <h2 id="memories-heading">Couple <em>memories</em></h2>
        <p>Have a favourite photo of the two of us? Add it to our shared memory wall.</p>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <label className="couple-memories__upload">
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple disabled={isUploading || isLoading || loadFailed} onChange={(event) => void handleUpload(event)} />
          <span aria-hidden="true">＋</span>
          {isUploading ? "ADDING PHOTOS…" : "ADD YOUR PHOTOS"}
        </label>
      </ScrollReveal>
      <p className="couple-memories__privacy">Photos you add can be seen by everyone visiting this site.</p>
      <p className="couple-memories__status" role="status" aria-live="polite">
        {isLoading ? "Loading shared photos…" : loadFailed ? "The shared wall could not be loaded." : status}
      </p>
      {loadFailed && <button className="memory-moderator__action" type="button" onClick={() => void retry()}>Try again</button>}
      {!isLoading && !loadFailed && memories.length === 0 ? (
        <div className="couple-memories__empty"><span aria-hidden="true">♡</span><p>Your photos will find a place here.</p></div>
      ) : (
        <div className="couple-memories__gallery">
          {memories.map((memory, index) => (
            <figure className="couple-memories__card" key={memory.path}>
              <div className="couple-memories__photo">
                <Image src={memory.url} alt={`A guest memory of Kaybee and Franca, photo ${index + 1}`} fill sizes="(max-width: 900px) 44vw, 230px" unoptimized />
              </div>
              <figcaption>A moment to keep</figcaption>
              {isModerator && (
                <button type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => void remove(memory)}>×</button>
              )}
            </figure>
          ))}
        </div>
      )}
      <MemoryModerator onAccessChange={setIsModerator} />
      {savedOnDevice}
    </section>
  );
}
