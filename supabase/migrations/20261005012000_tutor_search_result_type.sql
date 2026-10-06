-- Keep the RPC result types exact and reject JSON-null diagnostic placeholders.
create or replace function public.search_tutor_library(search_terms text[], preferred_chapter integer default null)
returns table(id text, document_id text, title text, kind text, language text, edition text,
              page integer, chapter integer, content text, extraction text, rank real)
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare q tsquery; terms text[];
begin
  if auth.uid() is null or not exists (
    select 1 from public.user_progress p where p.user_id = auth.uid()
      and p.certification_id = 'nsca-cscs-5'
      and (p.state->>'onboardingChoice' in ('zero','placement') or nullif(p.state->'diagnostic','null'::jsonb) is not null)
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
       case when c.chapter=preferred_chapter then 0.025 else 0 end)::real as score
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
