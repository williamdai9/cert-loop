import { lessonContent } from "../lib/lesson-data.ts";

const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const json = (value) => `${quote(JSON.stringify(value))}::jsonb`;

const rows = Object.entries(lessonContent).map(([taskId, content]) =>
  `(${quote("nsca-cscs-5")}, ${quote(taskId)}, 'en', ${quote(taskId)}, ${quote(content.summary.en)}, ${json(content)}, ${json(["nsca-essentials-5", "nsca-cscs-dco"])}, 1, 'published', now())`,
);

process.stdout.write(`-- Generated from lib/lesson-data.ts. Re-run the generator when published lesson content changes.
insert into public.certifications (id, acronym, name, edition, source_language, status, metadata)
values (
  'nsca-cscs-5',
  'CSCS',
  'Certified Strength & Conditioning Specialist',
  '5th Edition',
  'en',
  'published',
  '{"canonical_language":"en","bilingual_support":["zh"],"content_pack":"cscs-5"}'::jsonb
)
on conflict (id) do update set
  acronym = excluded.acronym,
  name = excluded.name,
  edition = excluded.edition,
  source_language = excluded.source_language,
  status = excluded.status,
  metadata = excluded.metadata,
  updated_at = now();

insert into public.sources (certification_id, title, url, source_type, trust_level, checked_at, metadata)
select 'nsca-cscs-5', 'NSCA CSCS Certification', 'https://www.nsca.com/certification/cscs', 'official', 4, now(), '{"source_key":"nsca-cscs-certification"}'::jsonb
where not exists (select 1 from public.sources where certification_id = 'nsca-cscs-5' and metadata->>'source_key' = 'nsca-cscs-certification');

insert into public.sources (certification_id, title, url, source_type, trust_level, checked_at, metadata)
select 'nsca-cscs-5', 'NSCA CSCS Exam Description', 'https://www.nsca.com/cscs-exam-description/', 'official', 4, now(), '{"source_key":"nsca-cscs-dco"}'::jsonb
where not exists (select 1 from public.sources where certification_id = 'nsca-cscs-5' and metadata->>'source_key' = 'nsca-cscs-dco');

insert into public.lessons (
  certification_id, task_id, language, title, summary, content,
  source_refs, version, status, published_at
)
values
  ${rows.join(",\n  ")}
on conflict (certification_id, task_id, language, version) do update set
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  source_refs = excluded.source_refs,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = now();
`);
