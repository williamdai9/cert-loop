"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookImage, Check, Expand, ImageOff, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { mediaForChapter, type CourseMedia } from "@/lib/course-media";

type Lang = "en" | "zh";
type Figure = NonNullable<CourseMedia["noteFigures"]>[number];

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
  const reset = () => { setScale(1); setOffset({ x: 0, y: 0 }); };

  return <div className="image-viewer-layer" role="dialog" aria-modal="true" aria-label={figure.title[lang]}>
    <header><div><span>PROTECTED COURSE VISUAL</span><strong>{figure.title[lang]}</strong></div><div><button onClick={() => setScale(value => Math.max(0.75, value - 0.25))} aria-label="Zoom out"><ZoomOut size={18} /></button><b>{Math.round(scale * 100)}%</b><button onClick={() => setScale(value => Math.min(4, value + 0.25))} aria-label="Zoom in"><ZoomIn size={18} /></button><button onClick={reset} aria-label="Reset view"><RotateCcw size={17} /></button><button onClick={onClose} aria-label="Close image"><X size={19} /></button></div></header>
    <div className={scale > 1 ? "image-viewer-canvas pannable" : "image-viewer-canvas"}
      onPointerDown={event => { if (scale <= 1) return; drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y }; event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerMove={event => { if (!drag.current) return; setOffset({ x: drag.current.ox + event.clientX - drag.current.x, y: drag.current.oy + event.clientY - drag.current.y }); }}
      onPointerUp={() => { drag.current = null; }}
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
      <span><strong>{figure.title.en}</strong><small>{figure.title.zh}</small><p>{figure.caption[lang]}</p><em><Expand size={14} /> {lang === "en" ? "Open zoomable study view" : "打开可缩放学习视图"}</em></span>
    </button>
    {open && <ImageViewer figure={figure} lang={lang} onClose={() => setOpen(false)} />}
  </>;
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
    ? "These original diagrams rebuild the relationships emphasized by the English fifth edition. They are teaching models—not scans of publisher figures."
    : "这些原创图解重建英文第五版强调的关系结构，属于教学模型，并非出版社插图扫描。", [lang]);
  if (!current) return null;

  return <section className="textbook-atlas">
    <div className="visual-lab-heading"><div><span className="eyebrow">5TH-EDITION VISUAL ATLAS · ORIGINAL REDRAW</span><h2>{lang === "en" ? "Rebuild the textbook's visual logic" : "重建教材的视觉逻辑"}</h2><p>{intro}</p></div><span className="visual-badge"><BookImage size={16} /> {media.textbookAtlas.length} {lang === "en" ? "models" : "个模型"}</span></div>
    <div className="atlas-tabs">{media.textbookAtlas.map((item, index) => <button className={index === active ? "active" : ""} key={item.title.en} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.title[lang]}</b></button>)}</div>
    <article className="atlas-model">
      <header><span>{current.relationship.en}</span><small>{current.relationship.zh}</small></header>
      <div>{current.steps.map((step, index) => <div key={step.en}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step.en}</strong><small>{step.zh}</small>{index < current.steps.length - 1 && <i>→</i>}</div>)}</div>
      <footer><Check size={15} /><span>{lang === "en" ? "Exam use: explain the arrows—not just the nouns—before moving on." : "考试用法：先解释箭头所代表的关系，而不只是背名词。"}</span></footer>
    </article>
  </section>;
}

export function MindMapRecap({ chapter, lang }: { chapter: number; lang: Lang }) {
  const mindMap = mediaForChapter(chapter).mindMap;
  const [open, setOpen] = useState(false);
  if (!mindMap) return <section className="mind-map-recap mind-map-original"><div><span className="eyebrow">MIND MAP RECAP · ORIGINAL COURSE MAP</span><h2>{lang === "en" ? "Build this chapter map from memory" : "凭记忆建立本章地图"}</h2><p>{lang === "en" ? "No verified personal map exists for this chapter, so the original visual atlas above is the review source. Write its nodes and arrows from memory before the checkpoints." : "本章没有已核验的个人导图，因此请使用上方原创视觉图谱复习。进入测试前，凭记忆写出节点和箭头。"}</p></div></section>;

  const viewerFigure = { path: mindMap.path, title: mindMap.title, alt: mindMap.title };
  return <>
    <section className="mind-map-recap">
      <button className="mind-map-preview" onClick={() => setOpen(true)}><ProtectedCourseImage path={mindMap.path} alt={mindMap.title[lang]} /><span><Expand size={18} /> {lang === "en" ? "Open full map" : "打开完整导图"}</span></button>
      <div><span className="eyebrow">MIND MAP RECAP · PERSONAL STUDY LAYER</span><h2>{mindMap.title.en}</h2><h3>{mindMap.title.zh}</h3><p>{mindMap.caption[lang]}</p><ol>{mindMap.outline.map((item, index) => <li key={item.en}><span>{index + 1}</span><div><b>{item.en}</b><small>{item.zh}</small></div></li>)}</ol><button className="ghost" onClick={() => setOpen(true)}><ZoomIn size={15} /> {lang === "en" ? "Zoom, pan, and study" : "缩放、拖动并学习"}</button></div>
    </section>
    {open && <ImageViewer figure={viewerFigure} lang={lang} onClose={() => setOpen(false)} />}
  </>;
}
