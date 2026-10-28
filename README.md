# Kaybee & Franca wedding site

A responsive wedding page inspired by the supplied reference. It includes a live wedding countdown, RSVP contact numbers, and an interactive ten-question quiz.

## Run locally

```bash
bun install
bun run dev
```

Open http://localhost:3000. Build the static site with `bun run build`.

## Add the photos and details

Put photos in `public/photos/`, then set the paths in [`app/site-content.ts`](app/site-content.ts). The four keys map to the hero, venue, RSVP, and closing photo areas. For example, use `"/photos/hero.jpg"` for a file at `public/photos/hero.jpg`.

The countdown targets the start of 14 November 2026 in GMT; the ceremony starts at 10:00 AM GMT. Set `countdownTarget` and `startsAt` to ISO timestamps with an explicit UTC offset, and keep `dateDisplay` and `timeDisplay` in sync. Update `public/kaybee-franca-wedding.ics` too if the date, time or venue changes. The timer updates every second and stops at zero.

The same file holds the wedding date, venue, directions URL, and RSVP contacts. The directions link searches for the venue address in Google Maps.

Quiz questions are in [`app/components/Quiz.tsx`](app/components/Quiz.tsx). They are playful guesses and have no right-answer scoring, since the couple's answers have not been supplied.
