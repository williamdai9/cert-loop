# Cert Loop

Reusable, bilingual, end-to-end certification learning platform. The root
catalog is certification-neutral; the first available program is the National
Strength and Conditioning Association (NSCA) Certified Strength and
Conditioning Specialist® (CSCS®).

Live site: https://cert-loop-study.vercel.app

## What is included

- adaptive 8, 12, or 16 week study plans
- every Plan item opens its linked complete chapter course, not a separate summary
- 26 original fifth-edition visual atlases plus chapter-specific calculators and simulations
- Chapter 1 visual curriculum audited against all 17 figures and 2 tables: muscle structure, excitation-contraction coupling, motor-unit behavior, proprioception, circulation, ECG, ventilation, and gas exchange
- protected personal-note figures and 20 supplied mind maps with zoom/pan study views
- complete English deep dives, coaching decisions, exam cues, checkpoints, and active recall
- official CSCS domain weights and exam structure
- practice and exam test modes
- wrong-answer review loop
- 84 original bilingual practice questions across all seven domains
- 26-chapter textbook map and bilingual flashcards
- Supabase email/password authentication with one-time email verification; signed-out visitors receive preview only
- optional 30-item placement with priority and fast-track recommendations; learners can start from Chapter 1 without it
- first-run five-step site tour with an always-available replay control
- GPT-5.4 AI Tutor grounded in original English textbook pages, personal notes, course concept maps, practice explanations and server-saved mastery, with optional on-demand web search
- responsive desktop and mobile interface

## Content policy

The fifth-edition textbook and official NSCA materials govern exam-aligned
claims. English mode contains only professional English interface and course
copy; Chinese mode may retain important official English terminology. Practice
questions are original and are not recalled or copied exam items.

Official references:

- https://www.nsca.com/certification/cscs
- https://www.nsca.com/certification/cscs/certified-strength-and-conditioning-specialist-exam-description/

## Local development

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the general catalog. The first certification
workspace is available at `/certifications/nsca-cscs`.

Copy `.env.example` to `.env.local` and add the project's public Supabase
credentials to enable authentication and cloud sync. Full learning content is
intentionally unavailable to signed-out visitors.

The AI Tutor uses the server-only `OPENAI_API_KEY` directly. Its default model
is `gpt-5.4` with medium reasoning; `OPENAI_TUTOR_MODEL` may select a GPT-5 or
newer general-purpose model. It does not silently fall back to an older model,
Vercel AI Gateway, or a course-excerpt answer. Each answer reports the model
returned by OpenAI. Never expose the key or `SUPABASE_SERVICE_ROLE_KEY` to the browser.

### Tutor source library

`tutor_documents` and `tutor_chunks` contain a private, manually imported search
index. Anonymous and direct authenticated table reads are blocked; a bounded
RPC returns relevant excerpts after sign-in and onboarding. Published lessons,
question banks and progress are not changed by importing reference documents.
Queries combine English full-text search, Chinese keyword aliases and the
existing course structure. This is retrieval, not model training or a complete
automatically verified knowledge graph.

The current import covers the English fifth edition (1,876 PDF file pages,
1,846 with extractable text), 21 Evernote HTML notes, 20 personal mind-map
references, two readable practice PDFs and one supplied outline PDF. Two scanned
2000-question PDFs have no text layer and are not counted as answer evidence.
Embedded images in HTML notes are not OCR-indexed. PDF citations use file page
numbers, not printed page numbers. Supplied outlines are versioned reference
material; current policy must be checked against NSCA online.

The 26-chapter concept structure includes units, definitions, formulas and
coaching applications. Raw map OCR can be noisy and is excluded from answer
evidence. When a learner asks about a mind map, the tutor may inspect the matching
private original image via a five-minute signed URL and must acknowledge unreadable
labels. Structured English maps remain course synthesis, not claimed transcriptions.

Manual import (Python with pypdf; macOS Swift/Vision for map OCR):

```bash
python3 scripts/extract-tutor-library.py /absolute/path/to/study-materials work/tutor-library.json
node scripts/import-tutor-library.mjs work/tutor-library.json
```

The importer needs server-only Supabase credentials in the environment. It
upserts deterministic records; it does not delete old revisions automatically.
`work/` is ignored: do not commit raw textbooks, notes, keys or extracted corpora.
There is no scheduled indexing, agent, approval queue, vector-store subscription
or daily AI charge. OpenAI runs only when a learner asks; web search is opt-in.
Requests are limited to six per minute per learner. Chat stays in page memory,
and the Responses API uses `store: false`; OpenAI's account data policies still apply.

## Supabase

The schema is versioned in `supabase/migrations`. It includes reusable tables
for certifications, sources, lessons, questions, and per-user progress.
Historical research/review tables remain empty for migration compatibility.
Published lessons and questions are read from Supabase at
runtime after authentication, with versioned code content retained as a build
fallback. Course images are stored in the private `course-media` bucket. Row
Level Security blocks anonymous learning-content reads and keeps each learner's
progress private.

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

`npm run db:content` generates the published lesson seed SQL from the canonical
course content. Content changes should be reviewed before the
resulting migration is pushed.

`npm run questions:publish` publishes the reviewed 84-item bilingual bank to
Supabase. It requires the server-only `SUPABASE_SERVICE_ROLE_KEY`; never place
that key in a browser-visible environment variable.

## Content maintenance

The read-only administrator inspector and its dedicated API have been removed.
There is no in-app manual approval, inspection, or publishing workflow.
Course updates use version-controlled content and the existing publication
scripts. Existing automated integrity tests remain part of release verification;
they check structure and consistency, not factual correctness. No new evaluation
agent, automatic approval system, or background content-generation task is enabled.

The automated research pipeline, AI draft queue, research feed, and
`research-update` API/Edge Function have been retired. Course images and source
assets remain intact and are loaded where needed in the learning experience.
The only scheduled task is a lightweight Supabase keep-alive request on Monday
and Thursday at 08:17 UTC. It performs one read-only query and never fetches
external sources, writes content, or invokes AI. Tutor web search runs only
when the learner explicitly enables it for a question.

For signup verification and password recovery, set the Supabase Auth Site URL
to the production domain and allow both the production domain and
`http://localhost:3000` as redirect URLs. Hosted Supabase projects should keep
email confirmation enabled so registration verifies the address once; later
sign-ins use email and password directly.

## Verification

```bash
npm run build
npm test
npx tsc --noEmit
```

Local development, production builds, and rendered-page tests all use Next.js,
the same runtime deployed on Vercel. `npm test` builds the app and runs the test
suite against it.

## Add another certification

Create a new content pack following the types in `lib/certifications.ts`, then
register it in `certificationRegistry`. Keep question banks, domain weights,
study-plan inputs, storage keys, and source metadata inside that certification's
pack so progress and content remain isolated.

## Deployment

Vercel is the only deployment target: https://cert-loop-study.vercel.app.
The repository includes `vercel.json` and is connected to GitHub. Supabase owns
authentication, learning progress, and the private content library. The tutor
uses the OpenAI API directly; it does not need a second hosted website.

Do not create or synchronize a ChatGPT Sites copy of this project. Its duplicate
hosting integration, build tooling, and unused D1 starter have been removed.
