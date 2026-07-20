-- Cert Loop: content, versioning, and per-user study progress.
-- Run this once in a dedicated Supabase project's SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.certifications (
  id text primary key,
  acronym text not null,
  name text not null,
  edition text not null,
  source_language text not null default 'en',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references public.certifications(id) on delete cascade,
  title text not null,
  url text,
  source_type text not null check (source_type in ('official', 'textbook', 'research', 'community')),
  trust_level smallint not null check (trust_level between 1 and 4),
  published_at timestamptz,
  checked_at timestamptz,
  content_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references public.certifications(id) on delete cascade,
  task_id text not null,
  language text not null check (language in ('en', 'zh')),
  title text not null,
  summary text not null,
  content jsonb not null,
  source_refs jsonb not null default '[]'::jsonb,
  version integer not null default 1,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  reviewed_by uuid references auth.users(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (certification_id, task_id, language, version)
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references public.certifications(id) on delete cascade,
  external_id text not null,
  language text not null check (language in ('en', 'zh')),
  domain_id text not null,
  cognition text not null,
  prompt text not null,
  options jsonb not null,
  answer_index smallint not null,
  explanation text not null,
  source_refs jsonb not null default '[]'::jsonb,
  version integer not null default 1,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  reviewed_by uuid references auth.users(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (certification_id, external_id, language, version)
);

create table if not exists public.user_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  certification_id text not null,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, certification_id)
);

create table if not exists public.content_review_queue (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references public.certifications(id) on delete cascade,
  source_id uuid references public.sources(id) on delete set null,
  item_type text not null check (item_type in ('lesson', 'question', 'fact', 'source_change')),
  payload jsonb not null,
  confidence numeric(4,3),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.certifications enable row level security;
alter table public.sources enable row level security;
alter table public.lessons enable row level security;
alter table public.questions enable row level security;
alter table public.user_progress enable row level security;
alter table public.content_review_queue enable row level security;

create policy "published certifications are public"
  on public.certifications for select using (status = 'published');
create policy "published lessons are public"
  on public.lessons for select using (status = 'published');
create policy "published questions are public"
  on public.questions for select using (status = 'published');
create policy "users read their own progress"
  on public.user_progress for select using (auth.uid() = user_id);
create policy "users create their own progress"
  on public.user_progress for insert with check (auth.uid() = user_id);
create policy "users update their own progress"
  on public.user_progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete their own progress"
  on public.user_progress for delete using (auth.uid() = user_id);

create index if not exists lessons_published_idx
  on public.lessons (certification_id, task_id, language, status, version desc);
create index if not exists questions_published_idx
  on public.questions (certification_id, domain_id, language, status);
create index if not exists sources_certification_idx
  on public.sources (certification_id, trust_level, checked_at desc);
