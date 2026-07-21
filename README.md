# Cert Loop

Reusable, bilingual certification study platform. CSCS is the first content
pack, with English as the canonical language and Chinese as an optional study
aid.

Live site: https://cert-loop-study.vercel.app

## What is included

- adaptive 8, 12, or 16 week study plans
- every Plan item opens its linked complete chapter course, not a separate summary
- 26 original fifth-edition visual atlases plus chapter-specific calculators and simulations
- Chapter 1 visual curriculum audited against all 17 figures and 2 tables: muscle structure, excitation-contraction coupling, motor-unit behavior, proprioception, circulation, ECG, ventilation, and gas exchange
- protected personal-note figures and 20 supplied mind maps with zoom/pan study views
- English-first deep dives, coaching decisions, exam cues, checkpoints, and active recall
- official CSCS domain weights and exam structure
- practice and exam test modes
- wrong-answer review loop
- 84 original bilingual practice questions across all seven domains
- 26-chapter textbook map and bilingual flashcards
- passwordless Supabase authentication; signed-out visitors receive preview only
- required first-login 30-item placement with priority and fast-track recommendations
- first-run five-step site tour with an always-available replay control
- whole-site AI Tutor grounded in the course, question bank, learner mastery, and research feed
- daily multi-source watch across NSCA official articles, Europe PMC research, and selected community leads; AI-drafted content/questions are held for review
- responsive desktop and mobile interface

## Content policy

The English fifth-edition textbook and official English NSCA materials are the
source of truth. Chinese text is supplementary and must not override the
English meaning. Practice questions are original and are not recalled or copied
exam items.

Official references:

- https://www.nsca.com/certification/cscs
- https://www.nsca.com/cscs-exam-description/

## Local development

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Copy `.env.example` to `.env.local` and add the project's public Supabase
credentials to enable authentication and cloud sync. Full learning content is
intentionally unavailable to signed-out visitors.

The AI Tutor prefers the server-only `OPENAI_API_KEY` and can fall back to
Vercel AI Gateway. For local use, set `OPENAI_API_KEY` or
`AI_GATEWAY_API_KEY`. Never expose either key—or
`SUPABASE_SERVICE_ROLE_KEY`—to the browser.

## Supabase

The schema is versioned in `supabase/migrations`. It includes reusable tables
for certifications, sources, lessons, questions, per-user progress, and a
content-review queue. Published lessons and questions are read from Supabase at
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
English-first lesson source. Content changes should be reviewed before the
resulting migration is pushed.

`npm run questions:publish` publishes the reviewed 84-item bilingual bank to
Supabase. It requires the server-only `SUPABASE_SERVICE_ROLE_KEY`; never place
that key in a browser-visible environment variable.

## Administrator content inspector

Open `/admin` to audit the complete curriculum, bilingual question bank,
private course media, research feed, human-review queue, and the actual rows
published to Supabase. The inspector is read-only and requires a valid Supabase
session plus server-side authorization. Add one or more comma-separated owner
emails to `CERT_LOOP_ADMIN_EMAILS`, or set
`app_metadata.cert_loop_admin=true` on an administrator account. The Supabase
service-role key stays on the server and is never returned to the browser.

The dashboard deliberately distinguishes content depth from visual completion:
Chapter 1 is the completed figure-by-figure audit, while Chapters 2–26 remain
visible as an explicit visual-review backlog until each chapter is verified.

`research-update` is a deployed Supabase Edge Function. Vercel Cron invokes it
daily at 08:17 UTC. It monitors NSCA's official RSS feed, Europe PMC, and the
open Physical Fitness Stack Exchange community feed. Community items remain explicitly
unverified and cannot generate publishable questions without corroboration.
Source metadata is safe to show as a labeled research watch;
AI summaries and candidate questions are written to the review workflow and do
not silently override fifth-edition or official exam truth.

For passwordless email login, set the Supabase Auth Site URL to the production
domain and allow both the production domain and `http://localhost:3000` as
redirect URLs.

## Verification

```bash
npm run build
npx next build
```

The first command validates the bundled Sites/vinext target. The second validates
the production Next.js target used by Vercel.

## Add another certification

Create a new content pack following the types in `lib/certifications.ts`, then
register it in `certificationRegistry`. Keep question banks, domain weights,
study-plan inputs, storage keys, and source metadata inside that certification's
pack so progress and content remain isolated.

## Deployment

The repository includes `vercel.json` for Vercel and `.openai/hosting.json` for
the bundled Sites target. Vercel production deploys are connected to the GitHub
repository.
