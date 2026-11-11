import type { Metadata } from "next";
import Link from "next/link";
import WeddingWallContent from "../components/WeddingWallContent";

export const metadata: Metadata = {
  title: "Wedding Wall | Kaybee & Franca",
  description: "Share and revisit the moments from Kaybee and Franca's wedding.",
};

export default function WeddingWallPage() {
  return (
    <div className="site-shell wedding-wall-page">
      <header className="wedding-wall-page__nav">
        <Link href="/" className="wedding-wall-page__back">
          <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M16 10H4m0 0 5-5m-5 5 5 5" /></svg>
          BACK TO HOME
        </Link>
        <Link href="/" className="wedding-wall-page__monogram" aria-label="Kaybee and Franca — go to home page">K <span>&amp;</span> F</Link>
      </header>
      <main>
        <WeddingWallContent />
      </main>
      <footer className="wedding-wall-page__footer">
        <p>With love, Kaybee &amp; Franca</p>
        <Link href="/" className="wedding-wall-page__home">BACK TO HOME</Link>
      </footer>
    </div>
  );
}
