"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { couplePhotos } from "../site-content";

export default function MomentsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startScroll: number } | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let previousTime = 0;
    let pauseUntil = 0;
    let interacting = false;
    const slides = track.querySelectorAll<HTMLElement>(".moments-carousel__slide");
    const loopWidth = () => {
      const first = slides[0];
      const clone = slides[couplePhotos.length];
      return first && clone ? clone.offsetLeft - first.offsetLeft : track.scrollWidth / 2;
    };
    const pauseGlide = () => { pauseUntil = performance.now() + 1400; };
    const startInteraction = () => { interacting = true; pauseGlide(); };
    const endInteraction = () => { interacting = false; pauseGlide(); };
    const glide = (time: number) => {
      if (previousTime && !interacting && time >= pauseUntil && !document.hidden) {
        const distance = Math.min(time - previousTime, 50) * 0.035;
        const width = loopWidth();
        if (width > 0) {
          track.scrollLeft += distance;
          if (track.scrollLeft >= width) track.scrollLeft -= width;
        }
      }
      previousTime = time;
      frame = window.requestAnimationFrame(glide);
    };

    track.addEventListener("pointerdown", startInteraction);
    window.addEventListener("pointerup", endInteraction);
    window.addEventListener("pointercancel", endInteraction);
    track.addEventListener("wheel", pauseGlide, { passive: true });
    track.addEventListener("touchstart", startInteraction, { passive: true });
    track.addEventListener("touchend", endInteraction);
    track.addEventListener("touchcancel", endInteraction);
    track.addEventListener("mouseenter", startInteraction);
    track.addEventListener("mouseleave", endInteraction);
    track.addEventListener("focusin", startInteraction);
    track.addEventListener("focusout", endInteraction);
    track.addEventListener("keydown", pauseGlide);
    frame = window.requestAnimationFrame(glide);

    return () => {
      window.cancelAnimationFrame(frame);
      track.removeEventListener("pointerdown", startInteraction);
      window.removeEventListener("pointerup", endInteraction);
      window.removeEventListener("pointercancel", endInteraction);
      track.removeEventListener("wheel", pauseGlide);
      track.removeEventListener("touchstart", startInteraction);
      track.removeEventListener("touchend", endInteraction);
      track.removeEventListener("touchcancel", endInteraction);
      track.removeEventListener("mouseenter", startInteraction);
      track.removeEventListener("mouseleave", endInteraction);
      track.removeEventListener("focusin", startInteraction);
      track.removeEventListener("focusout", endInteraction);
      track.removeEventListener("keydown", pauseGlide);
    };
  }, []);

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const track = event.currentTarget;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: track.scrollLeft,
    };
    track.setPointerCapture(event.pointerId);
  };

  const continueDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.currentTarget.scrollLeft = drag.startScroll - (event.clientX - drag.startX);
  };

  const stopDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="moments-carousel">
      <div
        ref={trackRef}
        className="moments-carousel__track"
        aria-label="A little look at Kaybee and Franca; swipe or scroll to explore"
        tabIndex={0}
        onPointerDown={startDrag}
        onPointerMove={continueDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        {[...couplePhotos, ...couplePhotos].map((photo, index) => {
          const isClone = index >= couplePhotos.length;
          return (
            <figure
              className="moments-carousel__slide"
              key={`${photo.src}-${index}`}
              aria-hidden={isClone || undefined}
            >
              <Image
                src={photo.src}
                alt={isClone ? "" : photo.alt}
                fill
                sizes="(max-width: 720px) 66vw, 480px"
                loading="lazy"
                quality={65}
              />
              <figcaption>
                <span>{String((index % couplePhotos.length) + 1).padStart(2, "0")}</span>
                {(index % couplePhotos.length) === 0 ? "A little look at us" : "Our kind of forever"}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
