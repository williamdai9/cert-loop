"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import {
  ArrowLeft, BookOpen, CheckCircle2, CircleAlert, Cloud, Database,
  FileQuestion, LogOut, RefreshCw, Search, ShieldCheck,
  TestTube2, XCircle,
} from "lucide-react";
import type { CourseChapter } from "@/lib/course";
import type { Question } from "@/lib/certifications";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import styles from "./admin.module.css";

type AuditChapter = {
  chapter: number; title: { en: string; zh: string }; sections: number; explanationParagraphs: number;
  knowledgePoints: number; recallChecks: number; atlasModels: number; textbookFigures: number; noteFigures: number;
  mindMap: boolean; depthReady: boolean; figureAudit: "complete" | "pending";
};
type CloudLesson = { id: string; task_id: string; language: string; title: string; summary: string; content: unknown; source_refs: unknown; version: number; status: string; updated_at: string };
type CloudQuestion = { id: string; external_id: string; language: string; domain_id: string; cognition: string; prompt: string; options: unknown; answer_index: number; explanation: string; source_refs: unknown; version: number; status: string; updated_at: string };
type SourceRow = { id: string; title: string; url?: string; source_type: string; trust_level: number; published_at?: string; checked_at?: string; metadata: unknown };
type CoverageRow = { id: string; pdfPage: number | string; concept: string; sectionId: string; implementation: string; module: string };

type AdminPayload = {
  actor: { email: string };
  generatedAt: string;
  pack: {
    id: string; acronym: string; name: string; edition: string; description: string; sourceNote: string; verifiedOn: string;
    officialFacts: Array<{ value: string; labelEn: string; labelZh: string }>;
    officialSources: Array<{ label: string; url: string }>;
    exam: { sections: Array<{ name: string; total: number; scored: number; minutes: number }>; optionsPerQuestion: number };
    domains: Array<{ id: string; label: string; en: string; weight: number; questions: number; color: string }>;
    plan: Array<{ id: string; title: string; subtitle: string; chapters: string; domain: string; tasks: string[]; en?: { title: string; subtitle: string; tasks: string[] } }>;
    quickCards: Array<{ tag: string; front: string; back: string; en?: { front: string; back: string } }>;
  };
  chapters: CourseChapter[];
  questions: Question[];
  chapterOneVisualCoverage: CoverageRow[];
  audit: {
    chapters: AuditChapter[];
    questionDomains: Array<{ id: string; label: string; count: number }>;
    totals: { chapters: number; sections: number; explanationParagraphs: number; knowledgePoints: number; questions: number; atlasModels: number; textbookFigures: number; noteFigures: number; mindMaps: number; figureAuditsComplete: number };
  };
  cloud: {
    status: "healthy" | "attention" | "unavailable"; errors: string[];
    lessons: CloudLesson[]; questions: CloudQuestion[]; sources: SourceRow[];
  };
};

type Tab = "overview" | "curriculum" | "questions" | "cloud";
const tabs: Array<{ id: Tab; label: string; icon: typeof BookOpen }> = [
  { id:"overview", label:"Overview", icon:TestTube2 }, { id:"curriculum", label:"Curriculum", icon:BookOpen },
  { id:"questions", label:"Question bank", icon:FileQuestion },
  { id:"cloud", label:"Cloud database", icon:Database },
];

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [data, setData] = useState<AdminPayload | null>(null);
  const [status, setStatus] = useState<"checking" | "signed-out" | "loading" | "ready" | "denied" | "error">("checking");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const [chapterNumber, setChapterNumber] = useState(1);
  const [questionId, setQuestionId] = useState("");
  const [domain, setDomain] = useState("all");

  const load = useCallback(async (accessToken: string) => {
    setStatus("loading"); setMessage("");
    const response = await fetch("/api/admin/content", { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
    const payload = await response.json().catch(() => ({ error: "The content inspector returned an invalid response." }));
    if (response.status === 403) { setStatus("denied"); setMessage(payload.error); return; }
    if (!response.ok) { setStatus("error"); setMessage(payload.error || "Could not load the content inspector."); return; }
    setData(payload as AdminPayload); setStatus("ready");
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) { queueMicrotask(() => { setStatus("error"); setMessage("Supabase is not configured."); }); return; }
    supabase.auth.getSession().then(({ data: auth }) => {
      setSession(auth.session);
      if (auth.session) load(auth.session.access_token); else setStatus("signed-out");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (next) load(next.access_token); else { setData(null); setStatus("signed-out"); }
    });
    return () => listener.subscription.unsubscribe();
  }, [load]);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase || !email.trim() || !password) return;
    setStatus("loading");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setStatus("signed-out");
      setMessage(error.message.toLowerCase().includes("invalid login credentials") ? "Email or password is incorrect." : error.message);
    }
  }

  async function sendPasswordSetup() {
    const supabase = getSupabaseBrowser();
    if (!supabase || !email.trim()) { setMessage("Enter your email address first."); return; }
    setStatus("loading");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/certifications/nsca-cscs` });
    setStatus("signed-out");
    setMessage(error ? error.message : "Password setup link sent. Open it once, choose a password, then return here to sign in.");
  }

  async function signOut() {
    await getSupabaseBrowser()?.auth.signOut();
  }

  if (status === "checking" || status === "loading") return <AccessFrame><div className={styles.loading}><RefreshCw className={styles.spin} /><strong>{status === "checking" ? "Checking administrator access…" : "Loading the course inspector…"}</strong></div></AccessFrame>;
  if (status === "signed-out") return <AccessFrame><section className={styles.accessCard}><span className={styles.accessIcon}><ShieldCheck /></span><p className={styles.kicker}>CERT LOOP · COURSE INSPECTOR</p><h1>Read-only course inspector</h1><p>Sign in with the authorized owner email and password. Course lessons, answer keys, and deployed records never load before server-side authorization.</p><form onSubmit={signIn}><label>Email address<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="owner@example.com" autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label><button type="submit">Sign in</button><button type="button" className={styles.secondaryAction} onClick={sendPasswordSetup}>Forgot password or need to set one?</button></form>{message && <aside>{message}</aside>}<Link href="/"><ArrowLeft size={15}/> Back to learner site</Link></section></AccessFrame>;
  if (status === "denied" || status === "error" || !data) return <AccessFrame><section className={styles.accessCard}><span className={`${styles.accessIcon} ${styles.danger}`}><XCircle /></span><p className={styles.kicker}>{status === "denied" ? "ACCESS DENIED" : "INSPECTOR ERROR"}</p><h1>{status === "denied" ? "This account is not an administrator" : "The inspector needs attention"}</h1><p>{message}</p><button onClick={signOut}>Sign out and use another account</button><Link href="/"><ArrowLeft size={15}/> Back to learner site</Link></section></AccessFrame>;

  const activeChapter = data.chapters.find(chapter => chapter.n === chapterNumber) || data.chapters[0];
  const filteredQuestions = data.questions.filter(question => {
    const text = `${question.id} ${question.domain} ${question.en?.prompt || ""} ${question.prompt}`.toLowerCase();
    return (domain === "all" || question.domain === domain) && text.includes(query.toLowerCase());
  });
  const activeQuestion = data.questions.find(question => question.id === questionId) || filteredQuestions[0] || data.questions[0];
  return <div className={styles.shell}>
    <aside className={styles.sidebar}>
      <Link className={styles.brand} href="/"><span>CL</span><div><strong>CERT LOOP</strong><small>Content control</small></div></Link>
      <nav>{tabs.map(item => { const Icon = item.icon; return <button key={item.id} className={tab === item.id ? styles.active : ""} onClick={() => { setTab(item.id); setQuery(""); }}><Icon size={17}/><span>{item.label}</span></button>; })}</nav>
      <div className={styles.sidebarFoot}><span>READ-ONLY INSPECTOR</span><small>Course lessons, questions, and sources are available for inspection only.</small></div>
    </aside>

    <main className={styles.main}>
      <header className={styles.topbar}><div><p className={styles.kicker}>NSCA CERTIFIED STRENGTH AND CONDITIONING SPECIALIST®</p><h1>{tabs.find(item => item.id === tab)?.label}</h1></div><div className={styles.topActions}><span className={data.cloud.status === "healthy" ? styles.healthy : styles.warning}><Cloud size={14}/> {data.cloud.status}</span><button onClick={() => session && load(session.access_token)} aria-label="Refresh content"><RefreshCw size={16}/></button><button onClick={signOut} aria-label="Sign out"><LogOut size={16}/><span>Sign out</span></button></div></header>
      <div className={styles.content}>
        {tab === "overview" && <Overview data={data} />}
        {tab === "curriculum" && <Curriculum data={data} active={activeChapter} selected={chapterNumber} onSelect={setChapterNumber} query={query} setQuery={setQuery} />}
        {tab === "questions" && <Questions data={data} questions={filteredQuestions} active={activeQuestion} selected={questionId} onSelect={setQuestionId} query={query} setQuery={setQuery} domain={domain} setDomain={setDomain} />}
        {tab === "cloud" && <CloudDatabase data={data} />}
      </div>
    </main>
  </div>;
}

function AccessFrame({ children }: { children: React.ReactNode }) { return <main className={styles.accessFrame}><Link className={styles.accessBrand} href="/">CERT LOOP</Link>{children}</main>; }

function Overview({ data }: { data: AdminPayload }) {
  const totals = data.audit.totals;
  const checks = [
    { ok:totals.chapters === 26, label:"26 canonical chapters", note:`${totals.sections} deep-dive units · ${totals.explanationParagraphs} teaching paragraphs` },
    { ok:totals.questions >= 84, label:"Bilingual question bank", note:`${totals.questions} original three-option items` },
    { ok:data.chapterOneVisualCoverage.length === 19, label:"Chapter 1 figure-level audit", note:"17 figures + 2 tables mapped to learning modules" },
    { ok:data.audit.totals.figureAuditsComplete === 26, warn:true, label:"Textbook figure integration", note:`${data.audit.totals.figureAuditsComplete}/26 chapters integrated; the complete Fifth Edition figure/table inventory is audited for the remaining chapters` },
    { ok:data.cloud.status === "healthy", label:"Supabase content connection", note:data.cloud.errors.length ? data.cloud.errors.join(" · ") : `${data.cloud.lessons.length} lesson rows · ${data.cloud.questions.length} question rows` },
  ];
  return <>
    <section className={styles.hero}><div><p className={styles.kicker}>READ-ONLY COURSE INSPECTOR</p><h2>Inspect what learners actually receive.</h2><p>Canonical course data and deployed Supabase records are shown together for inspection. Nothing in this dashboard changes course content or publishing state.</p></div><aside><span>Generated</span><strong>{new Date(data.generatedAt).toLocaleString()}</strong><small>{data.actor.email}</small></aside></section>
    <section className={styles.metrics}>{[
      [totals.chapters,"chapters"],[totals.sections,"deep dives"],[totals.knowledgePoints,"knowledge points"],[totals.questions,"questions"],[totals.textbookFigures,"textbook figures"],[totals.noteFigures,"note figures"],[data.cloud.sources.length,"source rows"],
    ].map(([value,label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}</section>
    <section className={styles.panel}><PanelHead eyebrow="QUALITY GATES" title="Coverage and deployment checks"/><div className={styles.checkGrid}>{checks.map(check => <article className={check.ok ? styles.pass : check.warn ? styles.warn : styles.fail} key={check.label}>{check.ok ? <CheckCircle2/> : <CircleAlert/>}<div><strong>{check.label}</strong><p>{check.note}</p></div></article>)}</div></section>
    <section className={styles.panel}><PanelHead eyebrow="DOMAIN BALANCE" title="Question distribution"/><div className={styles.domainBars}>{data.audit.questionDomains.map(item => <div key={item.id}><span><b>{item.label}</b><em>{item.count}</em></span><i><b style={{width:`${item.count / Math.max(...data.audit.questionDomains.map(row => row.count)) * 100}%`}}/></i></div>)}</div></section>
    <section className={styles.panel}><PanelHead eyebrow="CHAPTER AUDIT MATRIX" title="Depth, visuals, and remaining figure work"/><div className={styles.auditTable}><div className={styles.tableHead}><span>Chapter</span><span>Depth</span><span>Text</span><span>Visuals</span><span>Figure audit</span></div>{data.audit.chapters.map(row => <div key={row.chapter}><span><b>{String(row.chapter).padStart(2,"0")}</b><em>{row.title.en}</em></span><span className={row.depthReady ? styles.goodText : styles.badText}>{row.depthReady ? "Ready" : "Shallow"}</span><span>{row.explanationParagraphs} ¶ · {row.knowledgePoints} points</span><span>{row.textbookFigures} textbook · {row.noteFigures} notes · {row.mindMap ? "ref map" : "no ref map"}</span><span className={row.figureAudit === "complete" ? styles.goodText : styles.pendingText}>{row.figureAudit}</span></div>)}</div></section>
  </>;
}

function Curriculum({ data, active, selected, onSelect, query, setQuery }: { data: AdminPayload; active: CourseChapter; selected: number; onSelect: (n:number)=>void; query:string; setQuery:(s:string)=>void }) {
  const chapters = data.chapters.filter(chapter => `${chapter.n} ${chapter.title.en} ${chapter.title.zh} ${chapter.domain.en}`.toLowerCase().includes(query.toLowerCase()));
  return <div className={styles.inspectorLayout}><aside className={styles.recordList}><SearchBox value={query} onChange={setQuery} placeholder="Search chapters…"/><div>{chapters.map(chapter => <button className={selected === chapter.n ? styles.selected : ""} key={chapter.n} onClick={() => onSelect(chapter.n)}><span>{String(chapter.n).padStart(2,"0")}</span><div><strong>{chapter.title.en}</strong><small>{chapter.title.zh}</small></div></button>)}</div></aside><article className={styles.inspector}>
    <header className={styles.chapterHero}><div><p className={styles.kicker}>CHAPTER {String(active.n).padStart(2,"0")} · {active.domain.en}</p><h2>{active.title.en}</h2><h3>{active.title.zh}</h3><p>{active.source}</p></div><aside><strong>{active.minutes}</strong><span>minutes</span><b>{active.sections.length} deep dives</b></aside></header>
    <section><PanelHead eyebrow="LEARNING OBJECTIVES" title="Expected outcomes"/><ol className={styles.bilingualList}>{active.objectives.map((item,index) => <li key={index}><span>{index+1}</span><div><strong>{item.en}</strong><small>{item.zh}</small></div></li>)}</ol></section>
    <section><PanelHead eyebrow="FULL LESSON" title="Every deep-dive unit"/>{active.sections.map((section,index) => <details className={styles.lessonDetail} open={index === 0} key={section.id}><summary><span>{String(index+1).padStart(2,"0")}</span><div><strong>{section.title.en}</strong><small>{section.title.zh}</small></div><em>{section.explanation.length} ¶ · {section.details.length} points</em></summary><div className={styles.lessonBody}>{section.explanation.map((paragraph,pi)=><p key={pi}>{paragraph}</p>)}<h4>Knowledge the learner must own</h4><ul>{section.details.map((detail,di)=><li key={di}>{detail}</li>)}</ul><div className={styles.decisionPair}><aside><span>COACHING DECISION</span><strong>{section.decision.en}</strong><small>{section.decision.zh}</small></aside><aside><span>EXAM CUE</span><strong>{section.examCue.en}</strong><small>{section.examCue.zh}</small></aside></div></div></details>)}</section>
    <section className={styles.twoCol}><div><PanelHead eyebrow="TERMINOLOGY" title={`${active.terms.length} required terms`}/>{active.terms.map(item => <details className={styles.compactDetail} key={item.term}><summary>{item.term}</summary><p>{item.meaning.en}</p><small>{item.meaning.zh}</small></details>)}</div><div><PanelHead eyebrow="FORMULAS" title={`${active.formulas.length} worked tools`}/>{active.formulas.length ? active.formulas.map(item => <details className={styles.compactDetail} key={item.name}><summary>{item.name}</summary><code>{item.expression}</code><p>{item.use.en}</p><small>{item.example}</small></details>) : <p className={styles.empty}>No formula block in this chapter.</p>}</div></section>
    <section><PanelHead eyebrow="EXAM READINESS" title="Checklist and recall"/><ul className={styles.checklist}>{active.examChecklist.map((item,index)=><li key={index}><CheckCircle2/><span><strong>{item.en}</strong><small>{item.zh}</small></span></li>)}</ul>{active.recall.map((item,index)=><details className={styles.recallDetail} key={index}><summary>Q{index+1} · {item.prompt.en}</summary><p>{item.answer.en}</p><small>{item.answer.zh}</small></details>)}</section>
  </article></div>;
}

function Questions({ data, questions, active, selected, onSelect, query, setQuery, domain, setDomain }: { data:AdminPayload; questions:Question[]; active:Question; selected:string; onSelect:(id:string)=>void; query:string; setQuery:(s:string)=>void; domain:string; setDomain:(s:string)=>void }) {
  const english = active.en || { prompt: active.prompt, options: active.options, explanation: active.explanation };
  return <div className={styles.inspectorLayout}><aside className={styles.recordList}><SearchBox value={query} onChange={setQuery} placeholder="Search prompts or IDs…"/><select value={domain} onChange={event=>setDomain(event.target.value)}><option value="all">All domains · {data.questions.length}</option>{data.pack.domains.map(item=><option key={item.id} value={item.id}>{item.en}</option>)}</select><div>{questions.map(question=><button className={(selected || active.id) === question.id ? styles.selected : ""} key={question.id} onClick={()=>onSelect(question.id)}><span>{question.id.toUpperCase()}</span><div><strong>{question.en?.prompt || question.prompt}</strong><small>{question.domain} · {question.cognition}</small></div></button>)}</div></aside><article className={styles.inspector}><header className={styles.questionHero}><p className={styles.kicker}>{active.id.toUpperCase()} · {active.domain} · {active.cognition}</p><h2>{english.prompt}</h2><h3>{active.prompt}</h3></header><section className={styles.answerOptions}>{english.options.map((option,index)=><article className={index === active.answer ? styles.correct : ""} key={option}><span>{String.fromCharCode(65+index)}</span><div><strong>{option}</strong><small>{active.options[index]}</small></div>{index === active.answer && <CheckCircle2/>}</article>)}</section><section className={styles.rationale}><span>ANSWER RATIONALE</span><p>{english.explanation}</p><small>{active.explanation}</small></section><section className={styles.metadata}><span><b>Source</b>{active.source}</span><span><b>Answer index</b>{active.answer}</span><span><b>Format</b>3 options</span></section></article></div>;
}

function CloudDatabase({ data }: { data:AdminPayload }) { return <><section className={styles.metrics}>{[[data.cloud.lessons.length,"lesson rows"],[data.cloud.questions.length,"question rows"],[data.cloud.sources.length,"source rows"]].map(([value,label])=><article key={label}><strong>{value}</strong><span>{label}</span></article>)}</section>{data.cloud.errors.length>0 && <section className={styles.errorPanel}>{data.cloud.errors.map(error=><p key={error}>{error}</p>)}</section>}<section className={styles.panel}><PanelHead eyebrow="SUPABASE LESSONS" title="Actual deployed lesson records"/><div className={styles.rawList}>{data.cloud.lessons.map(item=><details className={styles.rawDetail} key={item.id}><summary><span>{item.task_id}</span><strong>{item.language.toUpperCase()} · {item.title}</strong><em>{item.status} · v{item.version}</em></summary><p>{item.summary}</p><pre>{JSON.stringify(item.content,null,2)}</pre></details>)}</div></section><section className={styles.panel}><PanelHead eyebrow="SUPABASE QUESTIONS" title="Actual deployed question records"/><div className={styles.rawList}>{data.cloud.questions.map(item=><details className={styles.rawDetail} key={item.id}><summary><span>{item.external_id}</span><strong>{item.language.toUpperCase()} · {item.prompt}</strong><em>{item.status} · v{item.version}</em></summary><pre>{JSON.stringify(item,null,2)}</pre></details>)}</div></section><section className={styles.panel}><PanelHead eyebrow="SOURCE REGISTRY" title="Trust and recency"/><div className={styles.sourceList}>{data.cloud.sources.map(item=><article key={item.id}><span>{item.source_type} · trust {item.trust_level}/4</span><strong>{item.title}</strong><small>Checked {item.checked_at ? new Date(item.checked_at).toLocaleString() : "not recorded"}</small>{item.url && <a href={item.url} target="_blank" rel="noreferrer">Open source ↗</a>}</article>)}</div></section></>; }

function SearchBox({ value, onChange, placeholder }: { value:string; onChange:(value:string)=>void; placeholder:string }) { return <label className={styles.search}><Search size={16}/><input value={value} onChange={event=>onChange(event.target.value)} placeholder={placeholder}/>{value && <button onClick={()=>onChange("")} aria-label="Clear search"><XCircle size={15}/></button>}</label>; }
function PanelHead({ eyebrow, title }: { eyebrow:string; title:string }) { return <header className={styles.panelHead}><p className={styles.kicker}>{eyebrow}</p><h2>{title}</h2></header>; }
