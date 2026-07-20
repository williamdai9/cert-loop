# Cert Loop

Reusable, bilingual certification study platform. CSCS is the first content
pack, with English as the canonical language and Chinese as an optional study
aid.

Live site: https://cert-loop-study.vercel.app

## What is included

- adaptive 8, 12, or 16 week study plans
- 48 interactive lesson tasks spanning all 26 fifth-edition chapters
- English-first summaries, core points, applied examples, and active recall
- official CSCS domain weights and exam structure
- practice and exam test modes
- wrong-answer review loop
- 42 original bilingual practice questions across all seven domains
- 26-chapter textbook map and bilingual flashcards
- passwordless Supabase authentication and private cloud progress sync
- local, certificate-scoped progress fallback for signed-out learners
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
credentials to enable authentication and cloud sync. The app remains usable
with local progress when those values are absent.

## Supabase

The schema is versioned in `supabase/migrations`. It includes reusable tables
for certifications, sources, lessons, questions, per-user progress, and a
content-review queue. Published lessons are read from Supabase at runtime, with
the versioned code content retained as an offline fallback. Row Level Security
keeps each learner's progress private.

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

`npm run db:content` generates the published lesson seed SQL from the canonical
English-first lesson source. Content changes should be reviewed before the
resulting migration is pushed.

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
