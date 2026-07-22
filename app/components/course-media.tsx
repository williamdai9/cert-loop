"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookImage, Check, Expand, ImageOff, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { mediaForChapter, type CourseMedia } from "@/lib/course-media";
import { editorialMediaForSection } from "@/lib/course-media-presentation";
import type { CourseChapter, CourseSection } from "@/lib/course";

type Lang = "en" | "zh";
type Figure = NonNullable<CourseMedia["noteFigures"]>[number];
type TextbookFigure = NonNullable<CourseMedia["textbookFigures"]>[number];

const signedUrlCache = new Map<string, string>();

function ProtectedCourseImage({ path, alt, className = "" }: { path: string; alt: string; className?: string }) {
  const [src, setSrc] = useState(signedUrlCache.get(path) || "");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (src) return;
    let active = true;
    const supabase = getSupabaseBrowser();
    if (!supabase) { queueMicrotask(() => setError(true)); return; }
    supabase.storage.from("course-media").createSignedUrl(path, 60 * 60).then(({ data, error: requestError }) => {
      if (!active) return;
      if (requestError || !data?.signedUrl) { setError(true); return; }
      signedUrlCache.set(path, data.signedUrl);
      setSrc(data.signedUrl);
    });
    return () => { active = false; };
  }, [path, src]);

  if (error) return <span className="protected-image-error"><ImageOff size={22} /> Protected visual could not be loaded.</span>;
  if (!src) return <span className="protected-image-loading"><BookImage size={22} /> Loading protected visual…</span>;
  return <img className={className} src={src} alt={alt} loading="lazy" />;
}

function ImageViewer({ figure, lang, onClose }: { figure: { path: string; title: { en: string; zh: string }; alt: { en: string; zh: string } }; lang: Lang; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const reset = () => { setScale(1); setOffset({ x: 0, y: 0 }); };

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    const root = dialog.current;
    const controls = () => Array.from(root?.querySelectorAll<HTMLElement>("button:not([disabled])") || []);
    controls()[0]?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const items = controls();
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); previousFocus.current?.focus(); };
  }, [onClose]);

  return <div ref={dialog} className="image-viewer-layer" role="dialog" aria-modal="true" aria-label={figure.title[lang]}>
    <header><div><span>PROTECTED COURSE VISUAL</span><strong>{figure.title[lang]}</strong></div><div><button onClick={() => setScale(value => Math.max(0.75, value - 0.25))} aria-label="Zoom out"><ZoomOut size={18} /></button><b>{Math.round(scale * 100)}%</b><button onClick={() => setScale(value => Math.min(4, value + 0.25))} aria-label="Zoom in"><ZoomIn size={18} /></button><button onClick={reset} aria-label="Reset view"><RotateCcw size={17} /></button><button onClick={onClose} aria-label="Close image"><X size={19} /></button></div></header>
    <div className={scale > 1 ? "image-viewer-canvas pannable" : "image-viewer-canvas"}
      onPointerDown={event => { if (scale <= 1) return; drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y }; event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerMove={event => { if (!drag.current) return; const limitX = window.innerWidth * .75, limitY = window.innerHeight * .75; setOffset({ x: Math.max(-limitX, Math.min(limitX, drag.current.ox + event.clientX - drag.current.x)), y: Math.max(-limitY, Math.min(limitY, drag.current.oy + event.clientY - drag.current.y)) }); }}
      onPointerUp={() => { drag.current = null; }}
      onPointerCancel={() => { drag.current = null; }}
      onDoubleClick={() => { if (scale === 1) setScale(2); else reset(); }}>
      <ProtectedCourseImage path={figure.path} alt={figure.alt[lang]} className="image-viewer-image" />
      <style>{`.image-viewer-image{transform:translate(${offset.x}px,${offset.y}px) scale(${scale})}`}</style>
    </div>
    <p>{lang === "en" ? "Drag when zoomed. Double-click to toggle 100% / 200%." : "放大后可拖动；双击切换 100% / 200%。"}</p>
  </div>;
}

function FigureCard({ figure, lang }: { figure: Figure; lang: Lang }) {
  const [open, setOpen] = useState(false);
  return <>
    <button className="note-figure-card" onClick={() => setOpen(true)}>
      <div><ProtectedCourseImage path={figure.path} alt={figure.alt[lang]} /></div>
      <span><strong>{figure.title[lang]}</strong>{lang === "zh" && <small>{figure.title.en}</small>}<p>{figure.caption[lang]}</p><em><Expand size={14} /> {lang === "en" ? "Open zoomable study view" : "打开可缩放学习视图"}</em></span>
    </button>
    {open && <ImageViewer figure={figure} lang={lang} onClose={() => setOpen(false)} />}
  </>;
}

function TextbookFigureCard({ figure, lang }: { figure: TextbookFigure; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const viewerFigure = {
    path: figure.path,
    title: {
      en: `${figure.figureRef} · ${figure.title.en}`,
      zh: `${figure.figureRef} · ${figure.title.zh}`,
    },
    alt: figure.alt,
  };

  return <>
    <article className="textbook-figure-card">
      <button className="textbook-figure-image" onClick={() => setOpen(true)} aria-label={lang === "en" ? `Open ${figure.figureRef} in the study viewer` : `在学习视图中打开 ${figure.figureRef}`}>
        <ProtectedCourseImage path={figure.path} alt={figure.alt[lang]} />
        <span><Expand size={15} /> {lang === "en" ? "Open full-resolution figure" : "打开高清原图"}</span>
      </button>
      <div className="textbook-figure-copy">
        <span className="textbook-figure-source">{figure.figureRef} · FIFTH EDITION · {Array.isArray(figure.page) ? `PP. ${figure.page.join(", ")}` : `P. ${figure.page}`}</span>
        <h4>{figure.title[lang]}</h4>
        {lang === "zh" && <small>{figure.title.en}</small>}
        <p>{figure.caption[lang]}</p>
        <aside><strong>{lang === "en" ? "CHECK YOUR READING" : "读图检查"}</strong><p>{figure.check[lang]}</p></aside>
      </div>
    </article>
    {open && <ImageViewer figure={viewerFigure} lang={lang} onClose={() => setOpen(false)} />}
  </>;
}

function InlineTextbookVisual({ figure, lang }: { figure: TextbookFigure; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const viewerFigure = {
    path: figure.path,
    title: { en: `${figure.figureRef} · ${figure.title.en}`, zh: `${figure.figureRef} · ${figure.title.zh}` },
    alt: figure.alt,
  };

  return <>
    <article className="inline-textbook-visual" data-media-id={figure.path}>
      <button onClick={() => setOpen(true)} aria-label={lang === "en" ? `Open ${figure.figureRef} in the study viewer` : `在学习视图中打开 ${figure.figureRef}`}>
        <ProtectedCourseImage path={figure.path} alt={figure.alt[lang]} />
        <span><Expand size={14} /> {lang === "en" ? "Study full resolution" : "查看高清原图"}</span>
      </button>
      <div>
        <span>{figure.figureRef} · {Array.isArray(figure.page) ? `PP. ${figure.page.join(", ")}` : `P. ${figure.page}`}</span>
        <h4>{figure.title[lang]}</h4>
        {lang === "zh" && <small>{figure.title.en}</small>}
        <p>{figure.caption[lang]}</p>
        <aside><strong>{lang === "en" ? "READ THE RELATIONSHIP" : "读图任务"}</strong><p>{figure.check[lang]}</p></aside>
      </div>
    </article>
    {open && <ImageViewer figure={viewerFigure} lang={lang} onClose={() => setOpen(false)} />}
  </>;
}

function sliceForSlot<T>(items: T[], slot: number, slots: number) {
  const start = Math.floor(slot * items.length / slots);
  const end = Math.floor((slot + 1) * items.length / slots);
  return items.slice(start, end);
}

export function SectionLearningFlow({ chapter, section, lang }: { chapter: number; section: CourseSection; lang: Lang }) {
  const { visuals, insights, retainedForAdmin } = editorialMediaForSection(chapter, section.id);
  const notes = (mediaForChapter(chapter).noteFigures || []).filter(figure => figure.sectionId === section.id);
  const paragraphs = section.explanation.length ? section.explanation : [section.examCue.en];

  return <div className="section-learning-flow" data-block-id={`chapter-${chapter}-${section.id}-flow`}>
    {paragraphs.map((paragraph, index) => {
      const paragraphVisuals = sliceForSlot(visuals, index, paragraphs.length);
      const paragraphNotes = sliceForSlot(notes, index, paragraphs.length);
      const paragraphInsights = sliceForSlot(insights, index, paragraphs.length);
      return <div className="learning-beat" key={`${section.id}-${index}`}>
        <p className="lecture-paragraph">{paragraph}</p>
        {paragraphInsights.map(insight => <aside className="source-insight" data-media-id={insight.path} key={insight.path}>
          <span>{lang === "en" ? "TEXTBOOK SOURCE · INTEGRATED INTO THE LESSON" : "教材内容 · 已融入讲解"}</span>
          <strong>{insight.title[lang]}</strong>
          {lang === "zh" && <small>{insight.title.en}</small>}
          <p>{insight.caption[lang]}</p>
          <em>{insight.check[lang]}</em>
        </aside>)}
        {!!paragraphNotes.length && <div className="inline-note-cluster">{paragraphNotes.map(figure => <FigureCard key={figure.path} figure={figure} lang={lang} />)}</div>}
        {!!paragraphVisuals.length && <div className="inline-visual-cluster" aria-label={lang === "en" ? "Visual explanation embedded in this lesson" : "嵌入本节的视觉讲解"}>{paragraphVisuals.map(figure => <InlineTextbookVisual key={figure.path} figure={figure} lang={lang} />)}</div>}
      </div>;
    })}
    {retainedForAdmin > 0 && <p className="editorial-media-note">{lang === "en" ? `${retainedForAdmin} supporting source plates remain available in the administrator evidence library. Learner view prioritizes explanatory visuals and curated source takeaways instead of presenting an unreadable screenshot wall.` : `${retainedForAdmin} 张辅助资料仍保留在管理员证据库。学习界面优先展示解释性图像与经过整理的教材要点，不再堆放难以阅读的截图墙。`}</p>}
  </div>;
}

export function SectionTextbookFigures({ chapter, sectionId, lang }: { chapter: number; sectionId: string; lang: Lang }) {
  const figures = (mediaForChapter(chapter).textbookFigures || []).filter(figure => figure.sectionId === sectionId);
  if (!figures.length) return null;
  return <section className="textbook-figure-set" aria-label={lang === "en" ? "Protected fifth-edition textbook figures" : "受保护的第五版教材图"}>
    <header>
      <div><span className="eyebrow">ENGLISH FIFTH EDITION · PROTECTED FIGURE SET</span><h3>{lang === "en" ? "Study the original textbook figure" : "直接学习英文教材原图"}</h3><p>{lang === "en" ? "Read the original labels and relationships, connect them to the lesson explanation, then answer the figure check before continuing." : "先阅读英文原图的标签与关系，再与课程讲解连接，并完成读图检查。"}</p></div>
      <span><BookImage size={15} /> {figures.length} {lang === "en" ? (figures.length === 1 ? "source figure" : "source figures") : "张教材图"}</span>
    </header>
    <div>{figures.map(figure => <TextbookFigureCard key={figure.path} figure={figure} lang={lang} />)}</div>
    <footer>{lang === "en" ? "Authenticated course access only · English fifth edition is the source of truth" : "仅限登录后的课程学习 · 以英文第五版为事实依据"}</footer>
  </section>;
}

export function ChapterSourceAppendix({ chapter, sectionIds, lang }: { chapter: number; sectionIds: string[]; lang: Lang }) {
  const knownSections = new Set(sectionIds);
  const figures = (mediaForChapter(chapter).textbookFigures || []).filter(figure => !knownSections.has(figure.sectionId));
  if (!figures.length) return null;
  return <section className="textbook-figure-set" aria-label={lang === "en" ? "Protected fifth-edition source appendix" : "受保护的第五版教材附录"}>
    <header>
      <div><span className="eyebrow">ENGLISH FIFTH EDITION · SOURCE APPENDIX</span><h3>{lang === "en" ? "Study the chapter-wide source material" : "学习全章教材资料"}</h3><p>{lang === "en" ? "These source plates support the whole chapter rather than one deep-dive unit. They are kept here so no audited textbook material is silently omitted." : "这些教材图版服务于整章而非单个深度单元，因此集中保留在这里，确保已审核资料不会被遗漏。"}</p></div>
      <span><BookImage size={15} /> {figures.length} {lang === "en" ? (figures.length === 1 ? "source plate" : "source plates") : "张教材图版"}</span>
    </header>
    <div>{figures.map(figure => <TextbookFigureCard key={figure.path} figure={figure} lang={lang} />)}</div>
    <footer>{lang === "en" ? "Authenticated course access only · English fifth edition is the source of truth" : "仅限登录后的课程学习 · 以英文第五版为事实依据"}</footer>
  </section>;
}

export function SectionNoteFigures({ chapter, sectionId, lang }: { chapter: number; sectionId: string; lang: Lang }) {
  const figures = (mediaForChapter(chapter).noteFigures || []).filter(figure => figure.sectionId === sectionId);
  if (!figures.length) return null;
  return <section className="section-figure-gallery" aria-label={lang === "en" ? "Figures from personal study notes" : "个人笔记图示"}>
    <header><div><span className="eyebrow">PERSONAL NOTE FIGURES · ACTIVE STUDY</span><h3>{lang === "en" ? "Learn the labels, then retrieve the system" : "先学标签，再回忆整个系统"}</h3></div><span>{figures.length} {lang === "en" ? "visuals" : "张图"}</span></header>
    <div>{figures.map(figure => <FigureCard key={figure.path} figure={figure} lang={lang} />)}</div>
  </section>;
}

export function TextbookVisualAtlas({ chapter, lang }: { chapter: number; lang: Lang }) {
  const media = mediaForChapter(chapter);
  const [active, setActive] = useState(0);
  const current = media.textbookAtlas[active] || media.textbookAtlas[0];
  const intro = useMemo(() => lang === "en"
    ? "Use this compact relationship review after reading the source figures. It summarizes the causal sequence; it does not replace the textbook artwork."
    : "请在学习教材原图后使用这组关系复习。它用于总结因果顺序，不能替代教材插图。", [lang]);
  if (!current) return null;

  return <section className="textbook-atlas">
    <div className="visual-lab-heading"><div><span className="eyebrow">TEXTBOOK-DERIVED · RELATIONSHIP REVIEW</span><h2>{lang === "en" ? "Explain the relationship, not only the terms" : "解释关系，而不只是记名词"}</h2><p>{intro}</p></div><span className="visual-badge"><BookImage size={16} /> {media.textbookAtlas.length} {lang === "en" ? "reviews" : "组复习"}</span></div>
    <div className="atlas-tabs">{media.textbookAtlas.map((item, index) => <button className={index === active ? "active" : ""} key={item.title.en} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.title[lang]}</b></button>)}</div>
    <article className="atlas-model">
      <header><span>{current.relationship[lang]}</span>{lang === "zh" && <small>{current.relationship.en}</small>}</header>
      <div>{current.steps.map((step, index) => <div key={step.en}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step[lang]}</strong>{lang === "zh" && <small>{step.en}</small>}{index < current.steps.length - 1 && <i>→</i>}</div>)}</div>
      <footer><Check size={15} /><span>{lang === "en" ? "Exam use: explain the arrows—not just the nouns—before moving on." : "考试用法：先解释箭头所代表的关系，而不只是背名词。"}</span></footer>
    </article>
  </section>;
}

export function TextbookConceptMap({ chapter, focusedSectionIds = [] }: { chapter: CourseChapter; focusedSectionIds?: string[] }) {
  const focused = new Set(focusedSectionIds);
  return <section id={`chapter-${chapter.n}-concept-map`} className="textbook-concept-map" aria-label={`English concept map for Chapter ${chapter.n}: ${chapter.title.en}`}>
    <header>
      <div><span className="eyebrow">ENGLISH FIFTH EDITION · CHAPTER CONCEPT MAP</span><h2>See the whole chapter before studying the parts</h2><p>Built from the English Fifth Edition curriculum, this map connects every unit to the relationships and exam decisions you must retrieve.</p></div>
      <span>CH. {String(chapter.n).padStart(2, "0")}</span>
    </header>
    <div className="textbook-concept-map-stage">
      <article className="textbook-concept-root">
        <span>{chapter.domain.en}</span>
        <strong>{chapter.title.en}</strong>
        <small>{chapter.sections.length} connected units</small>
      </article>
      <div className="textbook-concept-branches">
        {chapter.sections.map((section, index) => <article className={!focused.size || focused.has(section.id) ? "focus" : "context"} key={section.id}>
          <header><span>{String(index + 1).padStart(2, "0")}</span><strong>{section.title.en}</strong></header>
          <ul>{section.details.slice(0, 2).map(detail => <li key={detail}>{detail}</li>)}</ul>
          <footer><b>{focused.has(section.id) ? "THIS TASK" : "EXAM CONNECTION"}</b><p>{section.examCue.en}</p></footer>
        </article>)}
      </div>
    </div>
    <footer><Check size={16} /><span>Retrieval prompt: cover the branch cards and reconstruct every unit, its two key relationships, and its exam connection.</span></footer>
  </section>;
}
