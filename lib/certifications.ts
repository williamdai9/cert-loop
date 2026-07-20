import {
  basePlan, chapters, domains, questions, quickCards,
  type DomainId, type Question, type Section,
} from "./cscs-data";
import { cardEnglish, planEnglish, questionEnglish } from "./cscs-en";

export type { DomainId, Question, Section };

export type CertificationPack = {
  id: string;
  acronym: string;
  name: string;
  edition: string;
  locale: string;
  description: string;
  sourceNote: string;
  verifiedOn: string;
  officialFacts: Array<{ value: string; labelEn: string; labelZh: string }>;
  officialSources: Array<{ label: string; url: string }>;
  exam: {
    sections: Array<{ name: string; total: number; scored: number; minutes: number }>;
    optionsPerQuestion: number;
  };
  domains: typeof domains;
  chapters: typeof chapters;
  plan: Array<(typeof basePlan)[number] & { en?: { title: string; subtitle: string; tasks: string[] } }>;
  quickCards: Array<(typeof quickCards)[number] & { en?: { front: string; back: string } }>;
  questions: Question[];
};

export const certificationRegistry: CertificationPack[] = [
  {
    id: "nsca-cscs-5",
    acronym: "CSCS",
    name: "Certified Strength & Conditioning Specialist",
    edition: "第五版",
    locale: "zh-CN",
    description: "A bilingual study pack grounded in the English fifth-edition textbook and official NSCA DCO",
    sourceNote: "English 5th ed. textbook · Official English DCO",
    verifiedOn: "2026-07-19",
    officialFacts: [
      { value: "70", labelEn: "minimum scaled score", labelZh: "最低标准分" },
      { value: "30–40", labelEn: "video/image items in Applied", labelZh: "实践部分视频/图片题" },
      { value: "1 year", labelEn: "to pass both sections", labelZh: "通过两部分的期限" },
      { value: "B.A./B.S. + CPR/AED", labelEn: "current eligibility baseline", labelZh: "当前报考资格基线" },
    ],
    officialSources: [
      { label: "NSCA CSCS Certification", url: "https://www.nsca.com/certification/cscs" },
      { label: "NSCA CSCS Exam Description", url: "https://www.nsca.com/cscs-exam-description/" },
    ],
    exam: {
      sections: [
        { name: "科学基础", total: 95, scored: 80, minutes: 90 },
        { name: "实践应用", total: 125, scored: 110, minutes: 150 },
      ],
      optionsPerQuestion: 3,
    },
    domains,
    chapters,
    plan: basePlan.map(w => ({ ...w, en: planEnglish[w.id] })),
    quickCards: quickCards.map(c => ({ ...c, en: cardEnglish[c.front] })),
    questions: questions.map(q => ({ ...q, en: questionEnglish[q.id] })),
  },
];

// 扩展方式：新增一个独立内容包并注册到 certificationRegistry。
// UI、计划打卡、测试、错题与本地进度引擎无需修改。
