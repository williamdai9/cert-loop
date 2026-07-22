import assert from "node:assert/strict";
import test from "node:test";
import { cscsCourse } from "../lib/course/index.ts";
import { certificationRegistry } from "../lib/certifications.ts";
import { courseMedia } from "../lib/course-media.ts";
import { editorialMediaForSection, isTextHeavySourceAsset } from "../lib/course-media-presentation.ts";
import { chapterOneVisualCoverage } from "../lib/chapter-one-visual-coverage.ts";
import { planTaskCurriculum } from "../lib/plan-curriculum.ts";

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
  const completedFigureSets = new Map([
    [3, 19],
    [4, 10],
    [5, 10],
    [6, 9],
    [7, 7],
    [8, 5],
    [9, 7],
    [10, 41],
    [11, 9],
    [12, 14],
    [13, 6],
    [14, 102],
    [15, 16],
    [16, 48],
    [17, 83],
    [18, 36],
    [19, 161],
    [20, 96],
    [21, 37],
    [22, 47],
    [23, 60],
    [24, 39],
    [25, 61],
    [26, 29],
  ]);
  for (const [chapter, count] of completedFigureSets) {
    assert.equal(courseMedia[chapter].textbookFigures?.length, count, `chapter ${chapter} needs its complete English Fifth Edition figure/table set`);
    assert.ok(courseMedia[chapter].textbookFigures?.every((figure) => figure.path.startsWith(`textbook/chapter-${String(chapter).padStart(2, "0")}/`)), `chapter ${chapter} figures must use the protected media namespace`);
  }
  assert.ok(Object.values(courseMedia).filter((media) => media.mindMap).length >= 20, "personal mind-map coverage is incomplete");
});

test("retains every audited source asset while learner presentation separates explanatory visuals from prose sources", () => {
  const allFigures = Object.values(courseMedia).flatMap((media) => media.textbookFigures || []);
  assert.equal(allFigures.length, 991);
  assert.equal(allFigures.filter(isTextHeavySourceAsset).length, 553, "the audited text-heavy set must stay out of learner image walls");
  assert.equal(allFigures.filter((figure) => !isTextHeavySourceAsset(figure)).length, 438, "the audited explanatory visual set must remain available inline");
  for (const chapter of cscsCourse) {
    const validSections = new Set(chapter.sections.map((section) => section.id));
    const figures = courseMedia[chapter.n].textbookFigures || [];
    const assigned = figures.filter((figure) => validSections.has(figure.sectionId));
    const adminOnly = figures.filter((figure) => !validSections.has(figure.sectionId));
    assert.equal(assigned.length + adminOnly.length, figures.length, `chapter ${chapter.n} loses an audited source asset`);
    for (const section of chapter.sections) {
      const editorial = editorialMediaForSection(chapter.n, section.id);
      assert.equal(editorial.totalAudited, figures.filter((figure) => figure.sectionId === section.id).length);
      assert.ok(editorial.visuals.every((figure) => !isTextHeavySourceAsset(figure)), `chapter ${chapter.n} ${section.id} leaks a text-heavy screenshot into learner view`);
      assert.ok(editorial.insights.every(isTextHeavySourceAsset), `chapter ${chapter.n} ${section.id} insight must come from a prose-oriented source`);
    }
  }
});

test("maps every plan learning task to valid exact units and covers the complete 116-section curriculum", () => {
  const known = new Map(cscsCourse.map((chapter) => [chapter.n, new Set(chapter.sections.map((section) => section.id))]));
  const covered = new Set();
  assert.equal(Object.keys(planTaskCurriculum).length, 48);
  for (const [taskId, curriculum] of Object.entries(planTaskCurriculum)) {
    if (curriculum.kind === "learn") assert.ok(curriculum.targets.length, `${taskId} needs an exact destination`);
    if (curriculum.kind !== "learn") assert.equal(curriculum.targets.length, 0, `${taskId} should open its guided task instead of a chapter`);
    for (const target of curriculum.targets) {
      assert.ok(known.has(target.chapter), `${taskId} targets unknown chapter ${target.chapter}`);
      assert.ok(target.sectionIds.length, `${taskId} has an empty chapter target`);
      for (const sectionId of target.sectionIds) {
        assert.ok(known.get(target.chapter).has(sectionId), `${taskId} targets unknown section ${target.chapter}:${sectionId}`);
        covered.add(`${target.chapter}:${sectionId}`);
      }
    }
  }
  const allSections = cscsCourse.flatMap((chapter) => chapter.sections.map((section) => `${chapter.n}:${section.id}`));
  assert.equal(allSections.length, 116);
  assert.deepEqual(allSections.filter((key) => !covered.has(key)), []);
  assert.deepEqual(planTaskCurriculum["w1-1"].targets.map((target) => target.chapter), [1]);
  assert.deepEqual(planTaskCurriculum["w1-2"].targets.map((target) => target.chapter), [2]);
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
