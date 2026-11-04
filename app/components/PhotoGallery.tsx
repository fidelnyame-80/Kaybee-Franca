"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { historyPhotos, preWeddingPhotos } from "../site-content";

type Photo = { src: string; alt: string };
type Selection = { photos: Photo[]; index: number };

export default function PhotoGallery() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selection && dialog && !dialog.open) dialog.showModal();
  }, [selection]);

  const move = (direction: number) => {
    setSelection((current) => current && {
      ...current,
      index: (current.index + direction + current.photos.length) % current.photos.length,
    });
  };

  const prints = (photos: Photo[]) => photos.map((photo, index) => (
    <figure className="photo-gallery__item" key={photo.src}>
      <button
        className="photo-gallery__photo"
        type="button"
        aria-label={`View photo: ${photo.alt}`}
        onClick={() => setSelection({ photos, index })}
      >
        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 720px) 42vw, 270px" unoptimized />
      </button>
      <figcaption><span>{String(index + 1).padStart(2, "0")}</span> Kaybee &amp; Franca</figcaption>
    </figure>
  ));

  return (
    <div className="photo-gallery__chapters">
      <section className="photo-gallery__chapter" aria-labelledby="pre-wedding-heading">
        <div className="photo-gallery__chapter-heading">
          <span className="photo-gallery__chapter-number">01</span>
          <div>
            <p>THE DAYS BEFORE FOREVER</p>
            <h3 id="pre-wedding-heading">Pre-wedding <em>Photoshoot</em></h3>
          </div>
        </div>
        <div className="photo-gallery__grid">{prints(preWeddingPhotos)}</div>
      </section>

      <section className="photo-gallery__chapter photo-gallery__chapter--history" aria-labelledby="history-heading">
        <div className="photo-gallery__chapter-heading">
          <span className="photo-gallery__chapter-number">02</span>
          <div>
            <p>THE STORY THAT BROUGHT US HERE</p>
            <h3 id="history-heading">Our <em>History</em></h3>
          </div>
        </div>
        <div className="photo-gallery__grid">
          {historyPhotos.length ? prints(historyPhotos) : (
            <>
              <figure className="photo-gallery__item photo-gallery__item--placeholder">
                <div className="photo-gallery__empty" aria-hidden="true"><span>♡</span></div>
                <figcaption>Our story</figcaption>
              </figure>
              <figure className="photo-gallery__item photo-gallery__item--placeholder">
                <div className="photo-gallery__empty" aria-hidden="true"><span>♡</span></div>
                <figcaption>More memories to come</figcaption>
              </figure>
            </>
          )}
        </div>
      </section>

      <dialog
        className="gallery-viewer"
        ref={dialogRef}
        aria-label="Photo viewer"
        onClose={() => setSelection(null)}
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
      >
        {selection && (
          <div className="gallery-viewer__content">
            <button className="gallery-viewer__close" type="button" aria-label="Close photo viewer" onClick={() => dialogRef.current?.close()}>×</button>
            <div className="gallery-viewer__image">
              <Image src={selection.photos[selection.index].src} alt={selection.photos[selection.index].alt} fill sizes="(max-width: 720px) 90vw, 650px" unoptimized />
            </div>
            <div className="gallery-viewer__controls">
              <button type="button" onClick={() => move(-1)} aria-label="Previous photo">←</button>
              <span>{selection.index + 1} / {selection.photos.length}</span>
              <button type="button" onClick={() => move(1)} aria-label="Next photo">→</button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
