"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { galleryPhotos } from "../site-content";

export default function PhotoGallery() {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const cards = Array.from(
      gallery.querySelectorAll<HTMLElement>(".photo-gallery__item"),
    );
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          const index = cards.indexOf(entry.target as HTMLElement);
          gsap.fromTo(
            entry.target,
            { autoAlpha: 0, y: 28, rotate: index % 2 ? 2 : -2 },
            {
              autoAlpha: 1,
              y: 0,
              rotate: 0,
              duration: 0.7,
              ease: "power3.out",
            },
          );
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={galleryRef} className="photo-gallery__grid">
      {galleryPhotos.map((photo, index) => (
        <figure className="photo-gallery__item" key={photo.src}>
          <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) 44vw, 230px" unoptimized />
          <figcaption>
            <span>0{index + 1}</span> Kaybee & Franca
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
