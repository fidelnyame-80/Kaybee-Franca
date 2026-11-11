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

// The couple's story, in chronological order.
export const storyPhotos: { src: string; alt: string; year: string; objectPosition?: string }[] = [
  { year: "2016", src: "/history/2016.jpg", alt: "Side-by-side portraits of Kaybee and Franca in 2016", objectPosition: "50% 0%" },
  { year: "2017", src: "/history/2017.jpg", alt: "Kaybee and Franca smiling in a black-and-white selfie in 2017", objectPosition: "0% 50%" },
  { year: "2018", src: "/history/2018.jpg", alt: "Kaybee and Franca smiling outdoors in 2018" },
  { year: "2019", src: "/history/2019.jpg", alt: "Kaybee and Franca with a loved one in 2019" },
  { year: "2020", src: "/history/2020.jpg", alt: "Kaybee and Franca together at a table in 2020" },
  { year: "2021", src: "/history/2021.jpg", alt: "Kaybee and Franca in a group photo in 2021", objectPosition: "50% 25%" },
  { year: "2022", src: "/history/2022.jpg", alt: "Kaybee and Franca beside a birthday cake in 2022" },
  { year: "2023", src: "/history/2023.jpg", alt: "Kaybee and Franca smiling together in 2023", objectPosition: "55% 50%" },
  { year: "2024", src: "/history/2024.jpg", alt: "Kaybee and Franca dressed up together outdoors in 2024" },
];
