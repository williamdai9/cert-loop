import assert from "node:assert/strict";
import test from "node:test";
import { cscsCourse } from "../lib/course/index.ts";

test("ships a complete, ordered 26-chapter CSCS course", () => {
  assert.equal(cscsCourse.length, 26);
  assert.deepEqual(cscsCourse.map((chapter) => chapter.n), Array.from({ length: 26 }, (_, index) => index + 1));
});

test("every chapter contains a full lesson and retrieval practice", () => {
  for (const chapter of cscsCourse) {
    assert.ok(chapter.objectives.length >= 2, `chapter ${chapter.n} needs objectives`);
    assert.ok(chapter.sections.length >= 4, `chapter ${chapter.n} needs at least four deep dives`);
    assert.ok(chapter.sections.every((section) => section.explanation.length >= 2 && section.details.length >= 4), `chapter ${chapter.n} has a shallow section`);
    assert.ok(chapter.terms.length >= 4, `chapter ${chapter.n} needs terminology`);
    assert.ok(chapter.examChecklist.length >= 3, `chapter ${chapter.n} needs an exam checklist`);
    assert.ok(chapter.recall.length >= 2, `chapter ${chapter.n} needs active recall`);
  }
});
