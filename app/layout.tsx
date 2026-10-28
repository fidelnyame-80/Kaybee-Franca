import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaybee & Franca | Our Wedding",
  description: "Celebrate with Kaybee and Franca. Find wedding details, RSVP, and take a little quiz before the big day.",
  icons: { icon: "/monogram.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
