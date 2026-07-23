export type PlanTaskKind = "learn" | "practice" | "review";

export type PlanTaskTarget = {
  chapter: number;
  sectionIds: string[];
};

export type PlanTaskCurriculum = {
  kind: PlanTaskKind;
  targets: PlanTaskTarget[];
};

const target = (chapter: number, ...sectionIds: string[]): PlanTaskTarget => ({ chapter, sectionIds });

// Each standard-plan item owns a precise slice of the curriculum. The chapter
// reader can still expose the full chapter from Library, while Plan opens only
// the units required to complete the named task.
export const planTaskCurriculum: Record<string, PlanTaskCurriculum> = {
  "w1-0": { kind: "practice", targets: [] },
  "w1-1": { kind: "learn", targets: [target(1, "musculoskeletal", "contraction", "neuromuscular")] },
  "w1-2": { kind: "learn", targets: [target(2, "movement-language", "force-torque", "work-power-impulse", "muscle-mechanics", "joint-risk")] },
  "w1-3": { kind: "learn", targets: [target(1, "cardiovascular", "respiratory")] },

  "w2-0": { kind: "learn", targets: [target(3, "atp", "phosphagen", "glycolysis", "oxidative", "specificity")] },
  "w2-1": { kind: "learn", targets: [target(3, "phosphagen", "glycolysis", "specificity")] },
  "w2-2": { kind: "learn", targets: [
    target(4, "signaling", "acute-response", "anabolic", "stress"),
    target(5, "neural-adaptation", "hypertrophy", "connective", "metabolic", "concurrent-detraining"),
    target(6, "central", "peripheral", "performance", "individual-environment", "detraining"),
  ] },
  "w2-3": { kind: "practice", targets: [] },

  "w3-0": { kind: "learn", targets: [
    target(7, "growth-maturation", "youth-programming", "aging", "older-programming"),
    target(8, "body-composition", "adaptation-fatigue", "menstrual-health", "injury-context"),
  ] },
  "w3-1": { kind: "learn", targets: [target(9, "arousal", "motivation", "attention-skills", "motor-learning")] },
  "w3-2": { kind: "learn", targets: [target(9, "mental-health")] },
  "w3-3": { kind: "practice", targets: [] },

  "w4-0": { kind: "learn", targets: [target(10, "scope-energy", "carbohydrate", "protein-fat", "micronutrients", "hydration")] },
  "w4-1": { kind: "learn", targets: [target(11, "pre-event", "during-event", "recovery", "body-composition")] },
  "w4-2": { kind: "learn", targets: [
    target(11, "reds-eating"),
    target(12, "framework", "supported", "weak-evidence", "peds"),
  ] },
  "w4-3": { kind: "practice", targets: [] },

  "w5-0": { kind: "learn", targets: [target(13, "purpose", "selection", "administration")] },
  "w5-1": { kind: "learn", targets: [target(13, "quality")] },
  "w5-2": { kind: "learn", targets: [target(14, "body-composition", "strength-power", "speed-agility", "capacity", "statistics")] },
  "w5-3": { kind: "practice", targets: [] },

  "w6-0": { kind: "learn", targets: [target(15, "ramp", "mobility-flexibility", "stretching", "programming")] },
  "w6-1": { kind: "learn", targets: [target(16, "squat", "press-pull", "hinge")] },
  "w6-2": { kind: "learn", targets: [target(16, "fundamentals", "spotting")] },
  "w6-3": { kind: "learn", targets: [
    target(16, "weightlifting"),
    target(17, "bodyweight", "core-balance", "variable-resistance", "implements", "unilateral"),
  ] },

  "w7-0": { kind: "learn", targets: [target(18, "needs-analysis")] },
  "w7-1": { kind: "learn", targets: [target(18, "selection-order", "load-volume-rest")] },
  "w7-2": { kind: "learn", targets: [target(18, "progression")] },
  "w7-3": { kind: "learn", targets: [target(18, "needs-analysis", "selection-order", "load-volume-rest", "progression")] },

  "w8-0": { kind: "learn", targets: [target(19, "technique", "dose", "program")] },
  "w8-1": { kind: "learn", targets: [target(20, "speed", "deceleration", "perception", "design")] },
  "w8-2": { kind: "learn", targets: [target(19, "ssc", "technique", "dose", "program")] },
  "w8-3": { kind: "practice", targets: [] },

  "w9-0": { kind: "learn", targets: [target(21, "prescription", "intensity", "methods", "season")] },
  "w9-1": { kind: "learn", targets: [target(22, "hierarchy", "models")] },
  "w9-2": { kind: "learn", targets: [target(22, "annual", "taper")] },
  "w9-3": { kind: "practice", targets: [] },

  "w10-0": { kind: "learn", targets: [target(24, "continuum", "causes", "monitor", "recovery")] },
  "w10-1": { kind: "learn", targets: [target(23, "team", "healing", "progression", "redflags")] },
  "w10-2": { kind: "learn", targets: [
    target(25, "planning", "layout", "equipment", "operations"),
    target(26, "screening", "eap"),
  ] },
  "w10-3": { kind: "learn", targets: [target(26, "legal", "staff")] },

  "w11-0": { kind: "practice", targets: [] },
  "w11-1": { kind: "practice", targets: [] },
  "w11-2": { kind: "review", targets: [] },
  "w11-3": { kind: "review", targets: [] },
  "w12-0": { kind: "practice", targets: [] },
  "w12-1": { kind: "review", targets: [] },
  "w12-2": { kind: "review", targets: [] },
  "w12-3": { kind: "review", targets: [] },
};

export function curriculumForTask(taskId: string): PlanTaskCurriculum {
  if (taskId.startsWith("review-")) return { kind: "review", targets: [] };
  return planTaskCurriculum[taskId] || { kind: "review", targets: [] };
}

export function chaptersForTargets(targets: PlanTaskTarget[]) {
  return Array.from(new Set(targets.map(item => item.chapter)));
}
