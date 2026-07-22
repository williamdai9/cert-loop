import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function requestWorker(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function render() {
  return requestWorker("/");
}

test("server-renders a general certification catalog", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Cert Loop — End-to-End Certification Learning<\/title>/i);
  assert.match(html, /CERT LOOP/);
  assert.match(html, /Prepare for the credential/);
  assert.match(html, /Certified Strength and Conditioning Specialist/);
  assert.match(html, /\/certifications\/nsca-cscs/);
  assert.doesNotMatch(html, /English-first/);
});

test("rejects anonymous administrator API inspection", async () => {
  const response = await requestWorker("/api/admin/content");
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "Sign in with an administrator account." });
});

test("ships plan-linked complete lessons, optional placement, research, and private progress sync", async () => {
  const [catalogPage, page, lessons, supabase, migration, tutor, visuals, visualCoverage, courseMediaViewer, researchMigration, protectionMigration, courseMedia, tutorClient, adminPage, adminApi, registry] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/certifications/nsca-cscs/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/lesson-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/supabase-browser.ts", import.meta.url), "utf8"),
    readFile(
      new URL(
        "../supabase/migrations/20260720035500_init_cert_loop_schema.sql",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../app/api/tutor/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/chapter-visual-lab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/chapter-one-visual-coverage.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/course-media.tsx", import.meta.url), "utf8"),
    readFile(new URL("../supabase/migrations/20260720203000_daily_research_pipeline.sql", import.meta.url), "utf8"),
    readFile(new URL("../supabase/migrations/20260721153000_protect_learning_content.sql", import.meta.url), "utf8"),
    readFile(new URL("../lib/course-media.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ai-tutor.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/admin/content/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/certifications.ts", import.meta.url), "utf8"),
  ]);

  const lessonIds = lessons.match(/"w(?:[1-9]|1[0-2])-[0-3]":\s*L\(/g) ?? [];
  assert.equal(lessonIds.length, 48);
  assert.match(page, /function LessonReader/);
  assert.match(page, /Reveal after answering aloud/);
  assert.match(page, /from\("lessons"\)/);
  assert.match(page, /activePlanChapter/);
  assert.match(page, /task=\{activeLesson\}/);
  assert.match(page, /Optional placement/);
  assert.match(page, /useState\("weighted"\)/);
  assert.match(page, /tasks: standard\[0\]\.tasks\.filter\(task => task\.id !== "w1-0"\)/);
  assert.match(page, /ChapterVisualLab/);
  assert.doesNotMatch(page, /ChapterOneVisualStudio/);
  assert.match(page, /SectionTextbookFigures/);
  assert.match(page, /AITutor/);
  assert.match(page, /signInWithPassword/);
  assert.match(page, /auth\.signUp/);
  assert.match(page, /resetPasswordForEmail/);
  assert.match(page, /auth\.updateUser\(\{ password \}\)/);
  assert.doesNotMatch(page, /signInWithOtp|Email me a sign-in link|Use a passwordless email link/);
  assert.match(page, /function PublicPreview/);
  assert.match(page, /function PlacementTest/);
  assert.match(page, /Start from the beginning/);
  assert.match(page, /Take a placement test/);
  assert.match(page, /onboardingChoice: "zero"/);
  assert.match(page, /OPTIONAL PLACEMENT · 30 QUESTIONS/);
  assert.doesNotMatch(page, /REQUIRED FIRST-LOGIN PLACEMENT|NO SKIP|English-first certification mastery/);
  assert.match(page, /function SiteTour/);
  assert.match(page, /card\.en\.tag/);
  assert.doesNotMatch(page, /MindMapRecap/);
  assert.match(page, /TextbookConceptMap/);
  assert.match(courseMediaViewer, /ENGLISH FIFTH EDITION · CHAPTER CONCEPT MAP/);
  assert.match(courseMediaViewer, /Built from the English Fifth Edition curriculum/);
  assert.doesNotMatch(courseMediaViewer, /Personal Chinese notes are reference material only/);
  assert.match(courseMediaViewer, /Study the original textbook figure/);
  assert.match(page, /TextbookVisualAtlas/);
  assert.match(page, /from\("user_progress"\)/);
  assert.match(page, /href="\/admin"/);
  assert.match(page, /className="admin-top-link"/);
  assert.match(page, /className="placement-admin-link"/);
  assert.match(supabase, /persistSession:\s*true/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /auth\.uid\(\) = user_id/);
  assert.match(tutor, /buildTutorContext/);
  assert.match(tutor, /web_search/);
  assert.match(tutor, /requireOnboardedLearner/);
  assert.match(tutor, /Choose a starting point before using the AI Tutor/);
  assert.match(tutor, /Do not add Chinese text in English mode/);
  assert.match(tutorClient, /Authorization: `Bearer/);
  assert.match(visuals, /Joint torque calculator/);
  assert.match(visuals, /Energy-system continuum/);
  assert.doesNotMatch(visuals, /function ContractionLab/);
  assert.match(visualCoverage, /Figure 1\.17/);
  assert.match(visualCoverage, /Table 1\.2/);
  assert.match(visualCoverage, /protected-textbook-excerpt/);
  assert.match(courseMediaViewer, /function SectionTextbookFigures/);
  assert.match(courseMediaViewer, /PROTECTED FIGURE SET/);
  assert.match(courseMediaViewer, /event\.key === "Escape"/);
  assert.match(courseMediaViewer, /onPointerCancel/);
  assert.match(courseMediaViewer, /querySelectorAll<HTMLElement>/);
  assert.match(researchMigration, /research_items/);
  assert.match(researchMigration, /content_review_queue|research_sync_runs/);
  assert.match(protectionMigration, /authenticated learners read published lessons/);
  assert.match(protectionMigration, /authenticated learners read course media/);
  assert.doesNotMatch(protectionMigration, /published lessons are public"\s+on public\.lessons for select using/);
  assert.match(courseMedia, /chapter-01\/skeleton\.jpg/);
  assert.match(courseMedia, /textbookFigure\("figure-1-3\.png"/);
  assert.match(courseMedia, /textbookFigure\("figure-1-17\.png"/);
  assert.match(courseMedia, /textbookFigure\("table-1-1a\.png"/);
  assert.match(courseMedia, /textbookFigureForChapter\(2, "figure-2-15\.png"/);
  assert.match(courseMedia, /5th-edition|fifth edition|textbookAtlas/);
  assert.match(adminPage, /Administrator content inspector/);
  assert.match(adminPage, /Textbook figure integration/);
  assert.match(adminPage, /complete Fifth Edition figure\/table inventory is audited/);
  assert.match(adminPage, /Cloud database/);
  assert.match(adminPage, /Question bank/);
  assert.match(adminApi, /CERT_LOOP_ADMIN_EMAILS/);
  assert.match(adminApi, /cert_loop_admin/);
  assert.match(adminApi, /auth\.getUser\(token\)/);
  assert.match(adminApi, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(adminApi, /from\("lessons"\)/);
  assert.match(adminApi, /from\("questions"\)/);
  assert.match(adminApi, /from\("research_items"\)/);
  assert.match(adminApi, /from\("content_review_queue"\)/);
  assert.match(adminApi, /createSignedUrls/);
  assert.match(catalogPage, /End-to-end curriculum/);
  assert.match(catalogPage, /\/certifications\/nsca-cscs/);
  assert.match(registry, /NSCA Certified Strength and Conditioning Specialist® \(CSCS®\)/);
});
