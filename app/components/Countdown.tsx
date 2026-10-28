"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  target: string;
};

export default function Countdown({ target }: CountdownProps) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [dayHasPassed, setDayHasPassed] = useState(false);

  useEffect(() => {
    const targetDate = new Date(target);
    const targetTime = targetDate.getTime();
    // The wedding is in Ghana (GMT); the wedding day ends at midnight GMT.
    const dayEnd = Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate() + 1);
    const update = () => {
      const now = Date.now();
      setRemaining(Math.max(0, Math.ceil((targetTime - now) / 1000)));
      setDayHasPassed(now >= dayEnd);
    };

    // Hydrate with the same placeholder as the static HTML, then use the clock.
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
      <p className="countdown__caption" role="status">
        {remaining === 0
          ? dayHasPassed ? "Thank you for celebrating with us" : "It's wedding day!"
          : "Until our wedding day"}
      </p>
      {remaining !== 0 && <dl className="countdown__clock" role="timer" aria-label="Time until our wedding" aria-live="off">
        {units.map(({ label, value }) => (
          <div className="countdown__unit" key={label}>
            <dt className="countdown__label">{label}</dt>
            <dd className="countdown__number">
              {value === null ? "—" : String(value).padStart(2, "0")}
            </dd>
          </div>
        ))}
      </dl>}
    </div>
  );
}
