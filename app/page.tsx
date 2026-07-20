"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, CalendarDays, Check, ChevronRight, CircleHelp, Clock3,
  Dumbbell, Flame, LayoutDashboard, Medal, RotateCcw, Settings2,
  Sparkles, Target, Trophy, X, Zap
} from "lucide-react";
import { certificationRegistry, type CertificationPack, type Question } from "@/lib/certifications";

type Tab = "dashboard" | "plan" | "test" | "mistakes" | "library";
type Lang = "zh" | "en";
type SavedState = {
  completed: string[];
  wrong: string[];
  mastered: string[];
  streak: number;
  xp: number;
  planLength: 8 | 12 | 16;
  weeklyHours: number;
  examDate: string;
  lastStudy: string;
  domainStats: Record<string, { correct: number; total: number }>;
};

const initial: SavedState = {
  completed: [], wrong: [], mastered: [], streak: 0, xp: 0,
  planLength: 12, weeklyHours: 8, examDate: "", lastStudy: "", domainStats: {},
};

const nav = [
  { id: "dashboard", zh: "今日", en: "Today", icon: LayoutDashboard },
  { id: "plan", zh: "计划", en: "Plan", icon: CalendarDays },
  { id: "test", zh: "测试", en: "Test", icon: CircleHelp },
  { id: "mistakes", zh: "错题", en: "Review", icon: RotateCcw },
  { id: "library", zh: "资料库", en: "Library", icon: BookOpen },
] as const;

const copy = {
  zh: { current:"当前认证", add:"新增认证只需接入内容包", countdown:"考试倒计时", days:"天", progress:"当前计划完成", local:"进度按认证独立保存在此设备", todayLoop:"今日学习循环", heroA:"读懂，做题，", heroB:"把错题练成反射。", heroP:"按官方考试权重推进，不平均用力。今天建议先完成一个知识块，再用 10 道题检验。", startPlan:"开始今日计划", directTest:"直接测试", planProgress:"计划进度", examIn:"距离考试", streak:"连续学习", misses:"待回炉错题", points:"学习积分", next:"今天做这三件事", about:"约", minutes:"分钟", pace:"调整你的节奏", examDate:"考试日期", cycle:"计划周期", weekly:"每周时间", sixDays:"建议每周 6 天，每次“学习 → 主动回忆 → 测试 → 错题回炉”。", weighting:"把时间花在分值上", adaptive:"自适应路线", weekPlan:"周学习计划", planDesc:"标准版以 12 周为骨架。8 周合并相邻模块；16 周插入四个间隔复习周。", build:"建构前 1/3", apply:"应用中 1/3", mock:"模拟后 1/3", complete:"完成", testHero:"用考试方式学习", testDesc:"严格采用三选一题型，覆盖记忆、应用与分析。练习模式即时讲解，模拟模式统一交卷。", done:"本轮完成", wrongSaved:"错题已经自动进入回炉队列。", practice:"练习模式", exam:"模拟模式", chooseSet:"选择题组", weighted:"官方权重", mixed:"七领域混合", science:"科学基础", practical:"实践应用", wrongLoop:"错题回炉", current:"当前", items:"题", roundSize:"本轮题数", start:"开始测试", again:"再来一轮", total:"总题数", scored:"计分", perQuestion:"每题选项数", best:"选最优答案", exit:"退出", nextQ:"下一题", submit:"交卷", immediate:"选择后立即查看解析", recorded:"答案会在交卷后统一记录", correct:"回答正确", correctAnswer:"正确答案", reviewTitle:"错题回炉", reviewDesc:"错题不是收藏夹。看完规则，遮住答案口述一次，再回测试中心重做。", startReview:"开始回炉", noWrong:"暂时没有错题", noWrongP:"完成一轮测试后，答错的题会自动出现在这里。", goTest:"去做题", remember:"记住：", mastered:"我已掌握", libraryTitle:"教材与高频记忆库", libraryDesc:"教材按考试领域重新索引；保留中英术语，方便适应原版题干。", search:"搜索章节或领域…", cards:"高频闪卡", flip:"点击翻面", seeAnswer:"点击查看答案", back:"点击返回问题", chapterMap:"教材章节地图", chapters:"章" },
  en: { current:"Current certification", add:"Add future certificates as content packs", countdown:"Exam countdown", days:"days", progress:"Plan complete", local:"Progress is stored separately for each certificate", todayLoop:"TODAY'S STUDY LOOP", heroA:"Learn it, test it,", heroB:"turn misses into reflexes.", heroP:"Follow the official exam weighting instead of studying every topic equally. Learn one block, then test it with ten questions.", startPlan:"Start today's plan", directTest:"Take a test", planProgress:"Plan progress", examIn:"Until exam", streak:"Study streak", misses:"Questions to review", points:"Study points", next:"Your next three actions", about:"About", minutes:"minutes", pace:"Set your pace", examDate:"Exam date", cycle:"Plan length", weekly:"Weekly time", sixDays:"Study six days per week using Learn → Recall → Test → Review.", weighting:"Put time where the points are", adaptive:"ADAPTIVE ROADMAP", weekPlan:"week study plan", planDesc:"The 12-week plan is the baseline. Eight weeks merges adjacent modules; 16 weeks inserts four spaced-review weeks.", build:"Build · first third", apply:"Apply · middle third", mock:"Simulate · final third", complete:"done", testHero:"Learn in exam format", testDesc:"Three-option items across recall, application, and analysis. Practice mode explains immediately; exam mode scores at submission.", done:"Round complete", wrongSaved:"Missed items were added to your review queue.", practice:"Practice", exam:"Exam mode", chooseSet:"Choose a question set", weighted:"Official weighting", mixed:"Seven-domain mix", science:"Scientific Foundations", practical:"Practical / Applied", wrongLoop:"Review misses", current:"Current", items:"items", roundSize:"Questions this round", start:"Start test", again:"Start another round", total:"total items", scored:"scored", perQuestion:"Options per item", best:"Choose the best answer", exit:"Exit", nextQ:"Next", submit:"Submit", immediate:"See the rationale after each answer", recorded:"Answers are recorded when you submit", correct:"Correct", correctAnswer:"Correct answer", reviewTitle:"Review queue", reviewDesc:"A missed question is not a bookmark. Read the rule, cover it, recall it aloud, then test it again.", startReview:"Start review", noWrong:"No missed questions yet", noWrongP:"Questions you miss in a test will appear here automatically.", goTest:"Take a test", remember:"Remember: ", mastered:"Mark mastered", libraryTitle:"Textbook and high-yield library", libraryDesc:"The textbook is indexed by exam domain, with Chinese and English terminology for original exam stems.", search:"Search chapters or domains…", cards:"High-yield flashcards", flip:"Click to flip", seeAnswer:"View answer", back:"Back to prompt", chapterMap:"Textbook chapter map", chapters:"chapters" },
} as const;

const cn = (...values: Array<string | false | undefined>) => values.filter(Boolean).join(" ");
const domainEnglish: Record<string, string> = { "运动科学":"Exercise Science", "运动心理学":"Sport Psychology", "营养":"Nutrition", "计划设计":"Program Design", "运动技术":"Exercise Technique", "计划实施":"Program Implementation", "组织与管理":"Organization & Administration", "运动科学 / 心理学":"Exercise Science / Sport Psychology", "实施 / 组织管理":"Implementation / Administration", "综合":"Integrated Review" };

type DisplayWeek = { key: string; title: string; subtitle: string; chapters: string; domain: string; tasks: Array<{ id: string; label: string }> };

function adaptivePlan(pack: CertificationPack, length: 8 | 12 | 16, lang: Lang): DisplayWeek[] {
  const standard = pack.plan.map(w => ({ key: w.id, title: lang === "en" && w.en ? w.en.title : w.title, subtitle: lang === "en" && w.en ? w.en.subtitle : w.subtitle, chapters: lang === "en" ? w.chapters.replace("第 ", "Ch. ").replace(/章/g, "") : w.chapters, domain: lang === "en" ? (domainEnglish[w.domain] || w.domain) : w.domain, tasks: (lang === "en" && w.en ? w.en.tasks : w.tasks).map((label, i) => ({ id: `${w.id}-${i}`, label })) }));
  if (length === 12) return standard;
  if (length === 8) {
    return [[0,1],[2,3],[4,5],[6,7],[8],[9],[10],[11]].map((indices, i) => {
      const blocks = indices.map(x => standard[x]);
      return { key: `sprint-${i}`, title: blocks.map(b => b.title).join(" + "), subtitle: indices.length > 1 ? (lang === "en" ? "Combined sprint week: add two short study blocks" : "冲刺合并周：建议增加两次短学习时段") : blocks[0].subtitle, chapters: blocks.map(b => b.chapters).join(" / "), domain: blocks.map(b => b.domain).join(" / "), tasks: blocks.flatMap(b => b.tasks) };
    });
  }
  const expanded: DisplayWeek[] = [];
  standard.forEach((week, i) => {
    expanded.push(week);
    if ((i + 1) % 3 === 0) {
      const q = (i + 1) / 3;
      expanded.push({ key: `review-${q}`, title: lang === "en" ? `Spaced review ${q}` : `间隔复习 ${q}`, subtitle: lang === "en" ? "Use active recall to consolidate the last phase" : "用主动回忆巩固上一阶段，避免知识衰减", chapters: lang === "en" ? `Weeks ${Math.max(1, i - 1)}–${i + 1}` : `第 ${Math.max(1, i - 1)}–${i + 1} 周内容`, domain: lang === "en" ? "Review and integration" : "复习与整合", tasks: (lang === "en" ? ["Write the phase framework from memory","Redo every miss from this phase","Complete one weighted mixed set","Add three weak points to flashcards"] : ["闭卷写出本阶段知识框架", "重做本阶段全部错题", "完成一套按权重混合题", "把三个薄弱点加入闪卡"]).map((label, ti) => ({ id: `review-${q}-${ti}`, label })) });
    }
  });
  return expanded;
}

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function shuffled<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const t = copy[lang];
  const [activeCertId, setActiveCertId] = useState(certificationRegistry[0].id);
  const pack = certificationRegistry.find(c => c.id === activeCertId) || certificationRegistry[0];
  const [tab, setTab] = useState<Tab>("dashboard");
  const [state, setState] = useState<SavedState>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("cert-loop-language-v2") as Lang | null;
    if (savedLang === "en" || savedLang === "zh") setLang(savedLang);
  }, []);

  useEffect(() => { localStorage.setItem("cert-loop-language-v2", lang); }, [lang]);

  useEffect(() => {
    setReady(false);
    const stored = localStorage.getItem(`cert-loop-state-${activeCertId}`);
    const fallbackDate = new Date();
    fallbackDate.setDate(fallbackDate.getDate() + 84);
    if (stored) {
      try { setState({ ...initial, ...JSON.parse(stored) }); }
      catch { setState({ ...initial, examDate: formatDate(fallbackDate) }); }
    } else setState({ ...initial, examDate: formatDate(fallbackDate) });
    setReady(true);
  }, [activeCertId]);

  useEffect(() => {
    if (ready) localStorage.setItem(`cert-loop-state-${activeCertId}`, JSON.stringify(state));
  }, [state, ready, activeCertId]);

  const studyDays = useMemo(() => {
    if (!state.examDate) return 84;
    return Math.max(0, Math.ceil((new Date(`${state.examDate}T12:00:00`).getTime() - Date.now()) / 86400000));
  }, [state.examDate]);
  const activePlan = adaptivePlan(pack, state.planLength, lang);
  const totalTasks = activePlan.reduce((sum, w) => sum + w.tasks.length, 0);
  const completedInPlan = activePlan.flatMap(w => w.tasks).filter(t => state.completed.includes(t.id)).length;
  const completion = Math.round((completedInPlan / totalTasks) * 100);

  function logStudy(xp = 15) {
    const today = formatDate(new Date());
    setState(s => ({ ...s, xp: s.xp + xp, streak: s.lastStudy === today ? s.streak : s.streak + 1, lastStudy: today }));
  }

  function toggleTask(id: string) {
    setState(s => {
      const done = s.completed.includes(id);
      return { ...s, completed: done ? s.completed.filter(x => x !== id) : [...s.completed, id], xp: done ? Math.max(0, s.xp - 10) : s.xp + 10 };
    });
  }

  function recordAnswer(q: Question, correct: boolean) {
    setState(s => {
      const stat = s.domainStats[q.domain] || { correct: 0, total: 0 };
      return {
        ...s,
        xp: s.xp + (correct ? 5 : 1),
        wrong: correct ? s.wrong.filter(id => id !== q.id) : Array.from(new Set([...s.wrong, q.id])),
        mastered: correct ? Array.from(new Set([...s.mastered, q.id])) : s.mastered.filter(id => id !== q.id),
        domainStats: { ...s.domainStats, [q.domain]: { correct: stat.correct + (correct ? 1 : 0), total: stat.total + 1 } },
      };
    });
    logStudy(0);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setTab("dashboard")} aria-label={lang === "en" ? "Back to Today" : "回到今日"}>
          <span className="brand-mark"><Dumbbell size={20} /></span>
          <span><b>CERT LOOP</b><small>{lang === "en" ? "Scalable certification learning" : "可扩展认证学习系统"}</small></span>
        </button>
        <label className="cert-switcher"><span>{t.current}</span><select value={activeCertId} onChange={e => setActiveCertId(e.target.value)}>{certificationRegistry.map(c => <option key={c.id} value={c.id}>{c.acronym} · {lang === "en" ? "5th Edition" : c.edition}</option>)}</select><small>{t.add}</small></label>
        <nav aria-label={lang === "en" ? "Main navigation" : "主要导航"}>
          {nav.map(item => <button key={item.id} className={cn("nav-item", tab === item.id && "active")} onClick={() => setTab(item.id)}><item.icon size={19} /><span>{item[lang]}</span>{item.id === "mistakes" && state.wrong.length > 0 && <em>{state.wrong.length}</em>}</button>)}
        </nav>
        <div className="sidebar-card">
          <span className="eyebrow">{t.countdown}</span>
          <strong>{studyDays}<small> {t.days}</small></strong>
          <div className="mini-progress"><i style={{ width: `${Math.min(100, completion)}%` }} /></div>
          <p>{t.progress} {completion}%</p>
        </div>
        <p className="source-note">{pack.sourceNote}<br />{t.local}</p>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <span className="eyebrow">{pack.name.toUpperCase()}</span>
            <h1>{nav.find(n => n.id === tab)?.[lang]}</h1>
          </div>
          <div className="top-actions"><div className="lang-toggle"><button className={lang === "zh" ? "active" : ""} onClick={() => setLang("zh")}>中</button><button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button></div><div className="top-stats"><span><Flame size={16} /> {state.streak} {t.days}</span><span><Zap size={16} /> {state.xp} XP</span></div></div>
        </header>

        {tab === "dashboard" && <Dashboard lang={lang} pack={pack} state={state} studyDays={studyDays} completion={completion} setState={setState} setTab={setTab} toggleTask={toggleTask} />}
        {tab === "plan" && <Plan lang={lang} pack={pack} state={state} setState={setState} toggleTask={toggleTask} />}
        {tab === "test" && <TestCenter lang={lang} pack={pack} wrong={state.wrong} recordAnswer={recordAnswer} />}
        {tab === "mistakes" && <Mistakes lang={lang} pack={pack} wrong={state.wrong} setTab={setTab} clearWrong={(id) => setState(s => ({ ...s, wrong: s.wrong.filter(x => x !== id) }))} />}
        {tab === "library" && <Library lang={lang} pack={pack} />}
      </section>

      <nav className="mobile-nav" aria-label={lang === "en" ? "Mobile navigation" : "移动导航"}>
        {nav.map(item => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}><item.icon size={19} /><span>{item[lang]}</span></button>)}
      </nav>
    </main>
  );
}

function Dashboard({ lang, pack, state, studyDays, completion, setState, setTab, toggleTask }: { lang: Lang; pack: CertificationPack; state: SavedState; studyDays: number; completion: number; setState: React.Dispatch<React.SetStateAction<SavedState>>; setTab: (t: Tab) => void; toggleTask: (id: string) => void }) {
  const t = copy[lang];
  const nextTasks = adaptivePlan(pack, state.planLength, lang).flatMap((week) => week.tasks.map(task => ({ id: task.id, task: task.label, week: week.title }))).filter(t => !state.completed.includes(t.id)).slice(0, 3);
  return <div className="page-content dashboard-grid">
    <section className="hero-panel">
      <div className="hero-copy">
        <span className="status-pill"><Sparkles size={14} /> {t.todayLoop}</span>
        <h2>{t.heroA}<br /><i>{t.heroB}</i></h2>
        <p>{t.heroP}</p>
        <div className="hero-actions"><button className="primary" onClick={() => setTab("plan")}>{t.startPlan} <ChevronRight size={17} /></button><button className="ghost" onClick={() => setTab("test")}>{t.directTest}</button></div>
      </div>
      <div className="score-orbit" style={{ "--value": `${completion * 3.6}deg` } as React.CSSProperties}><div><strong>{completion}%</strong><span>{t.planProgress}</span></div></div>
    </section>

    <section className="metric-row">
      <article><span className="metric-icon sage"><Target size={20} /></span><div><small>{t.examIn}</small><strong>{studyDays} {t.days}</strong></div></article>
      <article><span className="metric-icon gold"><Flame size={20} /></span><div><small>{t.streak}</small><strong>{state.streak} {t.days}</strong></div></article>
      <article><span className="metric-icon blue"><CircleHelp size={20} /></span><div><small>{t.misses}</small><strong>{state.wrong.length} {t.items}</strong></div></article>
      <article><span className="metric-icon plum"><Trophy size={20} /></span><div><small>{t.points}</small><strong>{state.xp} XP</strong></div></article>
    </section>

    <section className="card today-card">
      <div className="section-heading"><div><span className="eyebrow">NEXT UP</span><h3>{t.next}</h3></div><span className="duration"><Clock3 size={15} /> {t.about} {Math.max(45, Math.round(state.weeklyHours * 60 / 6))} {t.minutes}</span></div>
      <div className="task-list">{nextTasks.length ? nextTasks.map((task, i) => <button key={task.id} className="task-row" onClick={() => toggleTask(task.id)}><span className="task-check">{i + 1}</span><span><b>{task.task}</b><small>{task.week}</small></span><ChevronRight size={18} /></button>) : <div className="empty-mini"><Medal size={28} /><b>{lang === "en" ? "This cycle is complete" : "本轮任务已完成"}</b><span>{lang === "en" ? "Open the plan to begin another review cycle." : "去计划页开启下一轮复习。"}</span></div>}</div>
    </section>

    <section className="card setup-card">
      <div className="section-heading"><div><span className="eyebrow">YOUR PACE</span><h3>{t.pace}</h3></div><Settings2 size={19} /></div>
      <label>{t.examDate}<input type="date" value={state.examDate} onChange={e => setState(s => ({ ...s, examDate: e.target.value }))} /></label>
      <div className="two-fields"><label>{t.cycle}<select value={state.planLength} onChange={e => setState(s => ({ ...s, planLength: Number(e.target.value) as 8 | 12 | 16 }))}><option value="8">{lang === "en" ? "8-week sprint" : "8 周冲刺"}</option><option value="12">{lang === "en" ? "12-week standard" : "12 周标准"}</option><option value="16">{lang === "en" ? "16-week steady" : "16 周稳扎"}</option></select></label><label>{t.weekly}<select value={state.weeklyHours} onChange={e => setState(s => ({ ...s, weeklyHours: Number(e.target.value) }))}>{[5,8,12,16].map(h => <option key={h} value={h}>{h} {lang === "en" ? "hours" : "小时"}</option>)}</select></label></div>
      <p className="fine-print">{t.sixDays}</p>
    </section>

    <section className="card weight-card">
      <div className="section-heading"><div><span className="eyebrow">OFFICIAL WEIGHTING</span><h3>{t.weighting}</h3></div></div>
      <div className="weight-list">{pack.domains.map(d => <div key={d.id}><span><b>{lang === "en" ? d.en : d.label}</b><small>{lang === "en" ? (d.section === "科学基础" ? "Scientific Foundations" : "Practical / Applied") : d.section}</small></span><div><i style={{ width: `${d.weight}%`, background: d.color }} /></div><strong>{d.weight}%</strong></div>)}</div>
    </section>
  </div>;
}

function Plan({ lang, pack, state, setState, toggleTask }: { lang: Lang; pack: CertificationPack; state: SavedState; setState: React.Dispatch<React.SetStateAction<SavedState>>; toggleTask: (id: string) => void }) {
  const t = copy[lang];
  const displayPlan = adaptivePlan(pack, state.planLength, lang);
  return <div className="page-content">
    <section className="page-intro"><div><span className="eyebrow">{t.adaptive}</span><h2>{state.planLength}-{t.weekPlan}</h2><p>{t.planDesc}</p></div><div className="segmented">{([8,12,16] as const).map(n => <button key={n} className={state.planLength === n ? "active" : ""} onClick={() => setState(s => ({ ...s, planLength: n }))}>{n} {lang === "en" ? "wk" : "周"}</button>)}</div></section>
    <div className="phase-strip"><span><i /> {t.build}</span><span><i /> {t.apply}</span><span><i /> {t.mock}</span></div>
    <div className="weeks-grid">{displayPlan.map((week, wi) => {
      const done = week.tasks.filter(t => state.completed.includes(t.id)).length;
      return <article className={cn("week-card", done === week.tasks.length && "complete")} key={week.key}>
        <div className="week-number"><span>{String(wi + 1).padStart(2, "0")}</span><small>WEEK</small></div>
        <div className="week-body"><span className="domain-label">{week.domain} · {week.chapters}</span><h3>{week.title}</h3><p>{week.subtitle}</p><div className="week-tasks">{week.tasks.map(task => { const checked = state.completed.includes(task.id); return <button className={checked ? "checked" : ""} onClick={() => toggleTask(task.id)} key={task.id}><span>{checked && <Check size={13} />}</span>{task.label}</button>; })}</div></div>
        <div className="week-progress"><b>{done}/{week.tasks.length}</b><span>{t.complete}</span></div>
      </article>;
    })}</div>
  </div>;
}

function TestCenter({ lang, pack, wrong, recordAnswer }: { lang: Lang; pack: CertificationPack; wrong: string[]; recordAnswer: (q: Question, correct: boolean) => void }) {
  const t = copy[lang];
  const [session, setSession] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [preset, setPreset] = useState("weighted");
  const [count, setCount] = useState(10);
  const [finished, setFinished] = useState(false);

  const current = session[index];
  const score = session.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);

  function start() {
    let pool = pack.questions;
    if (preset === "science") pool = pack.questions.filter(q => q.section === "科学基础");
    if (preset === "practical") pool = pack.questions.filter(q => q.section === "实践应用");
    if (preset === "wrong") pool = pack.questions.filter(q => wrong.includes(q.id));
    const chosen = shuffled(pool).slice(0, Math.min(count, pool.length));
    setSession(chosen); setIndex(0); setSelected(null); setAnswers([]); setFinished(false);
  }

  function choose(i: number) {
    if (mode === "practice" && selected !== null) return;
    setSelected(i);
    setAnswers(a => { const next = [...a]; next[index] = i; return next; });
    if (mode === "practice" && current) recordAnswer(current, i === current.answer);
  }

  function next() {
    if (index === session.length - 1) {
      if (mode === "exam") session.forEach((q, i) => recordAnswer(q, answers[i] === q.answer));
      setFinished(true);
    } else { setIndex(i => i + 1); setSelected(answers[index + 1] ?? null); }
  }

  if (!session.length || finished) return <div className="page-content test-layout">
    <section className="test-hero"><span className="eyebrow">THREE-OPTION FORMAT</span><h2>{finished ? t.done : t.testHero}</h2><p>{finished ? (lang === "en" ? `You answered ${score} of ${session.length} correctly. ${t.wrongSaved}` : `你答对 ${score} / ${session.length} 题。${t.wrongSaved}`) : t.testDesc}</p>{finished && <div className="result-score"><strong>{Math.round(score / session.length * 100)}%</strong><span>{score / session.length >= .8 ? (lang === "en" ? "Strong result. Keep the rhythm." : "状态很好，继续保持。") : (lang === "en" ? "Review misses before the next round." : "先回炉错题，再开新一轮。")}</span></div>}</section>
    <section className="card test-setup">
      <div className="mode-tabs"><button className={mode === "practice" ? "active" : ""} onClick={() => setMode("practice")}>{t.practice}</button><button className={mode === "exam" ? "active" : ""} onClick={() => setMode("exam")}>{t.exam}</button></div>
      <h3>{t.chooseSet}</h3>
      <div className="preset-grid">
        {[{id:"weighted",label:t.weighted,sub:t.mixed},{id:"science",label:t.science,sub:`95 ${t.items} / 90 min`},{id:"practical",label:t.practical,sub:`125 ${t.items} / 150 min`},{id:"wrong",label:t.wrongLoop,sub:`${t.current} ${wrong.length} ${t.items}`}].map(p => <button key={p.id} disabled={p.id === "wrong" && !wrong.length} className={preset === p.id ? "active" : ""} onClick={() => setPreset(p.id)}><b>{p.label}</b><span>{p.sub}</span></button>)}
      </div>
      <label className="range-label"><span>{t.roundSize} <b>{count}</b></span><input type="range" min="5" max="30" step="5" value={count} onChange={e => setCount(Number(e.target.value))} /></label>
      <button className="primary wide" onClick={start}>{finished ? t.again : t.start} <ChevronRight size={17} /></button>
    </section>
    <section className="exam-facts">{pack.exam.sections.map(s => <article key={s.name}><strong>{s.total}</strong><span>{lang === "en" ? (s.name === "科学基础" ? "Scientific Foundations" : "Practical / Applied") : s.name} {t.total}<br />{s.scored} {t.scored} · {s.minutes} min</span></article>)}<article><strong>{pack.exam.optionsPerQuestion}</strong><span>{t.perQuestion}<br />{t.best}</span></article></section>
  </div>;

  const reveal = mode === "practice" && selected !== null;
  return <div className="page-content question-page">
    <div className="question-top"><button className="text-button" onClick={() => setSession([])}><X size={16} /> {t.exit}</button><div className="test-progress"><i style={{ width: `${((index + 1) / session.length) * 100}%` }} /></div><span>{index + 1} / {session.length}</span></div>
    <section className="question-card">
      <div className="question-meta"><span>{lang === "en" ? pack.domains.find(d => d.id === current.domain)?.en : pack.domains.find(d => d.id === current.domain)?.label}</span><span>{lang === "en" ? ({"记忆":"Recall","应用":"Application","分析":"Analysis"} as const)[current.cognition] : current.cognition}</span><span>{lang === "en" ? current.source.replace("第 ","Ch. ").replace("章","") : current.source}</span></div>
      <h2>{lang === "en" && current.en ? current.en.prompt : current.prompt}</h2>
      <div className="options">{(lang === "en" && current.en ? current.en.options : current.options).map((option, i) => <button key={option} onClick={() => choose(i)} className={cn(selected === i && "selected", reveal && i === current.answer && "correct", reveal && selected === i && i !== current.answer && "wrong")}><span>{String.fromCharCode(65 + i)}</span><b>{option}</b>{reveal && i === current.answer && <Check size={19} />}{reveal && selected === i && i !== current.answer && <X size={19} />}</button>)}</div>
      {reveal && <div className={cn("explanation", selected === current.answer ? "good" : "bad")}><strong>{selected === current.answer ? t.correct : `${t.correctAnswer}: ${String.fromCharCode(65 + current.answer)}`}</strong><p>{lang === "en" && current.en ? current.en.explanation : current.explanation}</p></div>}
      <div className="question-footer"><span>{mode === "exam" ? t.recorded : t.immediate}</span><button className="primary" disabled={selected === null} onClick={next}>{index === session.length - 1 ? t.submit : t.nextQ} <ChevronRight size={17} /></button></div>
    </section>
  </div>;
}

function Mistakes({ lang, pack, wrong, setTab, clearWrong }: { lang: Lang; pack: CertificationPack; wrong: string[]; setTab: (t: Tab) => void; clearWrong: (id: string) => void }) {
  const t = copy[lang];
  const items = pack.questions.filter(q => wrong.includes(q.id));
  return <div className="page-content"><section className="page-intro"><div><span className="eyebrow">SPACED RETRIEVAL</span><h2>{t.reviewTitle}</h2><p>{t.reviewDesc}</p></div><button className="primary" disabled={!items.length} onClick={() => setTab("test")}>{t.startReview} <RotateCcw size={16} /></button></section>
    {!items.length ? <section className="empty-state"><Medal size={42} /><h3>{t.noWrong}</h3><p>{t.noWrongP}</p><button className="ghost" onClick={() => setTab("test")}>{t.goTest}</button></section> : <div className="mistake-grid">{items.map(q => <article className="mistake-card" key={q.id}><div><span>{lang === "en" ? pack.domains.find(d => d.id === q.domain)?.en : pack.domains.find(d => d.id === q.domain)?.label}</span><small>{lang === "en" ? ({"记忆":"Recall","应用":"Application","分析":"Analysis"} as const)[q.cognition] : q.cognition}</small></div><h3>{lang === "en" && q.en ? q.en.prompt : q.prompt}</h3><p><b>{t.remember}</b>{lang === "en" && q.en ? q.en.explanation : q.explanation}</p><button onClick={() => clearWrong(q.id)}>{t.mastered} <Check size={15} /></button></article>)}</div>}
  </div>;
}

function Library({ lang, pack }: { lang: Lang; pack: CertificationPack }) {
  const t = copy[lang];
  const [query, setQuery] = useState("");
  const [flipped, setFlipped] = useState<number[]>([]);
  const filtered = pack.chapters.filter(c => `${c.n}${c.title}${c.en}${c.domain}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="page-content"><section className="page-intro"><div><span className="eyebrow">FIFTH EDITION MAP · ENGLISH SOURCE OF TRUTH</span><h2>{t.libraryTitle}</h2><p>{t.libraryDesc}</p></div><input className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search} /></section>
    <section className="official-panel"><div className="section-heading"><div><span className="eyebrow">OFFICIAL NSCA CHECK · VERIFIED {pack.verifiedOn}</span><h3>{lang === "en" ? "Current exam facts" : "当前官方考试信息"}</h3></div><div className="official-links">{pack.officialSources.map(s => <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>)}</div></div><div className="official-facts">{pack.officialFacts.map(f => <div key={f.value}><strong>{f.value}</strong><span>{lang === "en" ? f.labelEn : f.labelZh}</span></div>)}</div><p>{lang === "en" ? "Eligibility changes are scheduled for U.S. candidates beginning January 1, 2030. Always recheck the official page before registering." : "美国考生资格要求计划自 2030 年 1 月 1 日起调整。报名前请再次核对官网。"}</p></section>
    <section className="library-section"><div className="section-heading"><div><span className="eyebrow">ACTIVE RECALL</span><h3>{t.cards}</h3></div><span className="duration">{t.flip}</span></div><div className="flash-grid">{pack.quickCards.map((card, i) => <button key={card.front} className={cn("flash-card", flipped.includes(i) && "flipped")} onClick={() => setFlipped(f => f.includes(i) ? f.filter(x => x !== i) : [...f, i])}><span>{card.tag}</span><strong>{flipped.includes(i) ? (lang === "en" && card.en ? card.en.back : card.back) : (lang === "en" && card.en ? card.en.front : card.front)}</strong><small>{flipped.includes(i) ? t.back : t.seeAnswer}</small></button>)}</div></section>
    <section className="library-section"><div className="section-heading"><div><span className="eyebrow">CHAPTER INDEX</span><h3>{t.chapterMap}</h3></div><span className="duration">26 {t.chapters}</span></div><div className="chapter-table">{filtered.map(c => <div key={c.n}><span>{String(c.n).padStart(2,"0")}</span><p><b>{lang === "en" ? c.en : c.title}</b><small>{lang === "en" ? c.title : c.en}</small></p><em>{lang === "en" ? (pack.domains.find(d => d.label === c.domain)?.en || c.domain) : c.domain}</em></div>)}</div></section>
    <p className="disclaimer">{lang === "en" ? "Original study summaries based on the English fifth-edition textbook and official DCO. English source material controls if a translation differs. This site does not replace NSCA materials or policy." : "内容以英文第五版教材和英文官方大纲为唯一基准，中文仅为辅助翻译；若有歧义，以英文原文为准。本网站不替代 NSCA 官方教材、课程或考试政策。"}</p>
  </div>;
}
