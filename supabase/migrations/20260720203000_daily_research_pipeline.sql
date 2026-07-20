-- Daily evidence watch. Source metadata may be public; AI-generated lesson/question
-- candidates stay in the existing private review queue until a human approves them.

create table if not exists public.research_items (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references public.certifications(id) on delete cascade,
  provider text not null,
  external_id text not null,
  title text not null,
  authors text,
  journal text,
  published_at date,
  source_url text not null,
  doi text,
  abstract text,
  summary_en text,
  summary_zh text,
  chapter_numbers integer[] not null default '{}',
  relevance numeric(4,3),
  curation_status text not null default 'source_only' check (curation_status in ('source_only', 'ai_draft', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, external_id)
);

create table if not exists public.research_sync_runs (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  status text not null check (status in ('running', 'success', 'failed', 'throttled')),
  found_count integer not null default 0,
  inserted_count integer not null default 0,
  message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

alter table public.research_items enable row level security;
alter table public.research_sync_runs enable row level security;

create policy "research watch is publicly readable"
  on public.research_items for select
  using (curation_status in ('source_only', 'ai_draft', 'approved'));

create index if not exists research_items_recent_idx
  on public.research_items (certification_id, published_at desc, relevance desc);
create index if not exists research_items_chapters_idx
  on public.research_items using gin (chapter_numbers);
create index if not exists research_sync_runs_recent_idx
  on public.research_sync_runs (provider, started_at desc);

