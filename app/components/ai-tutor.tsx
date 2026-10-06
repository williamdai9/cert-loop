"use client";

import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { BookOpen, ExternalLink, Globe2, LoaderCircle, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { TutorSource } from "@/lib/tutor-library";

type Lang = "en" | "zh";
type TutorContext = { chapterNumber?: number; chapterTitle?: string; taskId?: string; taskTitle?: string };
type ChatMessage = {
  role: "user" | "assistant"; text: string; sources?: TutorSource[]; model?: string;
  researched?: boolean; libraryAvailable?: boolean; matchedSources?: number; incomplete?: boolean;
};
type TutorStatus = { model: string | null; configured: boolean; libraryAvailable: boolean; library: Array<{ kind: string; documents: number; chunks: number }> };

async function tutorToken() {
  const db = getSupabaseBrowser();
  const { data } = db ? await db.auth.getSession() : { data: { session: null } };
  return data.session?.access_token;
}

export function AITutor({ lang, context }: { lang: Lang; context?: TutorContext; mastery?: Record<string, { correct: number; total: number }> }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [research, setResearch] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<TutorStatus | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sendingRef = useRef(false);
  const contextLabel = context?.taskTitle || context?.chapterTitle || (lang === "en" ? "All course topics" : "全部课程主题");
  const starters = lang === "en" ? [
    "Explain this topic using the textbook and my mind maps.",
    "Connect this topic to related concepts and program design.",
    "Quiz me on this topic, one question at a time.",
  ] : ["结合教材和我的思维导图讲解这个主题。", "把这个主题与相关知识和计划设计联系起来。", "围绕这个主题测试我，每次只问一题。"];

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.showModal();
    inputRef.current?.focus();
    const controller = new AbortController();
    (async () => {
      const token = await tutorToken();
      if (!token) return;
      const response = await fetch("/api/tutor", { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal });
      if (response.ok) setStatus(await response.json());
    })().catch(() => { /* Asking a question exposes any actionable connection error. */ });
    return () => controller.abort();
  }, [open]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "end", behavior: "instant" }); }, [messages, busy, error]);
  useEffect(() => () => abortRef.current?.abort(), []);

  async function ask(text = question) {
    const cleaned = text.trim();
    if (!cleaned || sendingRef.current) return;
    sendingRef.current = true;
    const prior = messages;
    setMessages([...prior, { role: "user", text: cleaned }]);
    setQuestion(""); setBusy(true); setError("");
    const controller = new AbortController(); abortRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 100000);
    try {
      const token = await tutorToken();
      if (!token) throw new Error(lang === "en" ? "Sign in again to use the AI Tutor." : "请重新登录后使用 AI 导师。");
      const response = await fetch("/api/tutor", {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: cleaned, lang, context, research, history: prior.slice(-8).map(item => ({ role: item.role, text: item.text })) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || (lang === "en" ? "Please try again." : "请重试。"));
      setMessages(values => [...values, { role: "assistant", text: payload.answer, sources: payload.sources, model: payload.model,
        researched: payload.researched, libraryAvailable: payload.libraryAvailable, matchedSources: payload.matchedSources, incomplete: payload.incomplete }]);
    } catch (caught) {
      setMessages(prior); setQuestion(cleaned);
      setError(caught instanceof Error && caught.name !== "AbortError" ? caught.message : (lang === "en" ? "The connection timed out. Your question is preserved; send it again." : "连接超时。问题已保留，请重新发送。"));
    } finally {
      window.clearTimeout(timeout); sendingRef.current = false; setBusy(false); inputRef.current?.focus();
    }
  }

  const sourceLabels: Record<string, string> = lang === "en"
    ? { textbook: "Textbook", note: "Personal notes", mindmap: "Original mind map", practice: "Practice material", outline: "Supplied outline", course: "Course synthesis", web: "Web" }
    : { textbook: "英文教材", note: "个人笔记", mindmap: "原始思维导图", practice: "练习资料", outline: "提供的大纲", course: "课程整理", web: "网页" };
  const count = (kind: string) => status?.library.find(row => row.kind === kind)?.documents || 0;

  return <>
    <button className="tutor-launch" onClick={() => setOpen(true)} aria-label={lang === "en" ? "Open AI Tutor" : "打开 AI 导师"}><span><Sparkles size={18} /></span><b>AI Tutor</b><small>{lang === "en" ? "Ask across your library" : "向完整资料库提问"}</small></button>
    {open && <dialog ref={dialogRef} className="tutor-layer" aria-label="AI Tutor" onCancel={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <aside className="tutor-panel">
        <header><div><span><MessageCircle size={18} /></span><div><strong>Cert Loop AI Tutor</strong><small>{status ? (status.configured ? `${status.model} · ${lang === "en" ? "Connected" : "已连接"}` : (lang === "en" ? "Connection needs attention" : "需要检查连接")) : (lang === "en" ? "Checking connection…" : "正在检查连接…")}</small></div></div><div><button className="tutor-new" disabled={busy || !messages.length} onClick={() => { setMessages([]); setError(""); }} aria-label={lang === "en" ? "New chat" : "新对话"}>{lang === "en" ? "New" : "新对话"}</button><button onClick={() => setOpen(false)} aria-label={lang === "en" ? "Close tutor" : "关闭导师"}><X size={18} /></button></div></header>
        <div className="tutor-context"><BookOpen size={17} /><div><b>{contextLabel}</b><small>{lang === "en" ? "Context helps; questions can cover any chapter." : "当前主题仅供参考，可以询问任何章节。"}</small></div></div>
        <label className={research ? "research-toggle active" : "research-toggle"}><input type="checkbox" checked={research} onChange={e => setResearch(e.target.checked)} /><Globe2 size={17} /><span><b>{lang === "en" ? "Search the web for this answer" : "为本次回答搜索网页"}</b><small>{lang === "en" ? "Optional · current sources · additional API usage" : "可选 · 最新来源 · 会增加 API 用量"}</small></span></label>
        <div className="tutor-thread" aria-label={lang === "en" ? "Conversation" : "对话"}>
          {!messages.length && <div className="tutor-welcome"><h2>{lang === "en" ? "Learn with your whole library" : "结合完整资料库学习"}</h2><p>{lang === "en" ? "Ask for a clear explanation, connect concepts, or practise one question at a time. Answers use the English fifth edition first, with supporting notes and mind maps." : "可以深入讲解、串联知识点，或逐题练习。答案以英文第五版为先，结合你的笔记和思维导图。"}</p>
            {status && <p className="tutor-coverage">{status.libraryAvailable && count("textbook") ? (lang === "en" ? `26 course chapters · ${count("note")} notes · ${count("mindmap")} mind maps indexed` : `26 章课程 · ${count("note")} 份笔记 · ${count("mindmap")} 张思维导图已索引`) : (lang === "en" ? "Original-source library is not available yet." : "原始资料库暂不可用。")}</p>}
            <div>{starters.map(item => <button key={item} onClick={() => ask(item)} disabled={busy}>{item}</button>)}</div></div>}
          {messages.map((message, index) => <article className={`tutor-message ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === "assistant" ? "AI" : (lang === "en" ? "YOU" : "你")}</span><div>
            {message.model && <div className="tutor-answer-meta">{message.model} · {message.researched ? (lang === "en" ? "Web searched" : "已联网检索") : (lang === "en" ? "Library answer" : "资料库回答")}</div>}
            <div className="tutor-prose"><Markdown skipHtml components={{ img: () => null, a: ({ href, children }) => /^https?:\/\//.test(href || "") ? <a href={href} target="_blank" rel="noreferrer">{children}</a> : <span>{children}</span> }}>{message.text}</Markdown></div>
            {message.role === "assistant" && (message.libraryAvailable === false || message.matchedSources === 0 || message.incomplete) && <p className="tutor-answer-warning">{message.incomplete ? (lang === "en" ? "This answer reached its length limit. Ask to continue." : "回答达到长度上限，可以要求继续。") : message.libraryAvailable === false ? (lang === "en" ? "Original-source retrieval was unavailable for this answer." : "本次未能检索原始资料。") : (lang === "en" ? "No original-file match was found for this question." : "未找到与本问题匹配的原始资料。")}</p>}
            {!!message.sources?.length && <details className="tutor-sources"><summary>{lang === "en" ? `Sources cited (${message.sources.length})` : `引用依据（${message.sources.length}）`}</summary>{message.sources.map(source => <div key={source.id} className="tutor-source"><strong>[{source.id}] {source.title}</strong><small>{sourceLabels[source.kind] || source.kind}{source.page ? ` · PDF ${lang === "en" ? "page" : "文件页"} ${source.page}` : ""}{source.chapter ? ` · Ch. ${source.chapter}` : ""}</small>{source.url ? <a href={source.url} target="_blank" rel="noreferrer"><ExternalLink size={13} />{lang === "en" ? "Open source" : "查看来源"}</a> : source.excerpt && <details><summary>{lang === "en" ? "Evidence excerpt" : "原文片段"}</summary>{lang === "en" && /[\u4e00-\u9fff]/.test(source.excerpt) ? <p>Original reference is in Chinese; its concepts are translated in the answer. Switch to Chinese to inspect the original excerpt.</p> : <p>{source.excerpt.slice(0, 1200)}{source.excerpt.length > 1200 ? "…" : ""}</p>}</details>}</div>)}</details>}
          </div></article>)}
          {busy && <div className="tutor-thinking" role="status"><LoaderCircle size={17} /><span>{research ? (lang === "en" ? "Reading your sources and searching the web…" : "正在阅读资料并搜索网页…") : (lang === "en" ? "Reading relevant textbook pages, notes and maps…" : "正在检索相关教材页、笔记和思维导图…")}</span></div>}
          {error && <div className="tutor-error" role="alert"><strong>{lang === "en" ? "Answer unavailable" : "暂时无法回答"}</strong><p>{error}</p></div>}
          <div ref={endRef} />
        </div>
        <form className="tutor-composer" onSubmit={event => { event.preventDefault(); ask(); }}><textarea ref={inputRef} aria-label={lang === "en" ? "Your question" : "你的问题"} value={question} onChange={event => setQuestion(event.target.value)} placeholder={lang === "en" ? "Ask, compare concepts, or request a quiz…" : "询问知识、比较概念，或逐题测试…"} rows={2} maxLength={2000} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); ask(); } }} /><button disabled={busy || !question.trim()} aria-label={lang === "en" ? "Send question" : "发送问题"}><Send size={18} /></button></form>
        <p className="tutor-disclaimer">{lang === "en" ? "AI can make mistakes. Check cited evidence. Nothing runs in the background; this chat lasts until you leave the page." : "AI 可能出错，请核对引用。不在后台自动运行；对话仅保留到离开当前页面。"}</p>
      </aside>
    </dialog>}
  </>;
}
