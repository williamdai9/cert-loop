# Cert Loop

Reusable, bilingual certification study platform. CSCS is the first content
pack, with English as the canonical language and Chinese as an optional study
aid.

Live site: https://cert-loop-study.vercel.app

## What is included

- adaptive 8, 12, or 16 week study plans
- every Plan item opens its linked complete chapter course, not a separate summary
- 26 original fifth-edition visual atlases plus chapter-specific calculators and simulations
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
