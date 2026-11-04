"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const positions = [
  { top: 4, motif: "curves" }, { top: 10, motif: "shapes" },
  { top: 19, motif: "flower" }, { top: 25, motif: "curves" },
  { top: 34, motif: "ribbon" }, { top: 40, motif: "shapes" },
  { top: 49, motif: "leaves" }, { top: 55, motif: "curves" },
  { top: 64, motif: "shapes" }, { top: 70, motif: "flower" },
  { top: 79, motif: "curves" }, { top: 85, motif: "ribbon" },
  { top: 93, motif: "leaves" }, { top: 97, motif: "shapes" },
] as const;

function Blossom({ x, y, size = 1, turn = 0 }: { x: number; y: number; size?: number; turn?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn}) scale(${size})`}>
      <g className="decorative-vines__petals">
        <ellipse cx="0" cy="-13" rx="9" ry="16" />
        <ellipse cx="0" cy="-13" rx="9" ry="16" transform="rotate(72)" />
        <ellipse cx="0" cy="-13" rx="9" ry="16" transform="rotate(144)" />
        <ellipse cx="0" cy="-13" rx="9" ry="16" transform="rotate(216)" />
        <ellipse cx="0" cy="-13" rx="9" ry="16" transform="rotate(288)" />
      </g>
      <circle className="decorative-vines__center" r="7" />
      <circle className="decorative-vines__center-dot" r="2.5" />
    </g>
  );
}

function FloralSprig() {
  return (
    <svg viewBox="0 0 180 420" fill="none" focusable="false" aria-hidden="true">
      <g className="decorative-vines__stems">
        <path d="M3 411C51 381 70 347 69 307c-1-54 57-66 62-113 4-40-12-59 16-91 16-18 26-48 27-82" />
        <path d="M61 345c-20-28-30-43-30-72M73 300c22-7 45-26 51-49M100 250c-24-19-35-39-38-63M127 204c19-11 30-26 31-49M135 153c-22-14-31-31-33-49M156 93c11-8 19-22 18-36" />
        <path d="M31 273c-9-12-17-18-28-22M124 251c13-5 25-4 37 1M62 187c-8-10-17-15-28-17M102 104c-6-8-14-13-24-14" />
      </g>
      <g className="decorative-vines__leaves">
        <path d="M54 350c-26-1-42-15-44-36 23-2 39 11 44 36Z" />
        <path d="M77 300c4-24 18-38 39-39-1 20-16 35-39 39Z" />
        <path d="M85 271c-25-3-37-18-37-37 21 0 35 13 37 37Z" />
        <path d="M126 215c5-21 17-32 36-32-1 18-15 29-36 32Z" />
        <path d="M129 176c-22-3-32-17-31-34 18 1 30 13 31 34Z" />
        <path d="M150 113c4-19 15-29 32-29-1 17-13 27-32 29Z" />
        <path d="M34 281c-17-2-27-11-29-25 15 0 25 9 29 25Z" />
        <path d="M158 154c-13-6-19-15-17-27 13 4 19 14 17 27Z" />
      </g>
      <g className="decorative-vines__leaf-veins">
        <path d="M16 321l36 27M110 267l-31 31M53 240l30 29M155 189l-27 24M103 148l24 26M175 90l-23 21" />
      </g>
      <Blossom x={28} y={265} size={0.76} turn={-12} />
      <Blossom x={124} y={244} size={0.84} turn={15} />
      <Blossom x={62} y={178} size={0.7} turn={10} />
      <Blossom x={157} y={151} size={0.72} turn={-17} />
      <Blossom x={102} y={96} size={0.55} turn={-8} />
      <g className="decorative-vines__buds">
        <ellipse cx="174" cy="48" rx="5" ry="10" transform="rotate(18 174 48)" />
        <ellipse cx="5" cy="250" rx="5" ry="9" transform="rotate(-36 5 250)" />
        <ellipse cx="159" cy="251" rx="5" ry="9" transform="rotate(62 159 251)" />
      </g>
    </svg>
  );
}

function LeafSprig() {
  return (
    <svg viewBox="0 0 180 420" fill="none" focusable="false" aria-hidden="true">
      <g className="decorative-vines__stems">
        <path d="M3 408C65 369 55 312 97 263c30-34 25-67 34-100 8-32 30-59 35-112" />
        <path d="M43 363c-14-21-24-36-27-62M64 325c20-14 37-27 44-48M81 284c-17-20-26-38-26-62M104 250c19-11 32-24 36-43M117 202c-16-16-22-33-23-52M130 162c16-10 28-23 31-40M145 113c-11-12-17-27-15-43" />
      </g>
      <g className="decorative-vines__leaves">
        <path d="M42 357C20 354 7 341 7 322c20 1 33 14 35 35Z" />
        <path d="M65 320c4-22 18-36 38-37-2 20-16 33-38 37Z" />
        <path d="M79 280c-22-2-34-15-34-33 20 1 32 13 34 33Z" />
        <path d="M102 246c4-20 17-32 35-33-2 18-14 30-35 33Z" />
        <path d="M115 198c-20-2-30-14-29-31 18 2 28 13 29 31Z" />
        <path d="M128 158c3-18 15-29 31-29-1 16-12 27-31 29Z" />
        <path d="M143 109c-17-3-25-14-23-28 16 2 24 13 23 28Z" />
        <path d="M164 67c-9-11-10-23-2-35 10 10 11 22 2 35Z" />
      </g>
      <g className="decorative-vines__leaf-veins">
        <path d="m13 328 27 27m57-66-30 29m-17-65 27 25m54-59-27 25m-14-70 23 22m40-61-23 21m-7-69 18 20" />
      </g>
      <g className="decorative-vines__buds">
        <ellipse cx="16" cy="299" rx="4" ry="8" transform="rotate(-27 16 299)" />
        <ellipse cx="140" cy="205" rx="4" ry="8" transform="rotate(28 140 205)" />
        <ellipse cx="94" cy="147" rx="4" ry="8" transform="rotate(-15 94 147)" />
      </g>
    </svg>
  );
}

function RibbonMotif() {
  return (
    <svg viewBox="0 0 180 250" fill="none" focusable="false" aria-hidden="true">
      <g className="decorative-vines__ribbon">
        <path d="M18 195c44-6 62-36 73-67 11-31 21-53 50-57" />
        <path d="M91 128c-22-7-40-24-31-37 7-11 26-3 34 17 2 5 2 13-3 20Zm2 0c5-20 21-40 34-31 14 10-5 26-34 31Z" />
        <path d="M92 128c-7 18-10 35-4 50m5-49c12 14 21 23 39 27" />
        <path d="M36 207c45-3 70-25 84-53" />
      </g>
      <g className="decorative-vines__sparkles">
        <path d="M137 37c0 11-5 16-14 16 9 0 14 5 14 16 0-11 5-16 14-16-9 0-14-5-14-16Z" />
        <path d="M39 77c0 7-3 10-9 10 6 0 9 3 9 10 0-7 3-10 9-10-6 0-9-3-9-10Z" />
        <circle cx="118" cy="190" r="2.5" />
        <circle cx="61" cy="54" r="2" />
      </g>
    </svg>
  );
}

function CurveMotif() {
  return (
    <svg viewBox="0 0 180 420" fill="none" focusable="false" aria-hidden="true">
      <g className="decorative-vines__curves">
        <path d="M-12 385c61-13 112-46 112-93 0-36-43-53-42-85 1-29 40-43 72-37 28 5 42 27 31 45-8 13-31 11-40-1-12-16-3-39 13-56 20-22 42-42 52-78" />
        <path d="M-10 400c67-18 124-53 125-106 1-35-38-58-37-84 1-18 22-27 43-25" />
        <path d="M13 122c19-17 49-16 66-3 13 10 15 27 3 34-9 6-22 1-22-9" />
        <path d="M108 75c13-14 33-18 50-11" />
      </g>
      <g className="decorative-vines__forms">
        <path d="M122 286c16-13 35-5 35 10s-19 21-34 10c-8-6-8-14-1-20Z" />
        <ellipse cx="39" cy="182" rx="11" ry="18" transform="rotate(-32 39 182)" />
      </g>
      <g className="decorative-vines__sparkles">
        <path d="M135 99c0 10-4 14-12 14 8 0 12 4 12 14 0-10 4-14 12-14-8 0-12-4-12-14Z" />
        <circle cx="143" cy="336" r="2.5" />
        <circle cx="24" cy="244" r="2" />
      </g>
    </svg>
  );
}

function ShapesMotif() {
  return (
    <svg viewBox="0 0 180 420" fill="none" focusable="false" aria-hidden="true">
      <g className="decorative-vines__curves">
        <path d="M-8 373c55 3 97-19 117-56 18-33 16-65 47-85 13-8 27-11 40-11" />
        <path d="M-7 387c60 3 106-20 128-58 19-32 19-58 49-73" />
        <path d="M21 97c21-17 48-19 70-7 23 13 24 36 10 43-11 6-24-1-23-12 1-12 18-18 34-14 18 5 33 17 56 15" />
        <path d="M61 276c21-8 41-5 54 6" />
      </g>
      <g className="decorative-vines__forms">
        <path d="M122 144c14-13 35-10 42 3 8 15-6 27-21 25-17-2-32-17-21-28Z" />
        <ellipse cx="47" cy="205" rx="13" ry="19" transform="rotate(32 47 205)" />
        <circle cx="145" cy="355" r="5" />
      </g>
      <g className="decorative-vines__sparkles">
        <path d="M137 49c0 10-4 14-12 14 8 0 12 4 12 14 0-10 4-14 12-14-8 0-12-4-12-14Z" />
        <path d="M51 302c0 7-3 10-9 10 6 0 9 3 9 10 0-7 3-10 9-10-6 0-9-3-9-10Z" />
        <circle cx="112" cy="201" r="2.5" />
        <circle cx="37" cy="153" r="2" />
      </g>
    </svg>
  );
}

function Ornament({ motif }: { motif: typeof positions[number]["motif"] }) {
  switch (motif) {
    case "flower": return <FloralSprig />;
    case "leaves": return <LeafSprig />;
    case "ribbon": return <RibbonMotif />;
    case "curves": return <CurveMotif />;
    case "shapes": return <ShapesMotif />;
  }
}

function useFloralMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ornaments = rootRef.current?.querySelectorAll<HTMLElement>(".decorative-vines__ornament") ?? [];
      ornaments.forEach((ornament, index) => {
        gsap.fromTo(ornament, { y: index % 2 ? 34 : 42, rotation: index % 2 ? -5 : 5, autoAlpha: 0.35 }, {
          y: index % 2 ? -38 : -30,
          rotation: index % 2 ? 5 : -5,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ornament,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    return () => media.revert();
  }, [rootRef]);
}

export default function DecorativeVines() {
  const rootRef = useRef<HTMLDivElement>(null);
  useFloralMotion(rootRef);

  return (
    <div ref={rootRef} className="decorative-vines" aria-hidden="true">
      {positions.map(({ top, motif }, index) => (
        <div
          key={top}
          className={`decorative-vines__ornament decorative-vines__ornament--${index % 2 ? "right" : "left"}`}
          style={{ top: `${top}%` }}
        >
          <Ornament motif={motif} />
        </div>
      ))}
    </div>
  );
}

export function InvitationFlorals() {
  const rootRef = useRef<HTMLDivElement>(null);
  useFloralMotion(rootRef);

  return (
    <div ref={rootRef} className="invitation-florals" aria-hidden="true">
      {["top-left", "top-right", "bottom-left", "bottom-right"].map((placement, index) => (
        <div
          key={placement}
          className={`decorative-vines__ornament invitation-florals__sprig invitation-florals__sprig--${placement}${index % 2 ? " decorative-vines__ornament--right" : ""}`}
        >
          <Ornament motif={index === 0 || index === 3 ? "curves" : "shapes"} />
        </div>
      ))}
    </div>
  );
}
