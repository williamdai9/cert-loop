import { certificationRegistry } from "./certifications";
import { cscsCourse } from "./course";

type TutorRequestContext = { chapterNumber?: number; chapterTitle?: string; taskId?: string; taskTitle?: string };

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff%]+/g, " ");
const tokens = (value: string) => Array.from(new Set(normalize(value).split(/\s+/).filter(token => token.length > 2))).slice(0, 24);

export function buildTutorContext(question: string, context?: TutorRequestContext, mastery: Record<string, { correct: number; total: number }> = {}) {
  const query = normalize(`${question} ${context?.taskTitle || ""} ${context?.chapterTitle || ""}`);
  const queryTokens = tokens(query);
  const conceptSignals: Array<{ pattern: RegExp; chapters: number[]; boost: number }> = [
    { pattern: /\b(muscle|sarcomere|actin|myosin|neuromuscular|excitation contraction)\b/, chapters: [1], boost: 18 },
    { pattern: /\b(force|power|velocity|torque|lever|biomechan|force velocity)\b/, chapters: [2, 14, 18], boost: 16 },
    { pattern: /\b(atp|energy system|bioenergetic|glycolysis|oxidative|phosphagen|lactate)\b/, chapters: [3], boost: 18 },
    { pattern: /\b(hormone|endocrine|testosterone|cortisol|growth hormone)\b/, chapters: [4], boost: 18 },
    { pattern: /\b(anaerobic adaptation|hypertrophy|neural adaptation|tendon|bone adaptation)\b/, chapters: [5], boost: 16 },
    { pattern: /\b(aerobic adaptation|vo2|maximal oxygen|mitochond|cardiovascular adaptation)\b/, chapters: [6], boost: 16 },
    { pattern: /\b(youth|child|adolescent|older adult|aging|age related)\b/, chapters: [7], boost: 18 },
    { pattern: /\b(sex difference|female athlete|menstrual|pregnan|menopause)\b/, chapters: [8], boost: 18 },
    { pattern: /\b(psycholog|arousal|anxiety|attention|motivation|goal setting)\b/, chapters: [9], boost: 18 },
    { pattern: /\b(nutrition|macronutrient|micronutrient|hydration|energy availability)\b/, chapters: [10, 11], boost: 14 },
    { pattern: /\b(supplement|ergogenic|doping|prohibited|steroid|creatine|caffeine)\b/, chapters: [12], boost: 18 },
    { pattern: /\b(test selection|validity|reliability|testing order|assessment|norm referenced)\b/, chapters: [13, 14], boost: 16 },
    { pattern: /\b(warm up|mobility|flexibility|stretch|performance preparation)\b/, chapters: [15], boost: 18 },
    { pattern: /\b(squat|deadlift|bench press|free weight|machine exercise|lifting technique)\b/, chapters: [16], boost: 18 },
    { pattern: /\b(kettlebell|strongman|nontraditional|bodyweight|alternative mode)\b/, chapters: [17], boost: 18 },
    { pattern: /\b(program design|resistance program|load|repetition|set|rest interval|exercise order)\b/, chapters: [18], boost: 18 },
    { pattern: /\b(plyometric|stretch shortening|jump training|landing)\b/, chapters: [19], boost: 18 },
    { pattern: /\b(speed|agility|sprint|change of direction)\b/, chapters: [20], boost: 18 },
    { pattern: /\b(aerobic program|endurance program|heart rate reserve|karvonen)\b/, chapters: [21], boost: 18 },
    { pattern: /\b(periodization|macrocycle|mesocycle|microcycle|peaking|phase potentiation)\b/, chapters: [22], boost: 18 },
    { pattern: /\b(rehab|recondition|injury|return to sport|tissue healing)\b/, chapters: [23], boost: 18 },
    { pattern: /\b(recovery|overtraining|overreaching|fatigue|readiness|sleep)\b/, chapters: [24], boost: 18 },
    { pattern: /\b(facility|layout|equipment spacing|maintenance)\b/, chapters: [25], boost: 18 },
    { pattern: /\b(legal|liability|policy|procedure|emergency action|staff|risk management)\b/, chapters: [26], boost: 18 },
  ];
  const sections = cscsCourse.flatMap(chapter => chapter.sections.map(section => {
    const body = [chapter.title.en, chapter.title.zh, chapter.domain.en, chapter.domain.zh, section.title.en, section.title.zh, ...section.explanation, ...section.details, section.decision.en, section.examCue.en, ...chapter.terms.map(term => `${term.term} ${term.meaning.en}`)].join(" ");
    const haystack = normalize(body);
    const lexical = queryTokens.reduce((score, token) => score + (haystack.includes(token) ? 2 : 0), 0);
    const priority = chapter.n === context?.chapterNumber ? 30 : 0;
    const concept = conceptSignals.reduce((score, signal) => score + (signal.pattern.test(query) && signal.chapters.includes(chapter.n) ? signal.boost : 0), 0);
    return { chapter, section, score: lexical + priority + concept };
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
