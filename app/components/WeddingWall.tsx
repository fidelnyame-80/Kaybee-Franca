"use client";

import Image from "next/image";
import Link from "next/link";
import { type ChangeEventHandler, type ReactNode, type Ref } from "react";
import ScrollReveal from "./ScrollReveal";

export function WeddingWallNote({ shared }: { shared: boolean }) {
  return (
    <ScrollReveal className="wedding-wall__welcome">
      <p className="section-kicker">MADE MORE SPECIAL BY YOU</p>
      <div className="wedding-wall__note">
        <p className="wedding-wall__note-kicker">A LITTLE NOTE FROM US</p>
        <h2 id="memories-heading">Wedding <em>memories</em></h2>
        <span className="wedding-wall__note-rule" aria-hidden="true">♡</span>
        <p className="wedding-wall__note-copy">The laughter, the happy tears, the little moments our camera team might miss. Share your wedding-day photos and videos, and come back to relive them with us.</p>
        <div className="wedding-wall__actions">
          <Link className="wedding-wall__view" href="/wedding-wall">VIEW WEDDING WALL <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 4l11 11M6 15h9V6" /></svg></Link>
          <Link className="couple-memories__upload wedding-wall__add" href="/wedding-wall#add-to-wedding-wall"><span aria-hidden="true">＋</span>ADD TO WEDDING WALL</Link>
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

type WeddingWallPageIntroProps = {
  shared: boolean;
  accept: string;
  disabled: boolean;
  isUploading: boolean;
  onUpload: ChangeEventHandler<HTMLInputElement>;
};

export function WeddingWallPageIntro({ shared, accept, disabled, isUploading, onUpload }: WeddingWallPageIntroProps) {
  return (
    <div className="wedding-wall-page__intro">
      <p className="section-kicker">THE LITTLE MOMENTS, ALL TOGETHER</p>
      <h1 id="wedding-wall-page-heading">Our wedding <em>wall</em></h1>
      <p>A place for the laughter, the happy tears, and all the moments we&apos;ll want to remember.</p>
      <div className="wedding-wall-page__add" id="add-to-wedding-wall">
        <label className="couple-memories__upload wedding-wall-page__upload">
          <input type="file" accept={accept} multiple disabled={disabled} onChange={onUpload} />
          <span aria-hidden="true">＋</span>
          {isUploading ? "ADDING MEMORIES…" : shared ? "ADD PHOTOS & VIDEOS" : "ADD YOUR PHOTOS"}
        </label>
        <p className="wedding-wall__note-status">
          {shared
            ? "Everyone can view and download what you share. Photos up to 15 MB; videos up to 50 MB."
            : "Sharing isn't ready yet. For now, only photos can be saved on this device."}
        </p>
      </div>
    </div>
  );
}

export function WeddingWall({ children, galleryRef }: { children?: ReactNode; galleryRef?: Ref<HTMLDivElement> }) {
  return (
    <section className="wedding-wall" id="wedding-wall" aria-labelledby="wedding-wall-heading">
      <div className="wedding-wall__heading">
        <p>OUR WEDDING WALL</p>
        <h2 id="wedding-wall-heading">Moments to <em>keep</em></h2>
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
