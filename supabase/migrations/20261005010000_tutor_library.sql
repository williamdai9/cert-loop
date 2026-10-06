-- On-demand tutor evidence, separate from published lessons and question banks.
-- Raw files/chunks are never part of the public application bundle.
create table public.tutor_documents (
  id text primary key,
  title text not null,
  original_name text not null,
  kind text not null check (kind in ('textbook','note','mindmap','practice','outline')),
  language text not null,
  edition text,
  sha256 text not null,
  metadata jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create table public.tutor_chunks (
  id text primary key,
  document_id text not null references public.tutor_documents(id) on delete cascade,
  page integer,
  chapter integer,
  content text not null check (length(content) <= 2600),
  extraction text not null,
  search_vector tsvector generated always as (to_tsvector('english', content)) stored
);
create index tutor_chunks_search on public.tutor_chunks using gin(search_vector);
create index tutor_chunks_document on public.tutor_chunks(document_id);
alter table public.tutor_documents enable row level security;
alter table public.tutor_chunks enable row level security;
-- No direct client policies: only the bounded, signed-in RPC can return excerpts.
revoke all on public.tutor_documents, public.tutor_chunks from anon, authenticated;
grant all on public.tutor_documents, public.tutor_chunks to service_role;

create function public.search_tutor_library(search_terms text[], preferred_chapter integer default null)
returns table(id text, document_id text, title text, kind text, language text, edition text,
              page integer, chapter integer, content text, extraction text, rank real)
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare q tsquery; terms text[];
begin
  if auth.uid() is null or not exists (
    select 1 from public.user_progress p where p.user_id = auth.uid()
      and p.certification_id = 'nsca-cscs-5'
      and (p.state->>'onboardingChoice' in ('zero','placement') or p.state->'diagnostic' is not null)
  ) then raise insufficient_privilege using message = 'Choose a starting point before using the AI Tutor.'; end if;
  select array_agg(left(t,80)) into terms from (select unnest(search_terms[1:20]) t) x where length(t) between 2 and 80;
  if terms is null then return; end if;
  select string_agg(plainto_tsquery('english',t)::text, ' | ')::tsquery into q
    from unnest(terms) t where t ~ '[a-zA-Z]' and numnode(plainto_tsquery('english',t)) > 0;
  return query
  with matches as (
    select c.*, d.title, d.kind, d.language, d.edition,
      (coalesce(ts_rank_cd(c.search_vector,q),0) +
       (select count(*)::real * 0.06 from unnest(terms) t where
         position(lower(t) in lower(c.content)) > 0) +
       case when c.chapter=preferred_chapter then 0.025 else 0 end) as score
    from public.tutor_chunks c join public.tutor_documents d on d.id=c.document_id
    where c.search_vector @@ q or exists (
      select 1 from unnest(terms) t where t ~ '[一-鿿]' and position(t in c.content)>0
    )
  ), ranked as (
    select m.*, row_number() over(partition by m.kind order by m.score desc, m.id) as position
    from matches m
  )
  select r.id,r.document_id,r.title,r.kind,r.language,r.edition,r.page,r.chapter,r.content,r.extraction,r.score
  from ranked r where r.position <= case when r.kind='textbook' then 6 when r.kind='mindmap' then 3 else 2 end
  order by r.score desc, r.id limit 15;
end $$;
revoke all on function public.search_tutor_library(text[],integer) from public, anon;
grant execute on function public.search_tutor_library(text[],integer) to authenticated;

-- Counts only, no filenames or content. This reports actual indexed coverage.
create function public.tutor_library_status()
returns table(kind text, documents bigint, chunks bigint, updated_at timestamptz)
language sql stable security definer set search_path=public,pg_temp as $$
  select d.kind,count(distinct d.id),count(c.id),max(d.updated_at)
  from public.tutor_documents d join public.tutor_chunks c on c.document_id=d.id
  where auth.uid() is not null group by d.kind;
$$;
revoke all on function public.tutor_library_status() from public, anon;
grant execute on function public.tutor_library_status() to authenticated;
