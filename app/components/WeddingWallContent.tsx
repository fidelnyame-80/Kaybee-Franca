"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { WeddingWall, WeddingWallPageIntro } from "./WeddingWall";
import {
  deleteMemory,
  getSavedMemories,
  saveMemory,
  type SavedMemory,
} from "../lib/memories";
import { memoryClient } from "../lib/shared-memories";
import SharedMemories from "./SharedMemories";

type MemoryPreview = SavedMemory & { preview: string };
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_FILES_PER_UPLOAD = 10;

export default function WeddingWallContent({ sharedEnabled }: { sharedEnabled: boolean }) {
  return sharedEnabled ? <SharedMemories savedOnDevice={<LocalMemories archived />} /> : <LocalMemories />;
}

function LocalMemories({ archived = false }: { archived?: boolean }) {
  const [memories, setMemories] = useState<MemoryPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");
  const objectUrls = useRef(new Set<string>());
  const animatedCards = useRef(new WeakSet<Element>());
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    const activeObjectUrls = objectUrls.current;
    void getSavedMemories()
      .then((saved) => {
        if (disposed) return;
        const previews = saved.map((memory) => {
          const preview = URL.createObjectURL(memory.image);
          objectUrls.current.add(preview);
          return { ...memory, preview };
        });
        setMemories(previews);
      })
      .catch((error: unknown) => {
        if (!disposed) {
          setStatus(
            error instanceof Error
              ? `Photo storage could not be opened: ${error.message}`
              : "Photo storage could not be opened.",
          );
        }
      })
      .finally(() => {
        if (!disposed) setIsLoading(false);
      });

    return () => {
      disposed = true;
      activeObjectUrls.forEach((url) => URL.revokeObjectURL(url));
      activeObjectUrls.clear();
    };
  }, []);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const cards = gallery.querySelectorAll(".couple-memories__card");
    const revealCard = (card: Element) => {
      if (animatedCards.current.has(card)) return;
      animatedCards.current.add(card);
      gsap.fromTo(
        card,
        { autoAlpha: 0, y: 38 },
        { autoAlpha: 1, y: 0, clearProps: "transform", duration: 0.75, ease: "power3.out" },
      );
    };

    if (!("IntersectionObserver" in window)) {
      cards.forEach(revealCard);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          revealCard(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [memories.length]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    input.value = "";
    if (files.length === 0) return;
    if (files.length > MAX_FILES_PER_UPLOAD) {
      setStatus(`Please choose no more than ${MAX_FILES_PER_UPLOAD} photos at a time.`);
      return;
    }

    const invalid = files.find(
      (file) => !file.type.startsWith("image/") || file.size > MAX_FILE_SIZE,
    );
    if (invalid) {
      setStatus(
        !invalid.type.startsWith("image/")
          ? "Please choose image files only."
          : "Each photo must be smaller than 15 MB.",
      );
      return;
    }

    setIsUploading(true);
    setStatus("Adding your photos…");
    let added = 0;
    const errors: string[] = [];

    for (const file of files) {
      const memory: SavedMemory = {
        id: crypto.randomUUID(),
        image: file,
        addedAt: Date.now(),
      };
      try {
        await saveMemory(memory);
        const preview = URL.createObjectURL(file);
        objectUrls.current.add(preview);
        setMemories((current) => [...current, { ...memory, preview }]);
        added += 1;
      } catch (error) {
        errors.push(
          error instanceof Error ? error.message : "A photo could not be saved.",
        );
      }
    }

    setStatus(
      errors.length
        ? `${added} photo${added === 1 ? "" : "s"} added. ${errors.join(" ")}`
        : `${added} photo${added === 1 ? "" : "s"} added and saved on this device.`,
    );
    setIsUploading(false);
  };

  const removeMemory = async (id: string) => {
    try {
      await deleteMemory(id);
      const removed = memories.find((memory) => memory.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
        objectUrls.current.delete(removed.preview);
      }
      setMemories((current) => current.filter((memory) => memory.id !== id));
      setStatus("Photo removed.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Could not remove this photo.",
      );
    }
  };

  if (archived && (isLoading || memories.length === 0)) return null;

  const cards = memories.map((memory, index) => (
    <figure className="couple-memories__card" key={memory.id}>
      <div className="couple-memories__photo">
        <Image src={memory.preview} alt={`A guest memory of Kaybee and Franca, photo ${index + 1}`} fill sizes="(max-width: 900px) 44vw, 230px" unoptimized />
      </div>
      <figcaption>A moment to keep</figcaption>
      <a className="couple-memories__download" href={memory.preview} download={`wedding-memory-${index + 1}.${(memory.image.type.split("/")[1] || "jpg").replace(/[^a-z0-9]/gi, "")}`}>
        Download
      </a>
      <button type="button" className="couple-memories__remove" aria-label={`Remove photo ${index + 1}`} onClick={() => void removeMemory(memory.id)}>×</button>
    </figure>
  ));

  if (archived) {
    return (
      <div className="couple-memories__saved">
        <h3 className="couple-memories__saved-heading">Photos saved on this device</h3>
        <p className="couple-memories__privacy">These previously saved photos are private to this browser and device.</p>
        <p className="couple-memories__status" role="status" aria-live="polite">{status}</p>
        <div ref={galleryRef} className="couple-memories__gallery">{cards}</div>
      </div>
    );
  }

  return (
    <section className="couple-memories wedding-wall-page__content" aria-labelledby="wedding-wall-page-heading">
      <WeddingWallPageIntro shared={false} accept="image/*" disabled={isUploading || isLoading} isUploading={isUploading} onUpload={handleUpload} />
      <p className="couple-memories__status" role="status" aria-live="polite">{isLoading ? "Loading your saved photos…" : status}</p>
      <WeddingWall galleryRef={galleryRef}>{cards}</WeddingWall>
    </section>
  );
}
