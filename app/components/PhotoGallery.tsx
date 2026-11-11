"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { couplePhotos, storyPhotos } from "../site-content";

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

  // Keep the central message in the same position while photos are being added.
  const slots = Array.from({ length: Math.max(8, storyPhotos.length) }, (_, index) => storyPhotos[index]);

  return (
    <div className="photo-gallery__chapters">
      <section className="photo-gallery__chapter" aria-labelledby="pre-wedding-heading">
        <div className="photo-gallery__chapter-heading">
          <span className="photo-gallery__chapter-number" aria-hidden="true">01</span>
          <div>
            <p>THE DAYS BEFORE FOREVER</p>
            <h3 id="pre-wedding-heading">Pre-wedding <em>Photoshoot</em></h3>
          </div>
        </div>
        <div className="photo-gallery__grid">
          {couplePhotos.map((photo, index) => (
            <figure className="photo-gallery__item" key={photo.src}>
              <button
                className="photo-gallery__photo"
                type="button"
                aria-label={`View pre-wedding photo ${index + 1}: ${photo.alt}`}
                onClick={() => setSelection({ photos: couplePhotos, index })}
              >
                <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 720px) 42vw, 270px" unoptimized />
              </button>
              <figcaption><span>{String(index + 1).padStart(2, "0")}</span> Kaybee &amp; Franca</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="photo-gallery__chapter" id="history" aria-labelledby="history-heading">
        <div className="photo-gallery__chapter-heading">
          <span className="photo-gallery__chapter-number" aria-hidden="true">02</span>
          <div>
            <p>THE STORY THAT BROUGHT US HERE</p>
            <h3 id="history-heading">Our <em>History</em></h3>
          </div>
        </div>
        <div className="story-album">
          <div className="story-album__grid">
            {slots.map((photo, index) => (
              <Fragment key={photo ? `${photo.year}-${photo.src}` : `empty-${index}`}>
                {index === 4 && (
                  <div className="story-album__message">
                    <h4><span className="story-album__message-line">10 Years of</span>{" "}Friendship <span>&amp; Loyalty</span></h4>
                    <p className="story-album__signature">Kaybee &amp; Franca</p>
                  </div>
                )}
                {photo ? (
                  <figure className="story-album__print">
                    <button
                      className="story-album__photo"
                      type="button"
                      aria-label={`View ${photo.year} photo: ${photo.alt}`}
                      onClick={() => setSelection({ photos: storyPhotos, index })}
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
