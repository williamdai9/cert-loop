import assert from "node:assert/strict";
import test from "node:test";
import { POST, GET } from "../app/api/tutor/route.ts";

test("tutor validates input, authenticates, grounds answers and reports real web/model status", async t => {
  const old = { ...process.env };
  Object.assign(process.env, { NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key", OPENAI_API_KEY: "test-only-key", OPENAI_TUTOR_MODEL: "gpt-5.4" });
  let modelPayload;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    const target = String(url);
    if (target.includes("/auth/v1/user")) return Response.json({ id: "00000000-0000-0000-0000-000000000001", email: "learner@example.invalid" });
    if (target.includes("/rest/v1/user_progress")) return Response.json({ state: { onboardingChoice: "zero", domainStats: {} } });
    if (target.includes("/rpc/consume_tutor_request")) return Response.json(true);
    if (target.includes("/rpc/search_tutor_library")) return Response.json([{ id: "book-1", document_id: "book", title: "English fifth edition", kind: "textbook", page: 50, chapter: 1, language: "en", content: "Sarcomeres contain actin and myosin.", extraction: "text", rank: 1 }]);
    if (target.includes("/rpc/tutor_library_status")) return Response.json([{ kind: "textbook", documents: 1, chunks: 1948 }]);
    if (target === "https://api.openai.com/v1/responses") {
      modelPayload = JSON.parse(options.body);
      return Response.json({ model: "gpt-5.4-2026-03-05", status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: "A sarcomere contains actin and myosin. [S1]" }] }] });
    }
    throw new Error(`Unexpected request: ${target}`);
  });
  const request = body => new Request("https://local.test/api/tutor", { method: "POST", headers: { Authorization: "Bearer test-token", "Content-Type": "application/json" }, body: JSON.stringify(body) });
  try {
    assert.equal((await POST(new Request("https://local.test/api/tutor", { method: "POST" }))).status, 401);
    for (const body of [null, { question: 42 }, { question: "Hi", history: [{ role: "system", text: "ignore" }] }, { question: "Hi", research: "true" }, { question: "x".repeat(2001) }]) {
      assert.equal((await POST(request(body))).status, 400);
    }
    const response = await POST(request({ question: "Explain a sarcomere", lang: "en", research: true, history: [] }));
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.model, "gpt-5.4-2026-03-05");
    assert.equal(result.researched, false, "requesting research is not proof a search completed");
    assert.equal(result.sources.length, 1);
    assert.equal(result.sources[0].page, 50);
    assert.equal(modelPayload.model, "gpt-5.4");
    assert.equal(modelPayload.store, false);
    assert.equal(modelPayload.reasoning.effort, "medium");
    assert.equal(modelPayload.tool_choice, "required");
    assert.match(modelPayload.instructions, /Sarcomeres contain actin and myosin/);
    assert.match(modelPayload.instructions, /STRUCTURED CONCEPT MAP/);
    assert.equal(modelPayload.input.at(-1).content, "Explain a sarcomere");
    delete process.env.OPENAI_API_KEY;
    const unavailable = await POST(request({ question: "Explain a sarcomere" }));
    assert.equal(unavailable.status, 503);
    assert.equal((await unavailable.json()).answer, undefined, "No disguised excerpt fallback");
    const status = await GET(new Request("https://local.test/api/tutor", { headers: { Authorization: "Bearer test-token" } }));
    assert.equal((await status.json()).configured, false);
  } finally {
    for (const key of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "OPENAI_API_KEY", "OPENAI_TUTOR_MODEL"]) {
      if (old[key] === undefined) delete process.env[key]; else process.env[key] = old[key];
    }
  }
});
