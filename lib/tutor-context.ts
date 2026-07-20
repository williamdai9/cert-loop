import { certificationRegistry } from "./certifications";
import { cscsCourse } from "./course";

type TutorRequestContext = { chapterNumber?: number; chapterTitle?: string; taskId?: string; taskTitle?: string };

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff%]+/g, " ");
const tokens = (value: string) => Array.from(new Set(normalize(value).split(/\s+/).filter(token => token.length > 2))).slice(0, 24);

export function buildTutorContext(question: string, context?: TutorRequestContext, mastery: Record<string, { correct: number; total: number }> = {}) {
  const queryTokens = tokens(`${question} ${context?.taskTitle || ""} ${context?.chapterTitle || ""}`);
  const sections = cscsCourse.flatMap(chapter => chapter.sections.map(section => {
    const body = [chapter.title.en, chapter.title.zh, chapter.domain.en, chapter.domain.zh, section.title.en, section.title.zh, ...section.explanation, ...section.details, section.decision.en, section.examCue.en, ...chapter.terms.map(term => `${term.term} ${term.meaning.en}`)].join(" ");
    const haystack = normalize(body);
    const lexical = queryTokens.reduce((score, token) => score + (haystack.includes(token) ? 2 : 0), 0);
    const priority = chapter.n === context?.chapterNumber ? 30 : 0;
    return { chapter, section, score: lexical + priority };
  })).sort((a, b) => b.score - a.score);

  const priorityChapter = context?.chapterNumber ? cscsCourse.find(chapter => chapter.n === context.chapterNumber) : undefined;
  const picked = sections.filter((item, index, all) => item.score > 0 && all.findIndex(candidate => candidate.chapter.n === item.chapter.n && candidate.section.id === item.section.id) === index).slice(0, priorityChapter ? 10 : 12);
  if (!picked.length) picked.push(...sections.slice(0, 8));

  const pack = certificationRegistry[0];
  const relevantQuestions = pack.questions.map(item => {
    const text = normalize(`${item.en?.prompt || item.prompt} ${item.en?.explanation || item.explanation} ${item.source}`);
    return { item, score: queryTokens.reduce((score, token) => score + (text.includes(token) ? 1 : 0), 0) };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);

  const courseIndex = cscsCourse.map(chapter => `Ch. ${chapter.n}: ${chapter.title.en} [${chapter.domain.en}] — terms: ${chapter.terms.map(term => term.term).join(", ")}`).join("\n");
  const excerpts = picked.map(({ chapter, section }) => [
    `[Course Ch. ${chapter.n} › ${section.title.en}]`,
    ...section.explanation,
    ...section.details.map(detail => `• ${detail}`),
    `Coaching decision: ${section.decision.en}`,
    `Exam cue: ${section.examCue.en}`,
  ].join("\n")).join("\n\n");
  const questions = relevantQuestions.map(({ item }) => `[Question ${item.id} · ${item.source}] ${item.en?.prompt || item.prompt}\nCorrect reasoning: ${item.en?.explanation || item.explanation}`).join("\n\n");
  const masterySummary = Object.entries(mastery).map(([domain, stat]) => `${domain}: ${stat.correct}/${stat.total} (${stat.total ? Math.round(stat.correct / stat.total * 100) : 0}%)`).join("; ") || "No diagnostic evidence yet.";

  return {
    courseIndex,
    excerpts,
    questions,
    masterySummary,
    internalSources: Array.from(new Map(picked.map(({ chapter, section }) => [`${chapter.n}-${section.id}`, { title: `Course Ch. ${chapter.n} · ${section.title.en}`, kind: "course" as const }])).values()),
  };
}

