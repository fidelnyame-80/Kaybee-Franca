"use client";

import { useState } from "react";

const moments = [
  "Snap a photo",
  "Compliment an outfit",
  "Meet someone new",
  "Share a laugh",
  "Hit the dance floor",
  "Wish the couple well",
] as const;

export default function WeddingBingo() {
  const [checked, setChecked] = useState<string[]>([]);

  function toggle(moment: string) {
    setChecked((current) =>
      current.includes(moment)
        ? current.filter((item) => item !== moment)
        : [...current, moment],
    );
  }

  return (
    <div className="bingo-card">
      <p className="bingo-card__intro">Tap each little moment as it happens.</p>
      <div className="bingo-card__grid" aria-label="Wedding bingo moments">
        {moments.map((moment) => {
          const selected = checked.includes(moment);
          return (
            <button
              className={`bingo-card__square${selected ? " bingo-card__square--checked" : ""}`}
              type="button"
              key={moment}
              aria-pressed={selected}
              onClick={() => toggle(moment)}
            >
              <span aria-hidden="true">{selected ? "♥" : "✦"}</span>
              {moment}
            </button>
          );
        })}
      </div>
      <p className="bingo-card__progress" role="status">
        {checked.length === moments.length
          ? "A celebration to remember!"
          : `${checked.length} of ${moments.length} moments collected`}
      </p>
    </div>
  );
}
