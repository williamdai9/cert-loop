import assert from "node:assert/strict";
import test from "node:test";

import {
  citedTutorSources,
  configuredTutorModel,
  retrieveTutorLibrary,
  tutorSearchTerms,
} from "../lib/tutor-library.ts";
import { buildTutorContext } from "../lib/tutor-context.ts";

test("configuredTutorModel defaults to GPT-5.4 when no model is configured", () => {
  const previous = process.env.OPENAI_TUTOR_MODEL;
  delete process.env.OPENAI_TUTOR_MODEL;
  try {
    assert.equal(configuredTutorModel(), "gpt-5.4");
  } finally {
    if (previous === undefined) delete process.env.OPENAI_TUTOR_MODEL;
    else process.env.OPENAI_TUTOR_MODEL = previous;
  }
});

test("configuredTutorModel rejects pre-GPT-5 and non-general models, and allows GPT-5+ general models", () => {
  for (const model of ["gpt-4.1", "gpt-4o-mini", "gpt-5-codex", "gpt-5-realtime", "gpt-5-transcribe", "gpt-5-image", "gpt-5-search-preview"]) {
    assert.throws(
      () => configuredTutorModel(model),
      /GPT-5 or newer general-purpose model/,
      `${model} should not be accepted as a tutor model`,
    );
  }
  for (const model of ["gpt-5.4", "gpt-5.4-mini", "gpt-6.1"]) {
    assert.equal(configuredTutorModel(model), model);
  }
});

test("tutor retrieval expands English and Chinese topic aliases", () => {
  const english = tutorSearchTerms("Explain muscle contraction with actin and myosin");
  const chinese = tutorSearchTerms("请解释肌肉收缩以及肌动蛋白和肌球蛋白");

  for (const terms of [english, chinese]) {
    for (const alias of ["muscle", "肌肉", "contraction", "收缩", "actin", "myosin"]) {
      assert.ok(terms.includes(alias), `${alias} should be present in ${terms.join(", ")}`);
    }
  }

  const chineseContext = buildTutorContext("肌肉收缩");
  assert.equal(chineseContext.internalSources[0]?.chapter, 1);
});

test("an explicit topic remains primary when the page context names another chapter", () => {
  const grounded = buildTutorContext(
    "Explain periodization, macrocycles, and mesocycles",
    { chapterNumber: 1, chapterTitle: "Structure and Function of Body Systems" },
  );

  assert.equal(grounded.internalSources[0]?.chapter, 22);
  assert.match(grounded.excerpts, /^\[C1\] Course Ch\. 22 › Periodization/m);
});

test("citedTutorSources returns only known source IDs actually cited in the answer", () => {
  const sources = [
    { id: "S1", title: "Textbook page 1", kind: "textbook" },
    { id: "S2", title: "Textbook page 2", kind: "textbook" },
    { id: "C1", title: "Course synthesis", kind: "course" },
  ];

  const cited = citedTutorSources("Use [C1] and [S1]. [S1] is repeated; [S9] and [W1] are unknown.", sources);
  assert.deepEqual(cited.map((source) => source.id), ["S1", "C1"]);
});

test("citedTutorSources supports known mind-map citations", () => {
  const sources = [
    { id: "M1", title: "Chapter 1 mind map", kind: "mindmap" },
    { id: "S1", title: "Textbook page 1", kind: "textbook" },
  ];

  const cited = citedTutorSources("The map connects these concepts [M1]; the textbook supports the mechanism [S1].", sources);
  assert.deepEqual(cited.map((source) => source.id), ["M1", "S1"]);
});

test("buildTutorContext includes the selected concept map and chapter formulas", () => {
  const grounded = buildTutorContext("Explain force, torque, and lever mechanics", { chapterNumber: 2 });

  assert.match(grounded.courseIndex, /Ch\. 26:/);
  assert.match(grounded.conceptMap, /^Chapter 2: Biomechanics of Resistance Exercise/m);
  assert.match(grounded.conceptMap, /contains unit: Force, torque, levers, and mechanical advantage/);
  assert.match(grounded.conceptMap, /formula: Torque: τ = F × perpendicular moment arm/);
});

function mockSupabase(result, calls = []) {
  return {
    calls,
    rpc(name, args) {
      calls.push({ name, args });
      return {
        abortSignal(signal) {
          assert.ok(signal instanceof AbortSignal, "retrieval should set an abort signal");
          return Promise.resolve(result);
        },
      };
    },
  };
}

test("retrieveTutorLibrary maps RPC hits to source IDs with page metadata", async () => {
  const db = mockSupabase({
    data: [{
      id: "doc-7-page-42",
      document_id: "doc-7",
      title: "CSCS Fifth Edition",
      kind: "textbook",
      language: "en",
      edition: "5",
      page: 42,
      chapter: 2,
      content: "Torque equals force multiplied by the perpendicular moment arm.",
      extraction: "ocr",
      rank: 0.98,
    }],
    error: null,
  });

  const result = await retrieveTutorLibrary(db, "How is torque calculated?", 2);
  assert.equal(db.calls[0].name, "search_tutor_library");
  assert.equal(db.calls[0].args.preferred_chapter, 2);
  assert.ok(db.calls[0].args.search_terms.includes("torque"));
  assert.equal(result.available, true);
  assert.equal(result.sources.length, 1);
  assert.equal(result.sources[0].id, "S1");
  assert.equal(result.sources[0].page, 42);
  assert.equal(result.sources[0].chapter, 2);
  assert.match(result.evidence, /PDF file page 42/);
  assert.match(result.evidence, /extraction: ocr/);
});

test("retrieveTutorLibrary excludes image_ocr hits from answer evidence", async () => {
  const db = mockSupabase({
    data: [
      {
        id: "blurry-map-01",
        document_id: "blurry-map",
        title: "Blurry scanned mind-map image",
        kind: "mindmap",
        language: "en",
        edition: null,
        page: 7,
        chapter: 1,
        content: "OCR fragments from an image; inspect the signed image instead.",
        extraction: "image_ocr",
        rank: 0.95,
      },
      {
        id: "doc-7-page-42",
        document_id: "doc-7",
        title: "CSCS Fifth Edition",
        kind: "textbook",
        language: "en",
        edition: "5",
        page: 42,
        chapter: 2,
        content: "Torque equals force multiplied by the perpendicular moment arm.",
        extraction: "text",
        rank: 0.8,
      },
    ],
    error: null,
  });

  const result = await retrieveTutorLibrary(db, "How is torque calculated?", 2);
  assert.deepEqual(result.sources.map((source) => source.kind), ["textbook"]);
  assert.doesNotMatch(result.evidence, /Blurry scanned mind-map image|OCR fragments/);
});

test("retrieveTutorLibrary reports explicit unavailability when the RPC fails", async () => {
  const db = mockSupabase({ data: null, error: { message: "database unavailable" } });

  const result = await retrieveTutorLibrary(db, "How is torque calculated?", 2);
  assert.equal(result.available, false);
  assert.deepEqual(result.sources, []);
  assert.match(result.evidence, /Original-source retrieval is unavailable/);
  assert.match(result.evidence, /Do not imply you consulted original files/);
});
