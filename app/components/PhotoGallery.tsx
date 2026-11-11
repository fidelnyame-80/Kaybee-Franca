"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { storyPhotos } from "../site-content";

export default function PhotoGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selectedIndex !== null && dialog && !dialog.open) dialog.showModal();
  }, [selectedIndex]);

  const move = (direction: number) => {
    setSelectedIndex((current) => current === null
      ? null
      : (current + direction + storyPhotos.length) % storyPhotos.length);
  };

  // Keep the central message in the same position while photos are being added.
  const slots = Array.from({ length: Math.max(8, storyPhotos.length) }, (_, index) => storyPhotos[index]);

  return (
    <div className="story-album">
      <div className="story-album__grid">
        {slots.map((photo, index) => (
          <Fragment key={photo ? `${photo.year}-${photo.src}` : `empty-${index}`}>
            {index === 4 && (
              <div className="story-album__message">
                <h3><span className="story-album__message-line">10 Years of</span>{" "}Friendship <span>&amp; Loyalty</span></h3>
                <p className="story-album__signature">Kaybee &amp; Franca</p>
              </div>
            )}
            {photo ? (
              <figure className="story-album__print">
                <button
                  className="story-album__photo"
                  type="button"
                  aria-label={`View ${photo.year} photo: ${photo.alt}`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 720px) 28vw, 190px"
                    style={{ objectPosition: photo.objectPosition ?? "center" }}
                    unoptimized
                  />
                </button>
                <figcaption>{photo.year}</figcaption>
              </figure>
            ) : (
              <figure className="story-album__print story-album__print--empty" aria-hidden="true">
                <div className="story-album__empty"><span>♡</span></div>
                <figcaption>&nbsp;</figcaption>
              </figure>
            )}
          </Fragment>
        ))}
      </div>

      <dialog
        className="gallery-viewer"
        ref={dialogRef}
        aria-label="Photo viewer"
        onClose={() => setSelectedIndex(null)}
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
      >
        {selectedIndex !== null && storyPhotos[selectedIndex] && (
          <div className="gallery-viewer__content">
            <button className="gallery-viewer__close" type="button" aria-label="Close photo viewer" onClick={() => dialogRef.current?.close()}>×</button>
            <div className="gallery-viewer__image">
              <Image src={storyPhotos[selectedIndex].src} alt={storyPhotos[selectedIndex].alt} fill sizes="(max-width: 720px) 90vw, 650px" unoptimized />
            </div>
            <div className="gallery-viewer__controls">
              <button type="button" onClick={() => move(-1)} aria-label="Previous photo">←</button>
              <span>{selectedIndex + 1} / {storyPhotos.length}</span>
              <button type="button" onClick={() => move(1)} aria-label="Next photo">→</button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
