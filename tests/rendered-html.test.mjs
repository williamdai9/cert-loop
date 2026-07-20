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

test("server-renders the Cert Loop learning app", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Cert Loop — Scalable Certification Learning<\/title>/i);
  assert.match(html, /CERT LOOP/);
  assert.match(html, /Learn it, test it/);
  assert.match(html, /CSCS/);
  assert.match(html, /English 5th ed\. textbook/);
});

test("ships complete lessons and private progress sync", async () => {
  const [page, lessons, supabase, migration] = await Promise.all([
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
  ]);

  const lessonIds = lessons.match(/"w(?:[1-9]|1[0-2])-[0-3]":\s*L\(/g) ?? [];
  assert.equal(lessonIds.length, 48);
  assert.match(page, /function LessonReader/);
  assert.match(page, /Reveal after answering aloud/);
  assert.match(page, /signInWithOtp/);
  assert.match(page, /from\("user_progress"\)/);
  assert.match(supabase, /persistSession:\s*true/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /auth\.uid\(\) = user_id/);
});
