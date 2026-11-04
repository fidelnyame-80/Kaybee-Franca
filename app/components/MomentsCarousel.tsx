"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
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
    const loopWidth = () => track.scrollWidth / 2;
    const pauseGlide = () => {
      pauseUntil = performance.now() + 5000;
    };
    const glide = (time: number) => {
      if (previousTime && time > pauseUntil) {
        const distance = Math.min(time - previousTime, 50) * 0.012;
        const halfWidth = loopWidth();
        if (halfWidth > 0) {
          track.scrollLeft += distance;
          if (track.scrollLeft >= halfWidth) track.scrollLeft -= halfWidth;
        }
      }
      previousTime = time;
      frame = window.requestAnimationFrame(glide);
    };
    track.addEventListener("pointerdown", pauseGlide);
    track.addEventListener("pointermove", pauseGlide);
    track.addEventListener("wheel", pauseGlide, { passive: true });
    track.addEventListener("touchstart", pauseGlide, { passive: true });
    track.addEventListener("keydown", pauseGlide);
    frame = window.requestAnimationFrame(glide);

    return () => {
      window.cancelAnimationFrame(frame);
      track.removeEventListener("pointerdown", pauseGlide);
      track.removeEventListener("pointermove", pauseGlide);
      track.removeEventListener("wheel", pauseGlide);
      track.removeEventListener("touchstart", pauseGlide);
      track.removeEventListener("keydown", pauseGlide);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.querySelectorAll<HTMLElement>(".moments-carousel__slide:not([aria-hidden='true'])"));
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) return;

    const observed = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || observed.has(entry.target)) return;
          observed.add(entry.target);
          observer.unobserve(entry.target);
          gsap.fromTo(
            entry.target,
            { autoAlpha: 0, x: 34, rotate: entry.target === slides[1] ? 3 : -3 },
            {
              autoAlpha: 1,
              x: 0,
              rotate: 0,
              duration: 0.8,
              ease: "power3.out",
            },
          );
        });
      },
      { root: track, threshold: 0.2 },
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
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
                sizes="(max-width: 720px) 78vw, 480px"
                unoptimized
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
