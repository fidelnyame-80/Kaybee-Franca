"use client";

import { useEffect, useRef, useState } from "react";

const pieces = Array.from({ length: 64 }, (_, i) => ({
  left: `${(i * 37.7 + 9) % 100}%`,
  delay: `${(i % 12) * 0.11}s`,
  duration: `${3.3 + (i % 7) * 0.19}s`,
  drift: `${(i % 2 ? 1 : -1) * (15 + (i * 13) % 70)}px`,
  rotation: `${(i * 43) % 360}deg`,
  color: ["#ef4286", "#eebd4c", "#9b204b", "#f48b39", "#d65381", "#c94e09"][i % 6],
}));

export default function InvitationConfetti() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const section = ref.current?.closest(".wedding-invitation");
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`invitation-confetti${started ? " invitation-confetti--started" : ""}`} aria-hidden="true">
    {pieces.map((piece, i) => <span key={i} className="invitation-confetti__piece" style={{
      left: piece.left,
      animationDelay: piece.delay,
      animationDuration: piece.duration,
      backgroundColor: piece.color,
      ["--confetti-drift" as string]: piece.drift,
      ["--confetti-rotation" as string]: piece.rotation,
    }} />)}
  </div>;
}
