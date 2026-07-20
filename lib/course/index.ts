import { chapters0106 } from "./chapters-01-06";
import { chapters0712 } from "./chapters-07-12";
import { chapters1317 } from "./chapters-13-17";
import { chapters1822 } from "./chapters-18-22";
import { chapters2326 } from "./chapters-23-26";

export type { CourseChapter, CourseFormula, CourseSection, CourseText } from "./types";

export const cscsCourse = [
  ...chapters0106,
  ...chapters0712,
  ...chapters1317,
  ...chapters1822,
  ...chapters2326,
].sort((a, b) => a.n - b.n);

export const getCourseChapter = (chapterNumber: number) =>
  cscsCourse.find((chapter) => chapter.n === chapterNumber);
