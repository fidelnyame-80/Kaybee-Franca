# Kaybee & Franca wedding site

A responsive wedding page with a live wedding countdown, animated photo carousel, photo gallery, guest memory wall, venue directions, gift details, and an interactive ten-question quiz.

## Run locally

```bash
bun install
bun run dev
```

Open http://localhost:3000. Build the static site with `bun run build`.

## Add the photos and details

Put site photos in `public/`, then update the paths and descriptions in [`app/site-content.ts`](app/site-content.ts). The pre-wedding album and carousel use `couplePhotos`. The couple's story photos are in `public/history/`; add entries in chronological order to `storyPhotos`, using `{ src: "/history/2016.jpg", alt: "Description of the photo", year: "2016" }`. An optional `objectPosition` can adjust the crop in the album.

## Previous Supabase wedding memories setup (legacy reference)

The Wedding Memories wall can use a Supabase project so guest photos and short videos are published without approval and the open wall refreshes periodically. Guests can add JPG, PNG, WebP and GIF images up to 15 MB each, and MP4, MOV and WebM videos up to 50 MB each. Larger files use chunked uploads that retry interruptions. Visitors can view and download the memories. Only explicitly authorized moderator accounts can remove shared items. The Supabase storage policies enforce this even if someone alters the website in their browser.

1. Create a Supabase project. In its SQL Editor, run [`supabase/wedding-memories.sql`](supabase/wedding-memories.sql). This creates a public media bucket and the required row-level security policies. If you previously ran the photo-only version, run the updated script again to permit videos and the larger limit. Check that the project's global Storage file-size limit also permits 50 MB uploads.
2. In Supabase Authentication → Users, create an email/password user for the person moderating the wall and confirm the user. In the SQL Editor, replace the address below with that user's email and run the query:

   ```sql
   insert into public.wedding_moderators (user_id)
   select id from auth.users where lower(email) = lower('moderator@example.com')
   on conflict do nothing;
   ```

   Confirm that one row was inserted. Additional moderators can be added the same way. Removing their row revokes moderation access.
3. In the Vercel project's environment settings, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` using the project's URL and publishable key (the legacy anon key also works). These two values are public browser credentials; **never use a service-role or secret key**. Set them for the environments you deploy, then redeploy: Next.js embeds public environment variables at build time.
4. Open the Wedding Wall from the home page and select **Manage memories**. Sign in with the moderator account to show the remove buttons. Removing a memory removes it from the shared wall for everyone.

Until both public settings are configured, the original device-only wall remains available and clearly says that photos are not shared. Photos previously saved in a guest's browser remain on that device and are shown separately after the shared wall is configured; they are never uploaded automatically.

The countdown targets the start of 14 November 2026 in GMT; the ceremony starts at 10:00 AM GMT. Set `countdownTarget` and `startsAt` to ISO timestamps with an explicit UTC offset, and keep `dateDisplay` and `timeDisplay` in sync. Update `public/kaybee-franca-wedding.ics` too if the date, time or venue changes. The timer updates every second and stops at zero.

The same file holds the wedding date, venue, and RSVP contacts. Venue directions request the visitor's location (with browser permission) and show a small embedded route map; visitors can also open the route in Google Maps.

Quiz questions are in [`app/components/Quiz.tsx`](app/components/Quiz.tsx). They are playful guesses and have no right-answer scoring, since the couple's answers have not been supplied.

## Cloudflare R2 wedding wall (new)

The wedding wall now uses Cloudflare R2 for shared photos and videos. Configure the following **server-only** environment variables in Vercel: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`. The public URL must be enabled on the bucket. Do not prefix secrets with `NEXT_PUBLIC_`.

**Required R2 CORS policy**: In Cloudflare R2 → bucket → Settings → CORS, add this policy, replacing the origin with the deployed site URL (add custom-domain origin when applicable):

```json
[
  {
    "AllowedOrigins": ["https://kaybee-franca.vercel.app"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["Content-Type"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Browser uploads use short-lived presigned PUT URLs. The server handles signing, listing, and moderator-authorized deletion. The existing Supabase moderator authentication and `wedding_moderators` table are **still required for deletion**, so retain `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and the existing moderator setup. Public uploads do not require sign-in; consider anti-abuse/rate limiting before distributing widely. R2 media is distinct from previously uploaded Supabase media, which is not migrated automatically.

After merging, install dependencies, verify a production build, redeploy, and test uploading an image and video from a guest browser, viewing from a second device, and deleting while signed in as a moderator. The R2 CORS policy must be active for browser uploads to work.

### Guest-owned deletion

Each new R2 upload receives a private deletion token, stored only in the uploading browser's localStorage. The server stores only a SHA-256 hash of that token as an R2 object under `ownership/`. Guests can delete their own newly uploaded media from the same browser without an account; moderators can still delete any media. Clearing browser storage, switching devices or using private browsing may lose the ability to delete without moderator help. Older uploads created before this feature cannot be deleted by guests. Never expose the deletion token in the public gallery API.
