"use client";

import { WeddingWallNote } from "./WeddingWall";

export default function CoupleMemories({ sharedEnabled }: { sharedEnabled: boolean }) {
  return (
    <section className="couple-memories" id="memories" aria-labelledby="memories-heading">
      <div id="wedding-wall">
        <WeddingWallNote shared={sharedEnabled} />
      </div>
    </section>
  );
}
