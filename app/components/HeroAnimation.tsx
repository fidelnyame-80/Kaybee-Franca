"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

export default function HeroAnimation() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    if (!hero) return;
    let timeline: gsap.core.Timeline | undefined;

    const playEntrance = () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const letters = hero.querySelectorAll<HTMLElement>(".hero__letter");
      timeline = gsap.timeline();

      timeline
        .fromTo(
          ".hero__photo",
          { scale: reduceMotion ? 1 : 1.16, filter: "brightness(.68) blur(5px)" },
          {
            scale: 1,
            filter: "brightness(1) blur(0px)",
            duration: reduceMotion ? 0 : 1.8,
            ease: "power3.out",
          },
        )
        .fromTo(
          ".hero__eyebrow",
          { autoAlpha: 0, y: 22, letterSpacing: ".35em" },
          {
            autoAlpha: 1,
            y: 0,
            letterSpacing: ".12em",
            duration: reduceMotion ? 0 : 0.8,
            ease: "power3.out",
          },
          reduceMotion ? 0 : 0.18,
        )
        .fromTo(
          letters,
          { autoAlpha: 0, yPercent: 70, rotateX: -50, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: reduceMotion ? 0 : 1.15,
            stagger: reduceMotion ? 0 : 0.055,
            ease: "power4.out",
          },
          reduceMotion ? 0 : 0.35,
        )
        .fromTo(
          ".hero__rule",
          { scaleX: 0, transformOrigin: "center" },
          { scaleX: 1, duration: reduceMotion ? 0 : 0.75, ease: "power2.inOut" },
          reduceMotion ? 0 : 0.92,
        )
        .fromTo(
          [".hero__invitation", ".hero__scroll"],
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: reduceMotion ? 0 : 0.7,
            stagger: reduceMotion ? 0 : 0.12,
            ease: "power2.out",
          },
          reduceMotion ? 0 : 1.05,
        );
    };

    window.addEventListener("wedding-site-ready", playEntrance, { once: true });
    return () => {
      window.removeEventListener("wedding-site-ready", playEntrance);
      timeline?.kill();
    };
  }, []);

  return null;
}
