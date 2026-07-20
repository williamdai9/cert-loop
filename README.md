# Cert Loop

Reusable, bilingual certification study platform. CSCS is the first content
pack, with English as the canonical language and Chinese as an optional study
aid.

Live site: https://cert-loop-study.vercel.app

## What is included

- adaptive 8, 12, or 16 week study plans
- official CSCS domain weights and exam structure
- practice and exam test modes
- wrong-answer review loop
- 42 original bilingual practice questions across all seven domains
- 26-chapter textbook map and bilingual flashcards
- local, certificate-scoped progress persistence
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
