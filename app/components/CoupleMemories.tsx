"use client";

import { memoryClient } from "../lib/shared-memories";
import { WeddingWallNote } from "./WeddingWall";

export default function CoupleMemories() {
  return (
    <section className="couple-memories" id="memories" aria-labelledby="memories-heading">
      <div id="wedding-wall">
        <WeddingWallNote shared={Boolean(memoryClient)} />
      </div>
    </section>
  );
}
