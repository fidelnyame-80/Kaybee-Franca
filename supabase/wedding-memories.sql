-- Run once in the SQL editor of a new Supabase project.
-- Guest uploads are public; only accounts listed in wedding_moderators can delete.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wedding-memories',
  'wedding-memories',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.wedding_moderators (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.wedding_moderators enable row level security;
revoke all on public.wedding_moderators from public, anon, authenticated;
grant select on public.wedding_moderators to authenticated;

drop policy if exists "Moderators can see their own access" on public.wedding_moderators;
create policy "Moderators can see their own access"
  on public.wedding_moderators for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Anyone can list wedding memories" on storage.objects;
create policy "Anyone can list wedding memories"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'wedding-memories' and (storage.foldername(name))[1] = 'uploads');

drop policy if exists "Guests can add wedding memories" on storage.objects;
create policy "Guests can add wedding memories"
  on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'wedding-memories'
    and (storage.foldername(name))[1] = 'uploads'
    and array_length(storage.foldername(name), 1) = 1
  );

drop policy if exists "Moderators can remove wedding memories" on storage.objects;
create policy "Moderators can remove wedding memories"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'wedding-memories'
    and (storage.foldername(name))[1] = 'uploads'
    and exists (select 1 from public.wedding_moderators where user_id = (select auth.uid()))
  );
