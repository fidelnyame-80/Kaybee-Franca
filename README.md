# Kaybee & Franca wedding site

A responsive wedding page with a live wedding countdown, animated photo carousel, photo gallery, guest memory wall, venue directions, gift details, and an interactive ten-question quiz.

## Run locally

```bash
bun install
bun run dev
```

Open http://localhost:3000. Build the static site with `bun run build`.

## Add the photos and details

Put site photos in `public/`, then update the paths and descriptions in [`app/site-content.ts`](app/site-content.ts). Add the couple's story photos in chronological order to `storyPhotos`, using entries such as `{ src: "/story/2016.webp", alt: "Description of the photo", year: "2016" }`. An optional `objectPosition` can adjust the crop in the album.

## Shared guest photos and moderation

The Couple Memories wall can use a Supabase project so photos are published without approval and the open wall refreshes periodically. Guests can add JPG, PNG, WebP and GIF images up to 15 MB each. Only explicitly authorized moderator accounts can remove shared photos. The Supabase storage policies enforce this even if someone alters the website in their browser.

1. Create a Supabase project. In its SQL Editor, run [`supabase/wedding-memories.sql`](supabase/wedding-memories.sql). This creates a public photo bucket and the required row-level security policies.
2. In Supabase Authentication → Users, create an email/password user for the person moderating the wall and confirm the user. In the SQL Editor, replace the address below with that user's email and run the query:

   ```sql
   insert into public.wedding_moderators (user_id)
   select id from auth.users where lower(email) = lower('moderator@example.com')
   on conflict do nothing;
   ```

   Confirm that one row was inserted. Additional moderators can be added the same way. Removing their row revokes moderation access.
3. In the Vercel project's environment settings, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` using the project's URL and publishable key (the legacy anon key also works). These two values are public browser credentials; **never use a service-role or secret key**. Set them for the environments you deploy, then redeploy: Next.js embeds public environment variables at build time.
4. Open the site and select **Manage photos** in Couple Memories. Sign in with the moderator account to show the remove buttons. Removing a photo removes it from the shared wall for everyone.

Until both public settings are configured, the original device-only wall remains available and clearly says that photos are not shared. Photos previously saved in a guest's browser remain on that device and are shown separately after the shared wall is configured; they are never uploaded automatically.

The countdown targets the start of 14 November 2026 in GMT; the ceremony starts at 10:00 AM GMT. Set `countdownTarget` and `startsAt` to ISO timestamps with an explicit UTC offset, and keep `dateDisplay` and `timeDisplay` in sync. Update `public/kaybee-franca-wedding.ics` too if the date, time or venue changes. The timer updates every second and stops at zero.

The same file holds the wedding date, venue, and RSVP contacts. Venue directions request the visitor's location (with browser permission) and show a small embedded route map; visitors can also open the route in Google Maps.

Quiz questions are in [`app/components/Quiz.tsx`](app/components/Quiz.tsx). They are playful guesses and have no right-answer scoring, since the couple's answers have not been supplied.
