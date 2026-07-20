export type CourseText = { en: string; zh: string };

export type CourseSection = {
  id: string;
  title: CourseText;
  explanation: string[];
  details: string[];
  decision: CourseText;
  examCue: CourseText;
};

export type CourseFormula = {
  name: string;
  expression: string;
  use: CourseText;
  example?: string;
};

export type CourseChapter = {
  n: number;
  title: CourseText;
  domain: CourseText;
  minutes: number;
  source: string;
  objectives: CourseText[];
  sections: CourseSection[];
  terms: Array<{ term: string; meaning: CourseText }>;
  formulas: CourseFormula[];
  examChecklist: CourseText[];
  recall: Array<{ prompt: CourseText; answer: CourseText }>;
};

export const T = (en: string, zh: string): CourseText => ({ en, zh });

