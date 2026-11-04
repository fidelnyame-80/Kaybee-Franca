import type { Metadata } from "next";
import WeddingLoader from "./components/WeddingLoader";
import { photos } from "./site-content";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaybee & Franca | Our Wedding",
  description: "Celebrate with Kaybee and Franca. Find wedding details, RSVP, and take a little quiz before the big day.",
  icons: { icon: "/monogram.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href={photos.hero} as="image" fetchPriority="high" />
        <link
          rel="preload"
          href="/fonts/parisienne-normal-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/cormorant-garamond-italic-400-500.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <WeddingLoader>{children}</WeddingLoader>
      </body>
    </html>
  );
}
