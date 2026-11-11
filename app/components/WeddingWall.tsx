"use client";

import Image from "next/image";
import { type ChangeEventHandler, type ReactNode, type Ref } from "react";
import ScrollReveal from "./ScrollReveal";

type WeddingWallNoteProps = {
  shared: boolean;
  accept: string;
  disabled: boolean;
  isUploading: boolean;
  onUpload: ChangeEventHandler<HTMLInputElement>;
};

export function WeddingWallNote({ shared, accept, disabled, isUploading, onUpload }: WeddingWallNoteProps) {
  return (
    <ScrollReveal className="wedding-wall__welcome">
      <p className="section-kicker">MADE MORE SPECIAL BY YOU</p>
      <div className="wedding-wall__note">
        <p className="wedding-wall__note-kicker">A LITTLE NOTE FROM US</p>
        <h2 id="memories-heading">Wedding <em>memories</em></h2>
        <span className="wedding-wall__note-rule" aria-hidden="true">♡</span>
        <p className="wedding-wall__note-copy">The laughter, the happy tears, the little moments our camera team might miss. Share your wedding-day photos and videos, and come back to relive them with us.</p>
        <div className="wedding-wall__actions">
          <a className="wedding-wall__view" href="#wedding-wall">VIEW WEDDING WALL <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 4l11 11M6 15h9V6" /></svg></a>
          <label className="couple-memories__upload wedding-wall__add">
            <input type="file" accept={accept} multiple disabled={disabled} onChange={onUpload} />
            <span aria-hidden="true">＋</span>
            {isUploading ? "ADDING MEMORIES…" : "ADD TO WEDDING WALL"}
          </label>
        </div>
        <p className="wedding-wall__note-status">
          {shared
            ? "Everyone can view and download what you share. Photos up to 15 MB; videos up to 50 MB."
            : "Sharing isn't ready yet. For now, only photos can be saved on this device."}
        </p>
        <p className="wedding-wall__signature">With love, Kaybee &amp; Franca</p>
      </div>
    </ScrollReveal>
  );
}

export function WeddingWall({ children, galleryRef }: { children?: ReactNode; galleryRef?: Ref<HTMLDivElement> }) {
  return (
    <section className="wedding-wall" id="wedding-wall" aria-labelledby="wedding-wall-heading">
      <div className="wedding-wall__heading">
        <p>OUR WEDDING WALL</p>
        <h3 id="wedding-wall-heading">Moments to <em>keep</em></h3>
        <span>Every picture tells a part of our story.</span>
      </div>
      <div className="couple-memories__gallery" ref={galleryRef}>
        <figure className="couple-memories__card wedding-wall__feature">
          <div className="couple-memories__photo"><Image src="/image1.webp" alt="Kaybee and Franca smiling together at their pre-wedding photoshoot" fill sizes="(max-width: 900px) 44vw, 230px" unoptimized /></div>
          <figcaption>A little piece of us</figcaption>
        </figure>
        <figure className="couple-memories__card wedding-wall__feature">
          <div className="couple-memories__photo"><Image src="/image4.webp" alt="Kaybee carrying Franca at their pre-wedding photoshoot" fill sizes="(max-width: 900px) 44vw, 230px" unoptimized /></div>
          <figcaption>To new beginnings</figcaption>
        </figure>
        {children}
      </div>
    </section>
  );
}
