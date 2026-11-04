# Kaybee & Franca wedding site

A responsive wedding page with a live wedding countdown, animated photo carousel, photo gallery, guest memory wall, venue directions, gift details, and an interactive ten-question quiz.

## Run locally

```bash
bun install
bun run dev
```

Open http://localhost:3000. Build the static site with `bun run build`.

## Add the photos and details

Put site photos in `public/`, then update the paths and descriptions in [`app/site-content.ts`](app/site-content.ts). The home page gallery uses each unique wedding photo; exact duplicate files should only be included once.

The Couple Memories section accepts image uploads and stores them in IndexedDB in the visitor's browser. Since this site is exported as a static site and has no upload service, these photos are private to that browser and device; they are not sent to the site or visible to other guests. Shared uploads require a storage backend.

The countdown targets the start of 14 November 2026 in GMT; the ceremony starts at 10:00 AM GMT. Set `countdownTarget` and `startsAt` to ISO timestamps with an explicit UTC offset, and keep `dateDisplay` and `timeDisplay` in sync. Update `public/kaybee-franca-wedding.ics` too if the date, time or venue changes. The timer updates every second and stops at zero.

The same file holds the wedding date, venue, and RSVP contacts. Venue directions request the visitor's location (with browser permission) and show a small embedded route map; visitors can also open the route in Google Maps.

Quiz questions are in [`app/components/Quiz.tsx`](app/components/Quiz.tsx). They are playful guesses and have no right-answer scoring, since the couple's answers have not been supplied.
