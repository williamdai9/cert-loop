import assert from "node:assert/strict";
import test from "node:test";
import { cscsCourse } from "../lib/course/index.ts";
import { certificationRegistry } from "../lib/certifications.ts";
import { courseMedia } from "../lib/course-media.ts";
import { chapterOneVisualCoverage } from "../lib/chapter-one-visual-coverage.ts";

test("ships a complete, ordered 26-chapter CSCS course", () => {
  assert.equal(cscsCourse.length, 26);
  assert.deepEqual(cscsCourse.map((chapter) => chapter.n), Array.from({ length: 26 }, (_, index) => index + 1));
});

test("ships a placement-safe bilingual question bank with domain depth", () => {
  const questions = certificationRegistry[0].questions;
  assert.ok(questions.length >= 84, `expected at least 84 questions, received ${questions.length}`);
  for (const domain of certificationRegistry[0].domains) {
    const items = questions.filter((question) => question.domain === domain.id);
    assert.ok(items.length >= 12, `${domain.id} needs at least 12 questions`);
  }
  for (const question of questions) {
    assert.equal(question.options.length, 3, `${question.id} must use current three-option format`);
    assert.equal(question.en?.options.length, 3, `${question.id} needs three English options`);
    assert.ok(question.answer >= 0 && question.answer < 3, `${question.id} answer is out of range`);
    assert.ok(question.en?.explanation, `${question.id} needs an English rationale`);
  }
});

test("maps every chapter to an original textbook visual model", () => {
  for (let chapter = 1; chapter <= 26; chapter += 1) {
    assert.ok(courseMedia[chapter]?.textbookAtlas.length, `chapter ${chapter} needs a textbook visual model`);
  }
  assert.ok(courseMedia[1].noteFigures?.length >= 6, "chapter 1 needs the supplied anatomy and contraction figures");
  assert.equal(courseMedia[1].textbookFigures?.length, 21, "chapter 1 needs all 17 figures and both two-page tables from the English Fifth Edition");
  assert.ok(courseMedia[1].textbookFigures?.every((figure) => figure.path.startsWith("textbook/chapter-01/")), "chapter 1 textbook figures must use the protected media namespace");
  assert.equal(courseMedia[2].textbookFigures?.length, 18, "chapter 2 needs all 15 figures plus its multipage figure and table plates");
  assert.ok(courseMedia[2].textbookFigures?.every((figure) => figure.path.startsWith("textbook/chapter-02/")), "chapter 2 textbook figures must use the protected media namespace");
  assert.ok(Object.values(courseMedia).filter((media) => media.mindMap).length >= 20, "personal mind-map coverage is incomplete");
});

test("audits every Chapter 1 fifth-edition figure and table into a learning module", () => {
  const expected = [
    ...Array.from({ length: 17 }, (_, index) => `Figure 1.${index + 1}`),
    "Table 1.1",
    "Table 1.2",
  ];
  assert.equal(chapterOneVisualCoverage.length, 19);
  assert.deepEqual(chapterOneVisualCoverage.map((item) => item.id), expected);
  assert.deepEqual(
    new Set(chapterOneVisualCoverage.map((item) => item.sectionId)),
    new Set(["musculoskeletal", "contraction", "neuromuscular", "cardiovascular", "respiratory"]),
  );
  assert.ok(chapterOneVisualCoverage.every((item) => item.implementation === "protected-textbook-excerpt"));
  for (const item of chapterOneVisualCoverage) {
    assert.ok(item.pdfPage, `${item.id} needs a verified PDF page`);
    assert.ok(item.concept.length > 20, `${item.id} needs a meaningful concept description`);
    assert.ok(item.module, `${item.id} needs an implemented module`);
  }
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
