import type { SupabaseClient } from "@supabase/supabase-js";
import { cscsCourse } from "./course";
import { courseMedia } from "./course-media";

export type TutorSource = {
  id: string; title: string; kind: string; excerpt?: string; url?: string;
  page?: number | null; chapter?: number | null; language?: string; extraction?: string;
};
export type LibraryHit = {
  id: string; document_id: string; title: string; kind: string; language: string;
  edition: string | null; page: number | null; chapter: number | null;
  content: string; extraction: string; rank: number;
};

const stop = new Set("the a an and or of for to in on with from is are how what why when me my this that these those explain teach compare using use based book textbook chapter notes mind maps map knowledge graph please can does do all it its between about difference question quiz first principles topic one time at connect related concepts".split(" "));
// Cross-language retrieval aliases, not exam facts or generated answers.
const aliases: Array<[RegExp, string[]]> = [
  [/muscle|肌肉|肌纤维/i, ["muscle", "肌肉", "肌纤维"]],
  [/sarcomere|肌节/i, ["sarcomere", "肌节"]],
  [/actin|myosin|肌动|肌球/i, ["actin", "myosin", "肌动", "肌球"]],
  [/contraction|收缩/i, ["contraction", "收缩"]],
  [/energy|atp|bioenerget|phosphagen|能量|磷酸原/i, ["energy", "ATP", "能量", "磷酸原"]],
  [/glycolysis|糖酵解/i, ["glycolysis", "糖酵解"]],
  [/force|torque|lever|力矩|杠杆/i, ["force", "torque", "力矩", "杠杆"]],
  [/periodization|周期/i, ["periodization", "周期化"]],
  [/plyometric|stretch.shortening|增强式/i, ["plyometric", "stretch shortening", "增强式"]],
  [/nutrition|营养/i, ["nutrition", "营养"]],
  [/protein|蛋白/i, ["protein", "蛋白质"]],
  [/recovery|恢复|疲劳/i, ["recovery", "fatigue", "恢复"]],
  [/hypertrophy|肌肥大/i, ["hypertrophy", "肌肥大"]],
  [/aerobic|有氧/i, ["aerobic", "有氧"]],
  [/hormone|endocrine|激素|内分泌/i, ["hormone", "endocrine", "激素"]],
];

export function tutorSearchTerms(question: string, contextTitle = "") {
  const lexical = (question.toLowerCase().match(/[a-z][a-z0-9-]{1,}|[\u4e00-\u9fff]{2,}/g) || []).filter(t => !stop.has(t));
  const expanded = aliases.filter(([pattern]) => pattern.test(question)).flatMap(([, words]) => words);
  const translated = cscsCourse.flatMap(ch => ch.terms).filter(term => {
    const chinese = lexical.filter(t => /[\u4e00-\u9fff]/.test(t));
    return chinese.some(t => t.length <= 10 && term.meaning.zh.includes(t));
  }).slice(0, 3).map(term => term.term);
  const candidates = [...expanded, ...translated, ...lexical];
  if (!candidates.length) candidates.push(...contextTitle.toLowerCase().split(/[^a-z]+/).filter(t => t.length > 2 && !stop.has(t)));
  return Array.from(new Set(candidates)).filter(t => t.length >= 2 && t.length <= 80).slice(0, 20);
}

export async function retrieveTutorLibrary(db: SupabaseClient, question: string, chapter?: number, contextTitle?: string) {
  const terms = tutorSearchTerms(question, contextTitle);
  if (!terms.length) return { sources: [] as TutorSource[], evidence: "No specific source keywords yet.", available: true };
  const { data, error } = await db.rpc("search_tutor_library", { search_terms: terms, preferred_chapter: chapter || null }).abortSignal(AbortSignal.timeout(12000));
  if (error) return { sources: [] as TutorSource[], evidence: "Original-source retrieval is unavailable. Do not imply you consulted original files.", available: false };
  // Low-resolution map OCR is a search hint, never evidence for an answer.
  const hits = ((data || []) as LibraryHit[]).filter(hit => hit.extraction !== "image_ocr");
  const sources: TutorSource[] = hits.map((hit, index) => ({
    id: `S${index + 1}`, title: hit.title, kind: hit.kind, page: hit.page,
    chapter: hit.chapter, excerpt: hit.content, language: hit.language, extraction: hit.extraction,
  }));
  return {
    sources, available: true,
    evidence: sources.map(source => `[${source.id}] ${source.title} | ${source.kind} | ${source.page ? `PDF file page ${source.page}` : "no page number"} | ${source.chapter ? `Ch. ${source.chapter}` : "chapter not assigned"} | extraction: ${source.extraction}\n${source.excerpt}`).join("\n\n") || "No original-source matches. Say so; do not invent citations.",
  };
}

export function citedTutorSources(answer: string, sources: TutorSource[]) {
  // Models may write [S1, PDF p. 55] or group citations as [S1, S2].
  const ids = new Set(Array.from(answer.matchAll(/\[([^\]]+)\]/g))
    .flatMap(match => match[1].match(/\b[SCM]\d+\b/g) || []));
  return sources.filter(source => ids.has(source.id));
}

export async function tutorMapImage(db: SupabaseClient, chapter: number | undefined) {
  const map = chapter ? courseMedia[chapter]?.mindMap : undefined;
  if (!map) return null;
  // A registry-owned path, never a user-provided remote URL.
  const { data, error } = await db.storage.from("course-media").createSignedUrl(map.path, 300);
  if (error || !data?.signedUrl) return null;
  return { id: "M1", title: map.title.en, kind: "mindmap", chapter, language: "zh", url: data.signedUrl } satisfies TutorSource;
}

export function configuredTutorModel(value = process.env.OPENAI_TUTOR_MODEL) {
  const model = value?.trim() || "gpt-5.4";
  const generation = Number(model.match(/^gpt-(\d+)(?:[.-]|$)/)?.[1]);
  if (!Number.isFinite(generation) || generation < 5 || /codex|audio|realtime|transcri|image|search/.test(model)) {
    throw new Error("The tutor requires a GPT-5 or newer general-purpose model.");
  }
  return model;
}
