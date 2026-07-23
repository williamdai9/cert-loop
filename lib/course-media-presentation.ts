import { mediaForChapter, type CourseMedia } from "./course-media";

export type TextbookFigure = NonNullable<CourseMedia["textbookFigures"]>[number];

const textHeavyPath = /\/(?:table|panel|decision|worked|teaching|guidance|example|exercise-technique-directory|implementation-panel|medical|instruction|technique-guidance|drill-directory)-/i;
const textHeavyReference = /^(?:table|panel|source plate|key panel|medical guidance|instruction panel|unnumbered exercise checklist|unnumbered technique guidance|unnumbered speed and agility drill directory)/i;
const textHeavyTitle = /\b(?:checklist|release agreement|job description|evaluation form|sample rehabilitation referral form|sample strength and conditioning summary form|written guidelines|protocol|policy foundation|legal terms|definitions|terminology)\b/i;
const textHeavyFigureReference = /^Figure\s+14\.34(?:\s|·|$)/i;

// These multipart movement plates were visually audited as prose-only pages.
// Their companion parts contain the useful photographs and remain inline.
const textOnlyMovementBasenames = new Set([
  "technique-02-side-plank-p1139-part-a.png",
  "technique-09-tire-flip-p1147-part-a.png",
  "technique-10-log-clean-and-press-p1149-part-b.png",
  "technique-10-log-clean-and-press-p1150-part-c.png",
  "technique-11-yoke-walk-p1152-part-b.png",
  "technique-12-sandbag-carry-p1153-part-b.png",
  "technique-13-zercher-carry-p1155-part-b.png",
  "technique-13-zercher-carry-p1156-part-c.png",
  "technique-14-forward-sled-push-and-pull-p1158-part-b.png",
  "technique-14-forward-sled-push-and-pull-p1159-part-c.png",
  "technique-16-back-squat-with-bands-p1163-part-b.png",
  "technique-17-accentuated-eccentrically-loaded-bench-press-p1166-part-b.png",
  "technique-18-landmine-rotation-p1167-part-b.png",
  "technique-20-landmine-squat-to-press-p1171-part-b.png",
  "technique-20-landmine-squat-to-press-p1172-part-c.png",
  "technique-22-single-leg-squat-p1177-part-b.png",
  "technique-23-single-leg-romanian-deadlift-rdl-p1179-part-b.png",
  "technique-24-one-arm-dumbbell-snatch-p1181-part-b.png",
  "technique-19-02a.png",
  "technique-19-03b.png",
  "technique-19-05b.png",
  "technique-19-08b.png",
  "technique-19-10b.png",
  "technique-19-11b.png",
  "technique-19-13b.png",
  "technique-19-14b.png",
  "technique-19-15b.png",
  "technique-19-16a.png",
  "technique-19-17b.png",
  "technique-19-18b.png",
  "technique-19-19b.png",
  "technique-19-20b.png",
  "technique-19-22a.png",
  "technique-19-23a.png",
  "technique-19-23b.png",
  "technique-19-29b.png",
  "technique-19-33a.png",
  "technique-19-35b.png",
  "technique-19-36b.png",
  "technique-19-37b.png",
  "technique-19-38b.png",
  "technique-19-39b.png",
  "technique-19-41a.png",
  "technique-19-41b.png",
  "technique-19-42b.png",
  "technique-19-43b.png",
  "technique-19-44b.png",
  "technique-19-45b.png",
  "technique-19-46b.png",
  "technique-19-47b.png",
  "technique-19-48b.png",
  "technique-19-50b.png",
  "technique-19-53b.png",
  "technique-19-54b.png",
  "technique-19-55b.png",
  "drill-01-ankling-p1485-part-b.png",
  "drill-02-a-skip-p1486-part-a.png",
  "drill-02-a-skip-p1487-part-b.png",
  "drill-03-b-skip-p1489-part-b.png",
  "drill-03-b-skip-p1490-part-c.png",
  "drill-04-switches-p1492-part-b.png",
  "drill-05-dribbles-p1494-part-b.png",
  "drill-06-straight-leg-bound-p1496-part-b.png",
  "drill-07-sprint-resistance-incline-for-acceleration-p1498-part-b.png",
  "drill-07-sprint-resistance-incline-for-acceleration-p1499-part-c.png",
  "drill-08-deceleration-drill-p1500-part-b.png",
  "drill-10-multiplanar-acceleration-initiation-box-drill-p1506-part-b.png",
]);

export function isTextHeavySourceAsset(figure: TextbookFigure) {
  const basename = figure.path.split("/").at(-1) || "";
  return textOnlyMovementBasenames.has(basename)
    || textHeavyPath.test(`/${basename}`)
    || textHeavyReference.test(figure.figureRef)
    || textHeavyFigureReference.test(figure.figureRef)
    || textHeavyTitle.test(figure.title.en);
}

function groupKey(figure: TextbookFigure) {
  return `${figure.sectionId}:${figure.title.en.toLowerCase().replace(/\s*[—-]\s*part.*$/i, "").replace(/\s+/g, " ").trim()}`;
}

function visualPriority(figure: TextbookFigure) {
  const file = figure.path.split("/").at(-1) || "";
  if (/^figure-/i.test(file) || /^figure\s/i.test(figure.figureRef)) return 100;
  if (/^(?:technique|drill)-/i.test(file)) return 80;
  return 60;
}

export function editorialMediaForSection(chapter: number, sectionId: string) {
  const figures = (mediaForChapter(chapter).textbookFigures || []).filter(figure => figure.sectionId === sectionId);
  const visualGroups = new Map<string, TextbookFigure[]>();
  const insightGroups = new Map<string, TextbookFigure>();

  for (const figure of figures) {
    const key = groupKey(figure);
    if (isTextHeavySourceAsset(figure)) {
      if (!insightGroups.has(key)) insightGroups.set(key, figure);
      continue;
    }
    visualGroups.set(key, [...(visualGroups.get(key) || []), figure]);
  }

  const selectedGroups = [...visualGroups.values()]
    .sort((a, b) => visualPriority(b[0]) - visualPriority(a[0]))
    .slice(0, 4);
  const visuals = selectedGroups.flatMap(group => group.slice(0, 3));
  const insights = [...insightGroups.values()].slice(0, 4);

  return {
    visuals,
    insights,
    retainedForAdmin: Math.max(0, figures.length - visuals.length - insights.length),
    totalAudited: figures.length,
  };
}
