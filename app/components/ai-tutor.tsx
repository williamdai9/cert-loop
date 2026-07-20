"use client";

import { useMemo, useRef, useState } from "react";
import { BookOpen, ExternalLink, Globe2, LoaderCircle, MessageCircle, Send, Sparkles, X } from "lucide-react";

type Lang = "en" | "zh";
type TutorContext = { chapterNumber?: number; chapterTitle?: string; taskId?: string; taskTitle?: string };
type TutorSource = { title: string; url?: string; kind: "course" | "official" | "research" | "web" };
type ChatMessage = { role: "user" | "assistant"; text: string; sources?: TutorSource[] };

export function AITutor({ lang, context, mastery }: { lang: Lang; context?: TutorContext; mastery: Record<string, { correct: number; total: number }> }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [research, setResearch] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const contextLabel = context?.taskTitle || context?.chapterTitle || (lang === "en" ? "Entire CSCS course" : "完整 CSCS 课程");
  const starters = useMemo(() => lang === "en" ? [
    "Teach this from first principles and quiz me.",
    "What do candidates commonly confuse here?",
    "Connect this topic to program-design decisions.",
  ] : ["从第一原理讲解并测试我。", "考生最容易混淆什么？", "把这个主题连到计划设计决策。"], [lang]);

  async function ask(text = question) {
    const cleaned = text.trim();
    if (!cleaned || busy) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", text: cleaned }];
    setMessages(nextMessages); setQuestion(""); setBusy(true); setError("");
    try {
      const response = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: cleaned, lang, context, research, mastery, history: nextMessages.slice(-8).map(item => ({ role: item.role, text: item.text })) }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Tutor request failed");
      setMessages(values => [...values, { role: "assistant", text: payload.answer, sources: payload.sources }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Tutor request failed");
    } finally { setBusy(false); window.setTimeout(() => inputRef.current?.focus(), 50); }
  }

  return <>
    <button className="tutor-launch" onClick={() => setOpen(true)} aria-label={lang === "en" ? "Open AI Tutor" : "打开 AI 导师"}><span><Sparkles size={18} /></span><b>AI Tutor</b><small>{lang === "en" ? "Whole-site context" : "全站上下文"}</small></button>
    {open && <div className="tutor-layer" role="dialog" aria-modal="true" aria-label="AI Tutor">
      <aside className="tutor-panel">
        <header><div><span><MessageCircle size={18} /></span><div><strong>Cert Loop AI Tutor</strong><small>{lang === "en" ? "English source of truth · Chinese support" : "英文事实基准 · 中文辅助"}</small></div></div><button onClick={() => setOpen(false)} aria-label="Close tutor"><X size={18} /></button></header>
        <div className="tutor-context"><BookOpen size={15} /><div><small>{lang === "en" ? "PRIORITY CONTEXT" : "优先上下文"}</small><b>{contextLabel}</b></div><span>{lang === "en" ? "Searches all 26 chapters" : "检索全部 26 章"}</span></div>
        <label className={research ? "research-toggle active" : "research-toggle"}><input type="checkbox" checked={research} onChange={e => setResearch(e.target.checked)} /><Globe2 size={15} /><span><b>{lang === "en" ? "Live research mode" : "实时研究模式"}</b><small>{lang === "en" ? "Search current official/open sources and cite them" : "搜索最新官方/开放来源并引用"}</small></span></label>
        <div className="tutor-thread">
          {!messages.length && <div className="tutor-welcome"><span><Sparkles size={24} /></span><h2>{lang === "en" ? "Ask across the whole course" : "向完整课程提问"}</h2><p>{lang === "en" ? "I use the complete course, question bank, your mastery record, official sources, and the reviewed research feed. Current context is prioritized, never isolated." : "我会使用完整课程、题库、你的掌握度、官方来源与审核后的研究动态。当前上下文只是优先项，不是边界。"}</p><div>{starters.map(item => <button key={item} onClick={() => ask(item)}>{item}</button>)}</div></div>}
          {messages.map((message, index) => <article className={`tutor-message ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === "assistant" ? "AI" : "YOU"}</span><div><p>{message.text}</p>{message.sources?.length ? <footer>{message.sources.map((source, si) => source.url ? <a key={`${source.url}-${si}`} href={source.url} target="_blank" rel="noreferrer"><ExternalLink size={11} /> {source.title}</a> : <em key={`${source.title}-${si}`}>{source.title}</em>)}</footer> : null}</div></article>)}
          {busy && <div className="tutor-thinking"><LoaderCircle size={17} /><span>{research ? (lang === "en" ? "Searching course and current sources…" : "正在检索课程与最新来源…") : (lang === "en" ? "Searching the full course…" : "正在检索完整课程…")}</span></div>}
          {error && <div className="tutor-error"><strong>{lang === "en" ? "Tutor is not connected yet" : "AI 导师尚未连接"}</strong><p>{error}</p></div>}
        </div>
        <form className="tutor-composer" onSubmit={event => { event.preventDefault(); ask(); }}><textarea ref={inputRef} value={question} onChange={event => setQuestion(event.target.value)} placeholder={lang === "en" ? "Ask a concept, compare two answers, or request a new quiz…" : "询问概念、比较答案，或要求生成新测试…"} rows={2} maxLength={2000} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); ask(); } }} /><button disabled={busy || !question.trim()}><Send size={17} /></button></form>
        <p className="tutor-disclaimer">{lang === "en" ? "Exam answers follow the English 5th edition and official DCO. New research is labeled and cannot silently override exam truth." : "考试答案以英文第五版和官方大纲为准；新研究会明确标注，不会静默覆盖考试事实。"}</p>
      </aside>
    </div>}
  </>;
}
