import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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

test("server-renders a secure Cert Loop access boundary", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Cert Loop — Scalable Certification Learning<\/title>/i);
  assert.match(html, /CERT LOOP/);
  assert.match(html, /Securing your learning workspace/);
  assert.match(html, /CSCS/);
  assert.doesNotMatch(html, /Learn it, test it/);
});

test("ships plan-linked complete lessons, adaptive testing, research, and private progress sync", async () => {
  const [page, lessons, supabase, migration, tutor, visuals, chapterOneVisuals, visualCoverage, courseMediaViewer, researchMigration, protectionMigration, courseMedia, tutorClient] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
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
    readFile(new URL("../app/components/chapter-one-visual-studio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/chapter-one-visual-coverage.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/course-media.tsx", import.meta.url), "utf8"),
    readFile(new URL("../supabase/migrations/20260720203000_daily_research_pipeline.sql", import.meta.url), "utf8"),
    readFile(new URL("../supabase/migrations/20260721153000_protect_learning_content.sql", import.meta.url), "utf8"),
    readFile(new URL("../lib/course-media.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ai-tutor.tsx", import.meta.url), "utf8"),
  ]);

  const lessonIds = lessons.match(/"w(?:[1-9]|1[0-2])-[0-3]":\s*L\(/g) ?? [];
  assert.equal(lessonIds.length, 48);
  assert.match(page, /function LessonReader/);
  assert.match(page, /Reveal after answering aloud/);
  assert.match(page, /from\("lessons"\)/);
  assert.match(page, /activePlanChapter/);
  assert.match(page, /task=\{activeLesson\}/);
  assert.match(page, /Adaptive diagnostic/);
  assert.match(page, /ChapterVisualLab/);
  assert.match(page, /ChapterOneVisualStudio/);
  assert.match(page, /AITutor/);
  assert.match(page, /signInWithOtp/);
  assert.match(page, /function PublicPreview/);
  assert.match(page, /function PlacementTest/);
  assert.match(page, /function SiteTour/);
  assert.match(page, /MindMapRecap/);
  assert.match(page, /TextbookVisualAtlas/);
  assert.match(page, /from\("user_progress"\)/);
  assert.match(supabase, /persistSession:\s*true/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /auth\.uid\(\) = user_id/);
  assert.match(tutor, /buildTutorContext/);
  assert.match(tutor, /web_search/);
  assert.match(tutor, /requirePlacedLearner/);
  assert.match(tutorClient, /Authorization: `Bearer/);
  assert.match(visuals, /Joint torque calculator/);
  assert.match(visuals, /Energy-system continuum/);
  assert.doesNotMatch(visuals, /function ContractionLab/);
  assert.match(chapterOneVisuals, /Tricuspid valve/);
  assert.match(chapterOneVisuals, /Pulmonary valve \+ artery/);
  assert.match(chapterOneVisuals, /Mitral valve/);
  assert.match(chapterOneVisuals, /Aortic valve/);
  assert.match(chapterOneVisuals, /Twitch summation/);
  assert.match(chapterOneVisuals, /motor-unit-mosaic/);
  assert.match(chapterOneVisuals, /Type IIx/);
  assert.match(chapterOneVisuals, /Mitochondrial size and density/);
  assert.match(chapterOneVisuals, /Distance cycling/);
  assert.match(chapterOneVisuals, /Conduction \+ ECG/);
  assert.match(chapterOneVisuals, /tidalVolume - anatomicalDeadSpace - physiologicalDeadSpace/);
  assert.match(visualCoverage, /Figure 1\.17/);
  assert.match(visualCoverage, /Table 1\.2/);
  assert.match(courseMediaViewer, /event\.key === "Escape"/);
  assert.match(courseMediaViewer, /onPointerCancel/);
  assert.match(courseMediaViewer, /querySelectorAll<HTMLElement>/);
  assert.match(researchMigration, /research_items/);
  assert.match(researchMigration, /content_review_queue|research_sync_runs/);
  assert.match(protectionMigration, /authenticated learners read published lessons/);
  assert.match(protectionMigration, /authenticated learners read course media/);
  assert.doesNotMatch(protectionMigration, /published lessons are public"\s+on public\.lessons for select using/);
  assert.match(courseMedia, /chapter-01\/skeleton\.jpg/);
  assert.match(courseMedia, /5th-edition|fifth edition|textbookAtlas/);
});
