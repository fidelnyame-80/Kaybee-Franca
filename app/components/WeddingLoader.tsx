"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import FloatingMenu from "./FloatingMenu";

export default function WeddingLoader({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderContentRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loader = loaderRef.current;
    const loaderContent = loaderContentRef.current;
    const page = pageRef.current;
    if (!loader || !loaderContent || !page) return;

    let cancelled = false;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const nameParts = loaderContent.querySelectorAll(".wedding-loader__word");
    const ampersand = loaderContent.querySelector(".wedding-loader__ampersand");
    const welcome = loaderContent.querySelector(".wedding-loader__welcome");
    const intro = gsap
      .timeline({ paused: true })
      .fromTo(
        nameParts,
        { autoAlpha: 0, y: 22, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: reduceMotion ? 0 : 0.9,
          stagger: reduceMotion ? 0 : 0.2,
          ease: "power3.out",
        },
      )
      .fromTo(
        ampersand,
        { autoAlpha: 0, scale: 0.72, rotation: -12 },
        {
          autoAlpha: 1,
          scale: 1,
          rotation: 0,
          duration: reduceMotion ? 0 : 0.85,
          ease: "back.out(1.7)",
        },
        reduceMotion ? 0 : 0.28,
      )
      .fromTo(
        welcome,
        { autoAlpha: 0, y: 8 },
        {
          autoAlpha: 1,
          y: 0,
          duration: reduceMotion ? 0 : 0.65,
          ease: "power2.out",
        },
        reduceMotion ? 0 : 0.45,
      );

    let exit: gsap.core.Timeline | undefined;
    let finished = false;
    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      intro.kill();
      exit?.kill();
      window.clearTimeout(fallback);
      gsap.set(page, { clearProps: "transform,opacity,visibility" });
      document.body.style.overflow = previousOverflow;
      window.dispatchEvent(new Event("wedding-site-ready"));
      setIsLoading(false);
    };

    // Do not block the entire website on an image request.
    const fallback = window.setTimeout(finish, 1600);
    intro.timeScale(2).play();
    void intro.then(() => {
      if (cancelled || finished) return;

      exit = gsap
        .timeline({ onComplete: finish })
        .fromTo(
          page,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: reduceMotion ? 0 : 0.5,
            ease: "power2.out",
          },
          0,
        )
        .to(
          loader,
          {
            yPercent: -100,
            duration: reduceMotion ? 0 : 0.8,
            ease: "power3.inOut",
          },
          reduceMotion ? 0 : 0.12,
        )
        .timeScale(2);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      intro.kill();
      exit?.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <>
      <div
        ref={pageRef}
        className="wedding-loader__page"
        aria-busy={isLoading}
        aria-hidden={isLoading}
        inert={isLoading}
      >
        {children}
      </div>
      <FloatingMenu visible={!isLoading} />
      {isLoading && (
        <div
          ref={loaderRef}
          className="wedding-loader"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wedding-loader-welcome wedding-loader-title"
        >
          <div ref={loaderContentRef} className="wedding-loader__content">
            <p id="wedding-loader-welcome" className="wedding-loader__welcome">
              Welcome to our wedding
            </p>
            <h1 id="wedding-loader-title" className="wedding-loader__names">
              <span className="wedding-loader__word">Kaybee</span>{" "}
              <span className="wedding-loader__ampersand">&</span>{" "}
              <span className="wedding-loader__word">Franca</span>
            </h1>
          </div>
        </div>
      )}
    </>
  );
}
