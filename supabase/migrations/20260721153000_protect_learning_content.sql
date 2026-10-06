-- Learning content and media require an authenticated Cert Loop account.
-- Public certification metadata remains readable for the preview landing page.

drop policy if exists "published lessons are public" on public.lessons;
drop policy if exists "published questions are public" on public.questions;
drop policy if exists "research watch is publicly readable" on public.research_items;

create policy "authenticated learners read published lessons"
  on public.lessons for select
  to authenticated
  using (status = 'published');

create policy "authenticated learners read published questions"
  on public.questions for select
  to authenticated
  using (status = 'published');

create policy "authenticated learners read research watch"
  on public.research_items for select
  to authenticated
  using (curation_status in ('source_only', 'ai_draft', 'reviewed'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('course-media', 'course-media', false, 15728640, array['image/jpeg','image/png'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "authenticated learners read course media" on storage.objects;
create policy "authenticated learners read course media"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'course-media');
