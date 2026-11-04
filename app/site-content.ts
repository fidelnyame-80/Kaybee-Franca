// Replace these details and photo paths when they are ready.
// Photos in public are referenced from the root, like "/image4.webp".
export const wedding = {
  dateDisplay: "Saturday, 14 November 2026",
  // Keep an explicit UTC offset so every guest counts down to the same instant.
  startsAt: "2026-11-14T10:00:00+00:00",
  countdownTarget: "2026-11-14T00:00:00+00:00",
  timeDisplay: "10:00 AM GMT",
  venueName: "Anointed People Int.",
  venueDescription: "Foster Home, Adenta-Frafraha",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Anointed+People+Int.+Foster+Home+Adenta-Frafraha",
  rsvpContacts: [
    { name: "Racheal", phone: "0241037912" },
    { name: "Mabee", phone: "0241451898" },
    { name: "Derrick", phone: "0549242672" },
  ],
};

export const photos = {
  hero: "/image4.webp",
  venue: "/anointedPeople.webp",
  rsvp: "/image1.webp",
  closing: "/image3.webp",
};

export const couplePhotos = [
  { src: "/image1.webp", alt: "Kaybee and Franca smiling together" },
  { src: "/image2.webp", alt: "Kaybee and Franca dressed in black" },
  { src: "/image3.webp", alt: "Kaybee and Franca outdoors" },
  { src: "/image4.webp", alt: "Kaybee carrying Franca" },
  { src: "/image6.webp", alt: "A cherished moment from Kaybee and Franca's story" },
  { src: "/image7.webp", alt: "A cherished moment from Kaybee and Franca's story" },
  { src: "/image8.webp", alt: "A cherished moment from Kaybee and Franca's story" },
  { src: "/image9.webp", alt: "A cherished moment from Kaybee and Franca's story" },
];

export const galleryPhotos = couplePhotos;

export const preloadImages = Array.from(
  new Set([
    ...Object.values(photos),
    ...couplePhotos.map(({ src }) => src),
    "/botanical.svg",
  ]),
);
