"use client";

import { useEffect, useState } from "react";

type CountdownProps = { target: string };

const confetti = Array.from({ length: 42 }, (_, i) => ({
  left: `${(i * 37.7 + 9) % 100}%`,
  delay: `${-((i * 0.71) % 9)}s`,
  duration: `${5 + (i % 6) * 0.75}s`,
  drift: `${(i % 2 ? 1 : -1) * (20 + (i * 13) % 75)}px`,
  rotation: `${(i * 43) % 360}deg`,
  color: ["#ef4286", "#eebd4c", "#9b204b", "#f48b39", "#fff2c0", "#c94e09"][i % 6],
}));

export default function Countdown({ target }: CountdownProps) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const targetTime = new Date(target).getTime();
    const update = () => setRemaining(Math.max(0, Math.ceil((targetTime - Date.now()) / 1000)));
    const initialTick = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, [target]);

  const units = [
    { label: "Days", value: remaining === null ? null : Math.floor(remaining / 86400) },
    { label: "Hours", value: remaining === null ? null : Math.floor((remaining % 86400) / 3600) },
    { label: "Minutes", value: remaining === null ? null : Math.floor((remaining % 3600) / 60) },
    { label: "Seconds", value: remaining === null ? null : remaining % 60 },
  ];

  return (
    <div className="countdown">
      <div className="countdown__confetti" aria-hidden="true">
        {confetti.map((piece, i) => (
          <span key={i} className="countdown__confetti-piece" style={{
            left: piece.left,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            backgroundColor: piece.color,
            ["--confetti-drift" as string]: piece.drift,
            ["--confetti-rotation" as string]: piece.rotation,
          }} />
        ))}
      </div>
      <div className="countdown__foreground">
        <p className={`countdown__caption${remaining === 0 ? " countdown__caption--celebration" : ""}`} role="status">
          {remaining === 0 ? "It's our wedding!" : "Until our wedding day"}
        </p>
        {remaining !== 0 && <dl className="countdown__clock" role="timer" aria-label="Time until our wedding" aria-live="off">
          {units.map(({ label, value }) => (
            <div className="countdown__unit" key={label}>
              <dt className="countdown__label">{label}</dt>
              <dd className="countdown__number">{value === null ? "—" : String(value).padStart(2, "0")}</dd>
            </div>
          ))}
        </dl>}
      </div>
    </div>
  );
}
