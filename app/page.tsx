"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, BookMarked, BookOpen, Brain, CalendarDays, Check,
  ChevronRight, CircleHelp, Cloud, CloudOff, Clock3, Dumbbell,
  Compass, Flame, LayoutDashboard, LockKeyhole, LogIn, LogOut,
  Medal, Play, RotateCcw, Settings2, Sparkles, Target, Trophy,
  UserRound, X, Zap
} from "lucide-react";
import { certificationRegistry, type CertificationPack, type Question } from "@/lib/certifications";
import type { BilingualText, LessonContent } from "@/lib/lesson-data";
import { cscsCourse, type CourseChapter, type CourseText } from "@/lib/course";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase-browser";
import { ChapterVisualLab } from "@/app/components/chapter-visual-lab";
import { MindMapRecap, SectionNoteFigures, TextbookVisualAtlas } from "@/app/components/course-media";
import { AITutor } from "@/app/components/ai-tutor";
import { ResearchPulse } from "@/app/components/research-pulse";

type Tab = "dashboard" | "plan" | "test" | "mistakes" | "library";
type Lang = "zh" | "en";
type ActiveLesson = {
  id: string;
  label: string;
  weekTitle: string;
  weekSubtitle: string;
  chapters: string;
  domain: string;
  chapterNumbers: number[];
  focusChapter: number;
};
type DiagnosticResult = { completedAt: string; score: number; total: number; domains: Record<string, { correct: number; total: number }> };
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
  diagnostic?: DiagnosticResult;
  tourCompleted?: boolean;
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
  zh: { currentCert:"当前认证", add:"新增认证只需接入内容包", countdown:"考试倒计时", days:"天", progress:"当前计划完成", local:"进度按认证独立保存在此设备", todayLoop:"今日学习循环", heroA:"读懂，做题，", heroB:"把错题练成反射。", heroP:"按官方考试权重推进，不平均用力。今天建议先完成一个知识块，再用 10 道题检验。", startPlan:"开始今日计划", directTest:"直接测试", planProgress:"计划进度", examIn:"距离考试", streak:"连续学习", misses:"待回炉错题", points:"学习积分", next:"今天做这三件事", about:"约", minutes:"分钟", pace:"调整你的节奏", examDate:"考试日期", cycle:"计划周期", weekly:"每周时间", sixDays:"建议每周 6 天，每次“学习 → 主动回忆 → 测试 → 错题回炉”。", weighting:"把时间花在分值上", adaptive:"自适应路线", weekPlan:"周学习计划", planDesc:"标准版以 12 周为骨架。8 周合并相邻模块；16 周插入四个间隔复习周。", build:"建构前 1/3", apply:"应用中 1/3", mock:"模拟后 1/3", complete:"完成", testHero:"用考试方式学习", testDesc:"严格采用三选一题型，覆盖记忆、应用与分析。练习模式即时讲解，模拟模式统一交卷。", done:"本轮完成", wrongSaved:"错题已经自动进入回炉队列。", practice:"练习模式", exam:"模拟模式", chooseSet:"选择题组", weighted:"官方权重", mixed:"七领域混合", science:"科学基础", practical:"实践应用", wrongLoop:"错题回炉", currentCount:"当前", items:"题", roundSize:"本轮题数", start:"开始测试", again:"再来一轮", total:"总题数", scored:"计分", perQuestion:"每题选项数", best:"选最优答案", exit:"退出", nextQ:"下一题", submit:"交卷", immediate:"选择后立即查看解析", recorded:"答案会在交卷后统一记录", correct:"回答正确", correctAnswer:"正确答案", reviewTitle:"错题回炉", reviewDesc:"错题不是收藏夹。看完规则，遮住答案口述一次，再回测试中心重做。", startReview:"开始回炉", noWrong:"暂时没有错题", noWrongP:"完成一轮测试后，答错的题会自动出现在这里。", goTest:"去做题", remember:"记住：", mastered:"我已掌握", libraryTitle:"教材与高频记忆库", libraryDesc:"教材按考试领域重新索引；保留中英术语，方便适应原版题干。", search:"搜索章节或领域…", cards:"高频闪卡", flip:"点击翻面", seeAnswer:"点击查看答案", back:"点击返回问题", chapterMap:"教材章节地图", chapters:"章" },
  en: { currentCert:"Current certification", add:"Add future certificates as content packs", countdown:"Exam countdown", days:"days", progress:"Plan complete", local:"Progress is stored separately for each certificate", todayLoop:"TODAY'S STUDY LOOP", heroA:"Learn it, test it,", heroB:"turn misses into reflexes.", heroP:"Follow the official exam weighting instead of studying every topic equally. Learn one block, then test it with ten questions.", startPlan:"Start today's plan", directTest:"Take a test", planProgress:"Plan progress", examIn:"Until exam", streak:"Study streak", misses:"Questions to review", points:"Study points", next:"Your next three actions", about:"About", minutes:"minutes", pace:"Set your pace", examDate:"Exam date", cycle:"Plan length", weekly:"Weekly time", sixDays:"Study six days per week using Learn → Recall → Test → Review.", weighting:"Put time where the points are", adaptive:"ADAPTIVE ROADMAP", weekPlan:"week study plan", planDesc:"The 12-week plan is the baseline. Eight weeks merges adjacent modules; 16 weeks inserts four spaced-review weeks.", build:"Build · first third", apply:"Apply · middle third", mock:"Simulate · final third", complete:"done", testHero:"Learn in exam format", testDesc:"Three-option items across recall, application, and analysis. Practice mode explains immediately; exam mode scores at submission.", done:"Round complete", wrongSaved:"Missed items were added to your review queue.", practice:"Practice", exam:"Exam mode", chooseSet:"Choose a question set", weighted:"Official weighting", mixed:"Seven-domain mix", science:"Scientific Foundations", practical:"Practical / Applied", wrongLoop:"Review misses", currentCount:"Current", items:"items", roundSize:"Questions this round", start:"Start test", again:"Start another round", total:"total items", scored:"scored", perQuestion:"Options per item", best:"Choose the best answer", exit:"Exit", nextQ:"Next", submit:"Submit", immediate:"See the rationale after each answer", recorded:"Answers are recorded when you submit", correct:"Correct", correctAnswer:"Correct answer", reviewTitle:"Review queue", reviewDesc:"A missed question is not a bookmark. Read the rule, cover it, recall it aloud, then test it again.", startReview:"Start review", noWrong:"No missed questions yet", noWrongP:"Questions you miss in a test will appear here automatically.", goTest:"Take a test", remember:"Remember: ", mastered:"Mark mastered", libraryTitle:"Textbook and high-yield library", libraryDesc:"The textbook is indexed by exam domain, with Chinese and English terminology for original exam stems.", search:"Search chapters or domains…", cards:"High-yield flashcards", flip:"Click to flip", seeAnswer:"View answer", back:"Back to prompt", chapterMap:"Textbook chapter map", chapters:"chapters" },
} as const;

const cn = (...values: Array<string | false | undefined>) => values.filter(Boolean).join(" ");
const domainEnglish: Record<string, string> = { "运动科学":"Exercise Science", "运动心理学":"Sport Psychology", "营养":"Nutrition", "计划设计":"Program Design", "运动技术":"Exercise Technique", "计划实施":"Program Implementation", "组织与管理":"Organization & Administration", "运动科学 / 心理学":"Exercise Science / Sport Psychology", "实施 / 组织管理":"Implementation / Administration", "综合":"Integrated Review" };

type DisplayWeek = { key: string; title: string; subtitle: string; chapters: string; chapterNumbers: number[]; domain: string; tasks: Array<{ id: string; label: string }> };

function chapterNumbersFromLabel(label: string) {
  if (/全书|high.frequency|whole book/i.test(label)) return Array.from({ length: 26 }, (_, index) => index + 1);
  const values = (label.match(/\d+/g) || []).map(Number);
  if (values.length === 2 && /[–—-]/.test(label)) return Array.from({ length: values[1] - values[0] + 1 }, (_, index) => values[0] + index);
  return values.length ? values : Array.from({ length: 26 }, (_, index) => index + 1);
}

function adaptivePlan(pack: CertificationPack, length: 8 | 12 | 16, lang: Lang): DisplayWeek[] {
  const standard = pack.plan.map(w => ({ key: w.id, title: lang === "en" && w.en ? w.en.title : w.title, subtitle: lang === "en" && w.en ? w.en.subtitle : w.subtitle, chapters: lang === "en" ? w.chapters.replace("第 ", "Ch. ").replace(/章/g, "") : w.chapters, chapterNumbers: chapterNumbersFromLabel(w.chapters), domain: lang === "en" ? (domainEnglish[w.domain] || w.domain) : w.domain, tasks: (lang === "en" && w.en ? w.en.tasks : w.tasks).map((label, i) => ({ id: `${w.id}-${i}`, label })) }));
  if (length === 12) return standard;
  if (length === 8) {
    return [[0,1],[2,3],[4,5],[6,7],[8],[9],[10],[11]].map((indices, i) => {
      const blocks = indices.map(x => standard[x]);
      return { key: `sprint-${i}`, title: blocks.map(b => b.title).join(" + "), subtitle: indices.length > 1 ? (lang === "en" ? "Combined sprint week: add two short study blocks" : "冲刺合并周：建议增加两次短学习时段") : blocks[0].subtitle, chapters: blocks.map(b => b.chapters).join(" / "), chapterNumbers: Array.from(new Set(blocks.flatMap(b => b.chapterNumbers))), domain: blocks.map(b => b.domain).join(" / "), tasks: blocks.flatMap(b => b.tasks) };
    });
  }
  const expanded: DisplayWeek[] = [];
  standard.forEach((week, i) => {
    expanded.push(week);
    if ((i + 1) % 3 === 0) {
      const q = (i + 1) / 3;
      expanded.push({ key: `review-${q}`, title: lang === "en" ? `Spaced review ${q}` : `间隔复习 ${q}`, subtitle: lang === "en" ? "Use active recall to consolidate the last phase" : "用主动回忆巩固上一阶段，避免知识衰减", chapters: lang === "en" ? `Weeks ${Math.max(1, i - 1)}–${i + 1}` : `第 ${Math.max(1, i - 1)}–${i + 1} 周内容`, chapterNumbers: standard.slice(Math.max(0, i - 2), i + 1).flatMap(item => item.chapterNumbers), domain: lang === "en" ? "Review and integration" : "复习与整合", tasks: (lang === "en" ? ["Write the phase framework from memory","Redo every miss from this phase","Complete one weighted mixed set","Add three weak points to flashcards"] : ["闭卷写出本阶段知识框架", "重做本阶段全部错题", "完成一套按权重混合题", "把三个薄弱点加入闪卡"]).map((label, ti) => ({ id: `review-${q}-${ti}`, label })) });
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
  const registeredPack = certificationRegistry.find(c => c.id === activeCertId) || certificationRegistry[0];
  const [tab, setTab] = useState<Tab>("dashboard");
  const [state, setState] = useState<SavedState>(initial);
  const [ready, setReady] = useState(false);
  const [activeLesson, setActiveLesson] = useState<ActiveLesson | null>(null);
  const [activeChapter, setActiveChapter] = useState<CourseChapter | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"local" | "loading" | "synced" | "error">("local");
  const [courseChapters, setCourseChapters] = useState<CourseChapter[]>(cscsCourse);
  const [cloudQuestions, setCloudQuestions] = useState<Question[]>([]);
  const pack = useMemo(() => cloudQuestions.length ? { ...registeredPack, questions: cloudQuestions } : registeredPack, [cloudQuestions, registeredPack]);
  const cloudEnabled = isSupabaseConfigured();

  useEffect(() => {
    const savedLang = localStorage.getItem("cert-loop-language-v2") as Lang | null;
    if (savedLang === "en" || savedLang === "zh") queueMicrotask(() => setLang(savedLang));
  }, []);

  useEffect(() => { localStorage.setItem("cert-loop-language-v2", lang); }, [lang]);

  useEffect(() => {
    queueMicrotask(() => {
      setReady(false);
      const stored = localStorage.getItem(`cert-loop-state-${activeCertId}`);
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 84);
      if (stored) {
        try { setState({ ...initial, ...JSON.parse(stored) }); }
        catch { setState({ ...initial, examDate: formatDate(fallbackDate) }); }
      } else setState({ ...initial, examDate: formatDate(fallbackDate) });
      setReady(true);
    });
  }, [activeCertId]);

  useEffect(() => {
    if (ready) localStorage.setItem(`cert-loop-state-${activeCertId}`, JSON.stringify(state));
  }, [state, ready, activeCertId]);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) { queueMicrotask(() => { setAuthReady(true); setProgressLoaded(true); }); return; }
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email || "Learner" } : null);
      setAuthReady(true);
      if (!sessionUser) setProgressLoaded(true);
    }).catch(() => { setAuthReady(true); setProgressLoaded(true); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email || "Learner" } : null);
      setAuthReady(true);
      if (!sessionUser) {
        setProgressLoaded(true);
        setSyncStatus("local");
        setCloudQuestions([]);
        setActiveLesson(null);
        setActiveChapter(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase || !user || !state.diagnostic) return;
    let cancelled = false;
    supabase.from("lessons")
      .select("task_id,content")
      .eq("certification_id", activeCertId)
      .eq("language", "en")
      .eq("status", "published")
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const chapters = data.filter(row => row.task_id.startsWith("course-chapter-")).map(row => row.content as CourseChapter).sort((a, b) => a.n - b.n);
        if (chapters.length === 26) setCourseChapters(chapters);
      });
    supabase.from("questions")
      .select("external_id,language,domain_id,cognition,prompt,options,answer_index,explanation,source_refs")
      .eq("certification_id", activeCertId)
      .eq("status", "published")
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const rows = data as Array<{ external_id: string; language: "en" | "zh"; domain_id: Question["domain"]; cognition: Question["cognition"]; prompt: string; options: [string,string,string]; answer_index: number; explanation: string; source_refs?: Array<{ source?: string }> }>;
        const byId = new Map<string, Partial<Record<"en" | "zh", (typeof rows)[number]>>>();
        rows.forEach(row => byId.set(row.external_id, { ...(byId.get(row.external_id) || {}), [row.language]: row }));
        const hydrated = Array.from(byId.entries()).flatMap(([id, pair]) => {
          if (!pair.en || !pair.zh || pair.en.options.length !== 3 || pair.zh.options.length !== 3) return [];
          return [{ id, section: (["exercise-science","sport-psychology","nutrition"] as string[]).includes(pair.en.domain_id) ? "科学基础" as const : "实践应用" as const, domain: pair.en.domain_id, cognition: pair.en.cognition, prompt: pair.zh.prompt, options: pair.zh.options, answer: pair.en.answer_index, explanation: pair.zh.explanation, source: pair.en.source_refs?.[0]?.source || "English 5th ed. aligned", en: { prompt: pair.en.prompt, options: pair.en.options, explanation: pair.en.explanation } }];
        }).sort((a, b) => a.id.localeCompare(b.id));
        if (hydrated.length >= 84) setCloudQuestions(hydrated);
      });
    return () => { cancelled = true; };
  }, [activeCertId, user, state.diagnostic]);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase || !user) return;
    let cancelled = false;
    queueMicrotask(() => { setSyncStatus("loading"); setProgressLoaded(false); });
    supabase.from("user_progress").select("state").eq("user_id", user.id).eq("certification_id", activeCertId).maybeSingle().then(({ data, error }) => {
      if (cancelled) return;
      if (error) { setSyncStatus("error"); setProgressLoaded(true); return; }
      if (data?.state) setState({ ...initial, ...(data.state as SavedState) });
      setSyncStatus("synced");
      setProgressLoaded(true);
    });
    return () => { cancelled = true; };
  }, [user, activeCertId]);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase || !user || !ready || !progressLoaded || syncStatus === "loading") return;
    const timer = window.setTimeout(async () => {
      const { error } = await supabase.from("user_progress").upsert({
        user_id: user.id,
        certification_id: activeCertId,
        state,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,certification_id" });
      setSyncStatus(error ? "error" : "synced");
    }, 650);
    return () => window.clearTimeout(timer);
  }, [state, user, activeCertId, ready, progressLoaded, syncStatus]);

  const studyDays = useMemo(() => {
    if (!state.examDate) return 84;
    // Exam countdown is intentionally evaluated when the saved exam date changes.
    // eslint-disable-next-line react-hooks/purity
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

  function saveDiagnostic(result: DiagnosticResult) {
    setState(current => ({ ...current, diagnostic: result, domainStats: result.domains }));
  }

  const activePlanChapter = activeLesson ? courseChapters.find(chapter => chapter.n === activeLesson.focusChapter) || courseChapters[0] : null;
  const tutorContext = activeLesson ? { chapterNumber: activeLesson.focusChapter, chapterTitle: activePlanChapter?.title.en, taskId: activeLesson.id, taskTitle: activeLesson.label } : activeChapter ? { chapterNumber: activeChapter.n, chapterTitle: activeChapter.title.en } : undefined;

  if (!ready || !authReady || (user && !progressLoaded)) return <LoadingGate lang={lang} />;

  if (!user) return <>
    <PublicPreview lang={lang} setLang={setLang} configured={cloudEnabled} onSignIn={() => setAuthOpen(true)} />
    {authOpen && <AuthPanel lang={lang} user={null} configured={cloudEnabled} syncStatus="local" onClose={() => setAuthOpen(false)} />}
  </>;

  if (!state.diagnostic) return <>
    <PlacementTest lang={lang} pack={pack} userEmail={user.email} onSignOut={() => setAuthOpen(true)} onComplete={saveDiagnostic} />
    {authOpen && <AuthPanel lang={lang} user={user} configured={cloudEnabled} syncStatus={syncStatus} onClose={() => setAuthOpen(false)} />}
  </>;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setTab("dashboard")} aria-label={lang === "en" ? "Back to Today" : "回到今日"}>
          <span className="brand-mark"><Dumbbell size={20} /></span>
          <span><b>CERT LOOP</b><small>{lang === "en" ? "Scalable certification learning" : "可扩展认证学习系统"}</small></span>
        </button>
        <label className="cert-switcher"><span>{t.currentCert}</span><select value={activeCertId} onChange={e => setActiveCertId(e.target.value)}>{certificationRegistry.map(c => <option key={c.id} value={c.id}>{c.acronym} · {lang === "en" ? "5th Edition" : c.edition}</option>)}</select><small>{t.add}</small></label>
        <nav aria-label={lang === "en" ? "Main navigation" : "主要导航"}>
          {nav.map(item => <button key={item.id} className={cn("nav-item", tab === item.id && "active")} onClick={() => setTab(item.id)}><item.icon size={19} /><span>{item[lang]}</span>{item.id === "mistakes" && state.wrong.length > 0 && <em>{state.wrong.length}</em>}</button>)}
        </nav>
        <div className="sidebar-card">
          <span className="eyebrow">{t.countdown}</span>
          <strong>{studyDays}<small> {t.days}</small></strong>
          <div className="mini-progress"><i style={{ width: `${Math.min(100, completion)}%` }} /></div>
          <p>{t.progress} {completion}%</p>
        </div>
        <p className="source-note">{pack.sourceNote}<br />{user ? (lang === "en" ? "Progress syncs to your account" : "进度已同步到账号") : t.local}</p>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <span className="eyebrow">{pack.name.toUpperCase()}</span>
            <h1>{nav.find(n => n.id === tab)?.[lang]}</h1>
          </div>
          <div className="top-actions"><button className="tour-replay" onClick={() => setState(value => ({ ...value, tourCompleted: false }))} title={lang === "en" ? "Replay site tour" : "重新查看网站导览"}><Compass size={16} /></button><button className="account-button" onClick={() => setAuthOpen(true)}><Cloud size={15} /><span>{user.email}</span></button><div className="lang-toggle"><button className={lang === "zh" ? "active" : ""} onClick={() => setLang("zh")}>中</button><button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button></div><div className="top-stats"><span><Flame size={16} /> {state.streak} {t.days}</span><span><Zap size={16} /> {state.xp} XP</span></div></div>
        </header>

        {tab === "dashboard" && <Dashboard lang={lang} pack={pack} state={state} studyDays={studyDays} completion={completion} setState={setState} setTab={setTab} openLesson={setActiveLesson} />}
        {tab === "plan" && <Plan lang={lang} pack={pack} state={state} setState={setState} setTab={setTab} chapters={courseChapters} openLesson={setActiveLesson} />}
        {tab === "test" && <TestCenter lang={lang} pack={pack} wrong={state.wrong} recordAnswer={recordAnswer} onDiagnosticComplete={saveDiagnostic} />}
        {tab === "mistakes" && <Mistakes lang={lang} pack={pack} wrong={state.wrong} setTab={setTab} clearWrong={(id) => setState(s => ({ ...s, wrong: s.wrong.filter(x => x !== id) }))} />}
        {tab === "library" && <Library lang={lang} pack={pack} chapters={courseChapters} completed={state.completed} onOpen={setActiveChapter} />}
      </section>

      <nav className="mobile-nav" aria-label={lang === "en" ? "Mobile navigation" : "移动导航"}>
        {nav.map(item => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}><item.icon size={19} /><span>{item[lang]}</span></button>)}
      </nav>
      {activeLesson && activePlanChapter && <CourseChapterReader key={`${activeLesson.id}-${activeLesson.focusChapter}`} lang={lang} chapter={activePlanChapter} course={courseChapters} task={activeLesson} chapterScope={activeLesson.chapterNumbers} completed={state.completed.includes(activeLesson.id)} onClose={() => setActiveLesson(null)} onOpenChapter={(n) => setActiveLesson(current => current ? { ...current, focusChapter: n } : null)} onComplete={() => { if (!state.completed.includes(activeLesson.id)) { toggleTask(activeLesson.id); logStudy(0); } }} onPractice={() => { setActiveLesson(null); setTab("test"); }} />}
      {activeChapter && <CourseChapterReader key={activeChapter.n} lang={lang} chapter={activeChapter} course={courseChapters} completed={state.completed.includes(`course-chapter-${activeChapter.n}`)} onClose={() => setActiveChapter(null)} onOpenChapter={(n) => { const next = courseChapters.find(chapter => chapter.n === n); if (next) setActiveChapter(next); }} onComplete={() => { const id = `course-chapter-${activeChapter.n}`; if (!state.completed.includes(id)) { toggleTask(id); logStudy(0); } }} onPractice={() => { setActiveChapter(null); setTab("test"); }} />}
      {authOpen && <AuthPanel lang={lang} user={user} configured={cloudEnabled} syncStatus={syncStatus} onClose={() => setAuthOpen(false)} />}
      <AITutor lang={lang} context={tutorContext} mastery={state.domainStats} />
      {!state.tourCompleted && <SiteTour lang={lang} onComplete={() => setState(value => ({ ...value, tourCompleted: true }))} onNavigate={(nextTab) => setTab(nextTab)} />}
    </main>
  );
}

function LoadingGate({ lang }: { lang: Lang }) {
  return <main className="access-loading"><span className="brand-mark"><Dumbbell size={22} /></span><b>CERT LOOP</b><p>{lang === "en" ? "Securing your learning workspace…" : "正在安全加载你的学习空间…"}</p></main>;
}

function PublicPreview({ lang, setLang, configured, onSignIn }: { lang: Lang; setLang: (lang: Lang) => void; configured: boolean; onSignIn: () => void }) {
  const previews = [
    { n: "01", en: "Structure and Function of Body Systems", zh: "身体系统的结构与功能", meta: "5 deep dives · visual atlas · anatomy lab" },
    { n: "18", en: "Program Design for Resistance Training", zh: "抗阻训练计划设计", meta: "4 deep dives · dose calculator · checkpoints" },
    { n: "26", en: "Policies, Procedures, Legal Duties, and Staff", zh: "政策、程序、法律责任与人员管理", meta: "risk systems · EAP · exam practice" },
  ];
  return <main className="public-preview">
    <header><button className="brand" aria-label="Cert Loop"><span className="brand-mark"><Dumbbell size={20} /></span><span><b>CERT LOOP</b><small>English-first certification mastery</small></span></button><div><div className="lang-toggle"><button className={lang === "zh" ? "active" : ""} onClick={() => setLang("zh")}>中</button><button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button></div><button className="primary" onClick={onSignIn}><LogIn size={16} /> {lang === "en" ? "Sign in to learn" : "登录开始学习"}</button></div></header>
    <section className="preview-hero"><div><span className="status-pill"><LockKeyhole size={14} /> PREVIEW · SIGN-IN REQUIRED</span><h1>{lang === "en" ? <>One complete loop from <i>zero</i> to CSCS exam day.</> : <>从零开始，到 CSCS 考试日的<i>完整闭环</i>。</>}</h1><p>{lang === "en" ? "English fifth-edition source of truth, bilingual teaching support, interactive visuals, adaptive placement, exam practice, spaced review, and a whole-course AI tutor." : "以英文第五版为事实基准，提供双语教学、互动图解、自适应摸底、考试练习、间隔复习与全课程 AI 导师。"}</p><div><button className="primary" onClick={onSignIn}><Play size={17} /> {lang === "en" ? "Start with placement" : "从摸底测试开始"}</button><span>{configured ? (lang === "en" ? "Secure passwordless sign-in" : "安全免密码登录") : (lang === "en" ? "Account setup pending" : "账号配置待完成")}</span></div></div><aside><div className="preview-orbit"><strong>26</strong><span>complete chapter lessons</span></div><div><strong>84</strong><span>original bilingual questions</span></div><div><strong>24/7</strong><span>whole-course AI context</span></div></aside></section>
    <section className="preview-workflow"><span className="eyebrow">THE CERT LOOP WORKFLOW</span><h2>{lang === "en" ? "Every study session closes the loop" : "每次学习都闭合循环"}</h2><div>{[
      ["01","PLACE","Find the real baseline","定位真实基础"],
      ["02","LEARN","Read the complete visual lesson","学习完整视觉课程"],
      ["03","TEST","Apply it in exam format","用考试形式应用"],
      ["04","REPAIR","Turn misses into retrieval","把错题变成主动提取"],
    ].map(item => <article key={item[0]}><span>{item[0]}</span><b>{item[1]}</b><p>{lang === "en" ? item[2] : item[3]}</p></article>)}</div></section>
    <section className="preview-syllabus"><div><span className="eyebrow">LOCKED COURSE PREVIEW</span><h2>{lang === "en" ? "A real course—not a list of summaries" : "真正的课程，而不是摘要清单"}</h2><p>{lang === "en" ? "Sign in and complete placement to unlock lessons, figures, mind maps, tests, progress, and AI tutoring." : "登录并完成摸底测试后，解锁课程、图示、思维导图、测试、进度与 AI 导师。"}</p></div><div>{previews.map(item => <article key={item.n}><span>{item.n}</span><div><b>{item.en}</b><small>{item.zh} · {item.meta}</small></div><LockKeyhole size={17} /></article>)}<button className="ghost wide" onClick={onSignIn}>{lang === "en" ? "Unlock the full 26-chapter course" : "解锁完整 26 章课程"} <ChevronRight size={16} /></button></div></section>
  </main>;
}

function PlacementTest({ lang, pack, userEmail, onSignOut, onComplete }: { lang: Lang; pack: CertificationPack; userEmail: string; onSignOut: () => void; onComplete: (result: DiagnosticResult) => void }) {
  const allocation: Record<string, number> = { "exercise-science": 6, "sport-psychology": 4, nutrition: 3, "program-design": 7, "exercise-technique": 4, implementation: 3, organization: 3 };
  const questions = useMemo(() => Object.entries(allocation).flatMap(([domain, amount]) => pack.questions.filter(question => question.domain === domain).slice(0, amount)), [pack]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const current = questions[index];
  const selected = answers[index];

  function finish() {
    const domains: DiagnosticResult["domains"] = {};
    questions.forEach((question, questionIndex) => {
      const existing = domains[question.domain] || { correct: 0, total: 0 };
      domains[question.domain] = { correct: existing.correct + (answers[questionIndex] === question.answer ? 1 : 0), total: existing.total + 1 };
    });
    setResult({ completedAt: new Date().toISOString(), score: questions.reduce((score, question, questionIndex) => score + (answers[questionIndex] === question.answer ? 1 : 0), 0), total: questions.length, domains });
  }

  if (result) {
    const ranked = Object.entries(result.domains).map(([id, stat]) => ({ id, ...stat, rate: stat.correct / stat.total })).sort((a, b) => a.rate - b.rate);
    return <main className="placement-shell"><header><span className="brand-mark"><Dumbbell size={20} /></span><b>CERT LOOP</b><button onClick={onSignOut}><UserRound size={15} /> {userEmail}</button></header><section className="placement-result"><span className="eyebrow">PLACEMENT COMPLETE · ENGLISH SOURCE OF TRUTH</span><div className="result-score"><strong>{Math.round(result.score / result.total * 100)}%</strong><span>{result.score} / {result.total}</span></div><h1>{lang === "en" ? "Your first route is ready" : "你的第一条学习路线已生成"}</h1><p>{lang === "en" ? "This is a baseline, not a grade. Weak high-weight domains stay in the full course; stronger domains can earn fast-track checkpoints." : "这是基线，不是成绩。高权重薄弱领域保留完整课程；强项可通过章节挑战获得快速路线。"}</p><div className="placement-domain-results">{ranked.map(item => <div key={item.id}><span><b>{pack.domains.find(domain => domain.id === item.id)?.en}</b><small>{pack.domains.find(domain => domain.id === item.id)?.label}</small></span><i><em style={{ width: `${Math.round(item.rate * 100)}%` }} /></i><strong>{Math.round(item.rate * 100)}%</strong></div>)}</div><button className="primary wide" onClick={() => onComplete(result)}>{lang === "en" ? "Build my plan and show me around" : "生成计划并开始网站导览"} <ChevronRight size={17} /></button></section></main>;
  }

  if (!current || questions.length !== 30) return <main className="placement-shell"><section className="placement-error"><h1>Placement configuration error</h1><p>Expected 30 items but found {questions.length}. The course remains locked to avoid an invalid baseline.</p></section></main>;
  return <main className="placement-shell"><header><span className="brand-mark"><Dumbbell size={20} /></span><b>CERT LOOP</b><button onClick={onSignOut}><UserRound size={15} /> {userEmail}</button></header><div className="placement-progress"><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /><span>{index + 1} / {questions.length}</span></div><section className="placement-question"><div className="placement-intro"><span className="eyebrow">REQUIRED FIRST-LOGIN PLACEMENT</span><h1>{lang === "en" ? "Show what you know—without notes" : "不看资料，展示你的真实基础"}</h1><p>{lang === "en" ? "English is the scored source. Chinese support is shown below when Chinese mode is selected. Results create your first adaptive route." : "英文题干是计分依据；中文模式会在下方提供辅助。结果将生成首条自适应路线。"}</p></div><article className="question-card"><div className="question-meta"><span>{pack.domains.find(domain => domain.id === current.domain)?.en}</span><span>{current.source.replace("第 ","Ch. ").replace("章","")}</span><span>NO SKIP</span></div><h2>{current.en?.prompt || current.prompt}</h2>{lang === "zh" && <p className="placement-translation">{current.prompt}</p>}<div className="options">{(current.en?.options || current.options).map((option, optionIndex) => <button key={option} className={selected === optionIndex ? "selected" : ""} onClick={() => setAnswers(values => { const next = [...values]; next[index] = optionIndex; return next; })}><span>{String.fromCharCode(65 + optionIndex)}</span><b>{option}</b></button>)}</div><div className="question-footer"><span>{lang === "en" ? "Answers and explanations unlock after the baseline." : "完成基线后才显示答案与解析。"}</span><button className="primary" disabled={selected === undefined} onClick={() => index === questions.length - 1 ? finish() : setIndex(value => value + 1)}>{index === questions.length - 1 ? (lang === "en" ? "Score placement" : "提交摸底") : (lang === "en" ? "Next question" : "下一题")} <ChevronRight size={17} /></button></div></article></section></main>;
}

function SiteTour({ lang, onComplete, onNavigate }: { lang: Lang; onComplete: () => void; onNavigate: (tab: Tab) => void }) {
  const [step, setStep] = useState(0);
  const steps: Array<{ tab: Tab; eyebrow: string; icon: typeof LayoutDashboard; en: string; zh: string; bodyEn: string; bodyZh: string }> = [
    { tab:"dashboard", eyebrow:"01 · TODAY", icon:LayoutDashboard, en:"Start with the next three actions", zh:"从今天的三个行动开始", bodyEn:"Today translates your placement, exam date, and unfinished work into a manageable study loop.", bodyZh:"“今日”会把摸底结果、考试日期和未完成内容转化为可执行的学习循环。" },
    { tab:"plan", eyebrow:"02 · LEARN", icon:CalendarDays, en:"Open every plan item as a complete lesson", zh:"每个计划项都能打开完整课程", bodyEn:"Learn the English-first explanation, visual atlas, personal-note figures, interactive lab, mind map, checkpoints, and recall prompts.", bodyZh:"依次学习英文主讲、视觉图谱、个人笔记图、互动实验、思维导图、章节测试与主动回忆。" },
    { tab:"test", eyebrow:"03 · TEST", icon:CircleHelp, en:"Use exam format to expose weak reasoning", zh:"用考试形式暴露推理弱点", bodyEn:"Practice explains immediately; exam mode scores at the end. Every miss enters the review loop automatically.", bodyZh:"练习模式即时讲解，模拟模式统一评分；所有错题自动进入回炉队列。" },
    { tab:"mistakes", eyebrow:"04 · REPAIR", icon:RotateCcw, en:"Retrieve before you reread", zh:"先主动提取，再重新阅读", bodyEn:"Turn each miss into a short rule, answer aloud, and retest until the error no longer repeats.", bodyZh:"把每个错题改写成短规则，先口述答案，再测试，直到错误不再重复。" },
    { tab:"library", eyebrow:"05 · ASK & EXPLORE", icon:Sparkles, en:"Use the library and whole-course AI Tutor", zh:"使用资料库与全课程 AI 导师", bodyEn:"The Tutor searches all 26 chapters and your mastery record. Live research is clearly labeled and never silently overrides exam truth.", bodyZh:"AI 导师检索全部 26 章与掌握度；最新研究会明确标注，绝不会静默覆盖考试事实。" },
  ];
  const item = steps[step]; const Icon = item.icon;
  return <div className="tour-layer" role="dialog" aria-modal="true" aria-label="Cert Loop site tour"><section className="tour-card"><div className="tour-visual"><span><Icon size={32} /></span><div>{steps.map((_, index) => <i className={index <= step ? "active" : ""} key={index} />)}</div></div><div className="tour-copy"><span className="eyebrow">{item.eyebrow} · FIRST-TIME SITE GUIDE</span><h2>{lang === "en" ? item.en : item.zh}</h2><p>{lang === "en" ? item.bodyEn : item.bodyZh}</p><small>{lang === "en" ? "You can replay this tour anytime with the compass button in the top bar." : "以后可随时点击顶部指南针按钮重新查看。"}</small><footer><button className="text-button" onClick={onComplete}>{lang === "en" ? "Skip tour" : "跳过导览"}</button><span>{step + 1} / {steps.length}</span><button className="primary" onClick={() => { onNavigate(item.tab); if (step === steps.length - 1) onComplete(); else setStep(value => value + 1); }}>{step === steps.length - 1 ? (lang === "en" ? "Enter Cert Loop" : "进入 Cert Loop") : (lang === "en" ? "Next" : "下一步")} <ChevronRight size={16} /></button></footer></div></section></div>;
}

function Dashboard({ lang, pack, state, studyDays, completion, setState, setTab, openLesson }: { lang: Lang; pack: CertificationPack; state: SavedState; studyDays: number; completion: number; setState: React.Dispatch<React.SetStateAction<SavedState>>; setTab: (t: Tab) => void; openLesson: (lesson: ActiveLesson) => void }) {
  const t = copy[lang];
  const nextTasks = adaptivePlan(pack, state.planLength, lang).flatMap((week) => week.tasks.map(task => ({ id: task.id, task: task.label, week: week.title, weekSubtitle: week.subtitle, chapters: week.chapters, chapterNumbers: week.chapterNumbers, domain: week.domain }))).filter(t => !state.completed.includes(t.id)).slice(0, 3);
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
      <div className="task-list">{nextTasks.length ? nextTasks.map((task, i) => <button key={task.id} className="task-row" onClick={() => openLesson({ id: task.id, label: task.task, weekTitle: task.week, weekSubtitle: task.weekSubtitle, chapters: task.chapters, chapterNumbers: task.chapterNumbers, focusChapter: task.chapterNumbers[0] || 1, domain: task.domain })}><span className="task-check">{i + 1}</span><span><b>{task.task}</b><small>{task.week} · {lang === "en" ? "Open complete lesson" : "打开完整课程"}</small></span><ChevronRight size={18} /></button>) : <div className="empty-mini"><Medal size={28} /><b>{lang === "en" ? "This cycle is complete" : "本轮任务已完成"}</b><span>{lang === "en" ? "Open the plan to begin another review cycle." : "去计划页开启下一轮复习。"}</span></div>}</div>
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

function chapterDomainId(chapter: number) {
  if (chapter <= 8) return "exercise-science";
  if (chapter === 9) return "sport-psychology";
  if (chapter <= 12) return "nutrition";
  if (chapter <= 14 || chapter === 24) return "implementation";
  if (chapter <= 17) return "exercise-technique";
  if (chapter <= 23) return "program-design";
  return "organization";
}

function Plan({ lang, pack, state, setState, setTab, chapters, openLesson }: { lang: Lang; pack: CertificationPack; state: SavedState; setState: React.Dispatch<React.SetStateAction<SavedState>>; setTab: (tab: Tab) => void; chapters: CourseChapter[]; openLesson: (lesson: ActiveLesson) => void }) {
  const t = copy[lang];
  const displayPlan = adaptivePlan(pack, state.planLength, lang);
  const recommendations = chapters.map(chapter => {
    const domain = chapterDomainId(chapter.n); const stat = state.domainStats[domain] || { correct: 0, total: 0 }; const rate = stat.total ? stat.correct / stat.total : 0;
    const status = stat.total < 3 ? "diagnose" : rate >= .85 ? "fast" : rate < .65 ? "priority" : "standard";
    return { chapter, stat, rate, status };
  });
  const focus = [...recommendations].sort((a, b) => (a.status === "priority" ? -1 : a.status === "fast" ? 1 : 0) - (b.status === "priority" ? -1 : b.status === "fast" ? 1 : 0)).slice(0, 8);
  return <div className="page-content">
    <section className="page-intro"><div><span className="eyebrow">{t.adaptive}</span><h2>{state.planLength}-{t.weekPlan}</h2><p>{t.planDesc}</p></div><div className="segmented">{([8,12,16] as const).map(n => <button key={n} className={state.planLength === n ? "active" : ""} onClick={() => setState(s => ({ ...s, planLength: n }))}>{n} {lang === "en" ? "wk" : "周"}</button>)}</div></section>
    <section className="adaptive-coach"><div className="adaptive-coach-copy"><span className="eyebrow">AI-ASSISTED MASTERY ROUTING</span><h3>{state.diagnostic ? (lang === "en" ? `Diagnostic: ${state.diagnostic.score}/${state.diagnostic.total}` : `诊断结果：${state.diagnostic.score}/${state.diagnostic.total}`) : (lang === "en" ? "Start with evidence, not confidence" : "先用证据定位，而不是凭感觉")}</h3><p>{lang === "en" ? "The engine combines diagnostic and practice history. Strong domains are fast-tracked to a chapter checkpoint; weak domains stay in the full learning path. No tested domain is permanently skipped." : "系统结合诊断与练习记录。强项可直接挑战章节测试；弱项保留完整学习路径。任何考试领域都不会被永久跳过。"}</p><button className="primary" onClick={() => setTab("test")}>{state.diagnostic ? (lang === "en" ? "Retake adaptive diagnostic" : "重新诊断") : (lang === "en" ? "Take 30-question diagnostic" : "完成 30 题诊断")} <ChevronRight size={16} /></button></div><div className="mastery-routes">{focus.map(item => <button key={item.chapter.n} onClick={() => openLesson({ id: `adaptive-ch-${item.chapter.n}`, label: item.status === "fast" ? (lang === "en" ? "Fast-track chapter checkpoint" : "快速挑战章节测试") : (lang === "en" ? "Adaptive chapter review" : "自适应章节复习"), weekTitle: lang === "en" ? "Adaptive route" : "自适应路线", weekSubtitle: item.status === "fast" ? (lang === "en" ? "Prove mastery before reducing study time" : "先证明掌握，再减少学习时间") : (lang === "en" ? "Build missing foundations and retest" : "补齐基础并重新测试"), chapters: `Ch. ${item.chapter.n}`, chapterNumbers: [item.chapter.n], focusChapter: item.chapter.n, domain: item.chapter.domain[lang] })}><span className={item.status}>{item.status === "fast" ? "FAST-TRACK" : item.status === "priority" ? "PRIORITY" : item.status === "standard" ? "STANDARD" : "DIAGNOSE"}</span><b>Ch. {item.chapter.n} · {item.chapter.title[lang]}</b><small>{item.stat.total ? `${Math.round(item.rate * 100)}% · ${item.stat.total} items` : (lang === "en" ? "No evidence yet" : "尚无证据")}</small></button>)}</div></section>
    <div className="phase-strip"><span><i /> {t.build}</span><span><i /> {t.apply}</span><span><i /> {t.mock}</span></div>
    <div className="weeks-grid">{displayPlan.map((week, wi) => {
      const done = week.tasks.filter(t => state.completed.includes(t.id)).length;
      return <article className={cn("week-card", done === week.tasks.length && "complete")} key={week.key}>
        <div className="week-number"><span>{String(wi + 1).padStart(2, "0")}</span><small>WEEK</small></div>
        <div className="week-body"><span className="domain-label">{week.domain} · {week.chapters}</span><h3>{week.title}</h3><p>{week.subtitle}</p><div className="week-tasks">{week.tasks.map(task => { const checked = state.completed.includes(task.id); return <button className={checked ? "checked" : ""} onClick={() => openLesson({ id: task.id, label: task.label, weekTitle: week.title, weekSubtitle: week.subtitle, chapters: week.chapters, chapterNumbers: week.chapterNumbers, focusChapter: week.chapterNumbers[0] || 1, domain: week.domain })} key={task.id}><span>{checked && <Check size={13} />}</span><b>{task.label}</b><small>{checked ? (lang === "en" ? "Review complete lesson" : "复习完整课程") : (lang === "en" ? "Open complete lesson" : "打开完整课程")}</small><ChevronRight size={14} /></button>; })}</div></div>
        <div className="week-progress"><b>{done}/{week.tasks.length}</b><span>{t.complete}</span></div>
      </article>;
    })}</div>
  </div>;
}

export function LessonReader({ lang, lesson, content, completed, onClose, onComplete, onPractice }: { lang: Lang; lesson: ActiveLesson; content: LessonContent; completed: boolean; onClose: () => void; onComplete: () => void; onPractice: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const tx = (value: BilingualText) => value[lang];
  return <div className="lesson-overlay" role="dialog" aria-modal="true" aria-label={lesson.label} data-testid="lesson-reader">
    <div className="lesson-reader">
      <header className="lesson-reader-top">
        <button className="text-button" onClick={onClose}><ArrowLeft size={17} /> {lang === "en" ? "Back to plan" : "返回计划"}</button>
        <div className="lesson-status"><BookMarked size={15} /><span>{content.source}</span></div>
        <button className="icon-button" onClick={onClose} aria-label={lang === "en" ? "Close lesson" : "关闭课程"}><X size={18} /></button>
      </header>
      <div className="lesson-hero">
        <span className="domain-label">{lesson.domain} · {lesson.chapters}</span>
        <h2>{lesson.label}</h2>
        <p>{lesson.weekTitle} — {lesson.weekSubtitle}</p>
        <div className="lesson-meta"><span><Clock3 size={14} /> {content.minutes} min</span><span><Brain size={14} /> {lang === "en" ? "Learn → Apply → Recall" : "学习 → 应用 → 回忆"}</span>{completed && <span className="lesson-complete"><Check size={14} /> {lang === "en" ? "Completed" : "已完成"}</span>}</div>
      </div>
      <div className="lesson-body">
        <section className="lesson-section lesson-overview"><span className="lesson-step">01</span><div><span className="eyebrow">{lang === "en" ? "UNDERSTAND" : "理解"}</span><h3>{lang === "en" ? "Build the mental model" : "建立知识模型"}</h3><p>{tx(content.summary)}</p></div></section>
        <section className="lesson-section"><span className="lesson-step">02</span><div><span className="eyebrow">{lang === "en" ? "CORE KNOWLEDGE" : "核心知识"}</span><h3>{lang === "en" ? "What you need to know" : "必须掌握的内容"}</h3><ul className="knowledge-points">{content.points.map((point, index) => <li key={index}><span>{index + 1}</span><p>{tx(point)}</p></li>)}</ul></div></section>
        <section className="lesson-section application-block"><span className="lesson-step">03</span><div><span className="eyebrow">{lang === "en" ? "APPLY" : "应用"}</span><h3>{lang === "en" ? "Turn the rule into a decision" : "把规则转化为决策"}</h3><p>{tx(content.application)}</p></div></section>
        <section className="lesson-section recall-block"><span className="lesson-step">04</span><div><span className="eyebrow">{lang === "en" ? "ACTIVE RECALL" : "主动回忆"}</span><h3>{tx(content.recall)}</h3>{revealed ? <div className="model-answer"><strong>{lang === "en" ? "Model answer" : "参考答案"}</strong><p>{tx(content.answer)}</p></div> : <button className="ghost recall-button" onClick={() => setRevealed(true)}>{lang === "en" ? "Reveal after answering aloud" : "口述后查看答案"} <ChevronRight size={15} /></button>}</div></section>
      </div>
      <footer className="lesson-footer"><div><strong>{lang === "en" ? "Source note" : "来源说明"}</strong><span>{lang === "en" ? "Original study summary aligned to the English fifth-edition textbook. Use the textbook for full context." : "原创学习总结，以英文第五版教材为基准；完整语境请查阅原教材。"}</span></div><div><button className="ghost" onClick={onPractice}>{lang === "en" ? "Practice this domain" : "练习该领域"}</button><button className="primary" disabled={!revealed || completed} onClick={onComplete}>{completed ? (lang === "en" ? "Lesson completed" : "课程已完成") : (lang === "en" ? "Complete lesson" : "完成课程")} <Check size={16} /></button></div></footer>
    </div>
  </div>;
}

function AuthPanel({ lang, user, configured, syncStatus, onClose }: { lang: Lang; user: { id: string; email: string } | null; configured: boolean; syncStatus: "local" | "loading" | "synced" | "error"; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendLink(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase || !email.trim()) return;
    setBusy(true); setMessage("");
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: window.location.origin } });
    setMessage(error ? error.message : (lang === "en" ? "Check your email for the secure sign-in link." : "请查收邮箱中的安全登录链接。"));
    setBusy(false);
  }

  async function signOut() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setBusy(true);
    await supabase.auth.signOut();
    setBusy(false); onClose();
  }

  return <div className="auth-overlay" role="dialog" aria-modal="true" aria-label={lang === "en" ? "Learner account" : "学习账号"}>
    <section className="auth-panel">
      <button className="icon-button auth-close" onClick={onClose} aria-label={lang === "en" ? "Close" : "关闭"}><X size={18} /></button>
      <span className="account-orbit"><UserRound size={27} /></span>
      <span className="eyebrow">CERT LOOP ACCOUNT</span>
      <h2>{user ? (lang === "en" ? "Your progress is portable" : "你的进度可跨设备同步") : (lang === "en" ? "Keep every lesson and miss" : "保存每节课程与每道错题")}</h2>
      {user ? <>
        <p>{lang === "en" ? `Signed in as ${user.email}. Study-plan completion, XP, attempts, and the review queue sync to Supabase.` : `已登录 ${user.email}。计划完成度、XP、作答和错题队列会同步到 Supabase。`}</p>
        <div className={cn("sync-indicator", syncStatus)}>{syncStatus === "synced" ? <Cloud size={16} /> : syncStatus === "error" ? <CloudOff size={16} /> : <RotateCcw size={16} />}<span>{syncStatus === "synced" ? (lang === "en" ? "Cloud progress synced" : "云端进度已同步") : syncStatus === "error" ? (lang === "en" ? "Sync needs attention" : "同步需要处理") : (lang === "en" ? "Syncing progress…" : "正在同步进度…")}</span></div>
        <button className="ghost wide" disabled={busy} onClick={signOut}><LogOut size={16} /> {lang === "en" ? "Sign out" : "退出登录"}</button>
      </> : configured ? <>
        <p>{lang === "en" ? "Use a passwordless email link. Your private study progress is protected by Supabase Row Level Security." : "使用免密码邮箱链接登录。个人学习进度由 Supabase 行级安全策略保护。"}</p>
        <form onSubmit={sendLink}><label>{lang === "en" ? "Email address" : "邮箱地址"}<input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" /></label><button className="primary wide" disabled={busy}>{busy ? (lang === "en" ? "Sending…" : "发送中…") : (lang === "en" ? "Email me a sign-in link" : "发送登录链接")}</button></form>
        {message && <p className="auth-message">{message}</p>}
      </> : <>
        <p>{lang === "en" ? "The account experience is built, but this deployment still needs a dedicated Supabase project before email sign-in can be enabled. Device-local progress continues to work meanwhile." : "账号功能已经实现，但此部署仍需要绑定专用 Supabase 项目才能启用邮箱登录。在此之前，本机进度会继续正常保存。"}</p>
        <div className="sync-indicator local"><CloudOff size={16} /><span>{lang === "en" ? "Using device-local progress" : "当前使用本机进度"}</span></div>
      </>}
    </section>
  </div>;
}

function TestCenter({ lang, pack, wrong, recordAnswer, onDiagnosticComplete }: { lang: Lang; pack: CertificationPack; wrong: string[]; recordAnswer: (q: Question, correct: boolean) => void; onDiagnosticComplete: (result: DiagnosticResult) => void }) {
  const t = copy[lang];
  const [session, setSession] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [preset, setPreset] = useState("diagnostic");
  const [count, setCount] = useState(30);
  const [finished, setFinished] = useState(false);

  const current = session[index];
  const score = session.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);

  function start() {
    let pool = pack.questions;
    if (preset === "science") pool = pack.questions.filter(q => q.section === "科学基础");
    if (preset === "practical") pool = pack.questions.filter(q => q.section === "实践应用");
    if (preset === "wrong") pool = pack.questions.filter(q => wrong.includes(q.id));
    let chosen = shuffled(pool).slice(0, Math.min(count, pool.length));
    if (preset === "diagnostic") {
      const allocation: Record<string, number> = { "exercise-science": 6, "sport-psychology": 4, nutrition: 3, "program-design": 7, "exercise-technique": 4, implementation: 3, organization: 3 };
      chosen = Object.entries(allocation).flatMap(([domain, amount]) => shuffled(pack.questions.filter(question => question.domain === domain)).slice(0, amount));
      setMode("exam");
    }
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
      if (preset === "diagnostic") {
        const domains: Record<string, { correct: number; total: number }> = {};
        session.forEach((question, questionIndex) => { const current = domains[question.domain] || { correct: 0, total: 0 }; domains[question.domain] = { correct: current.correct + (answers[questionIndex] === question.answer ? 1 : 0), total: current.total + 1 }; });
        onDiagnosticComplete({ completedAt: new Date().toISOString(), score, total: session.length, domains });
      }
      setFinished(true);
    } else { setIndex(i => i + 1); setSelected(answers[index + 1] ?? null); }
  }

  if (!session.length || finished) return <div className="page-content test-layout">
    <section className="test-hero"><span className="eyebrow">THREE-OPTION FORMAT</span><h2>{finished ? t.done : t.testHero}</h2><p>{finished ? (lang === "en" ? `You answered ${score} of ${session.length} correctly. ${t.wrongSaved}` : `你答对 ${score} / ${session.length} 题。${t.wrongSaved}`) : t.testDesc}</p>{finished && <div className="result-score"><strong>{Math.round(score / session.length * 100)}%</strong><span>{score / session.length >= .8 ? (lang === "en" ? "Strong result. Keep the rhythm." : "状态很好，继续保持。") : (lang === "en" ? "Review misses before the next round." : "先回炉错题，再开新一轮。")}</span></div>}</section>
    <section className="card test-setup">
      <div className="mode-tabs"><button className={mode === "practice" ? "active" : ""} onClick={() => setMode("practice")}>{t.practice}</button><button className={mode === "exam" ? "active" : ""} onClick={() => setMode("exam")}>{t.exam}</button></div>
      <h3>{t.chooseSet}</h3>
      <div className="preset-grid">
        {[{id:"diagnostic",label:lang === "en" ? "Adaptive diagnostic" : "自适应诊断",sub:lang === "en" ? "30 items · builds your route" : "30 题 · 生成个人路线"},{id:"weighted",label:t.weighted,sub:t.mixed},{id:"science",label:t.science,sub:`95 ${t.items} / 90 min`},{id:"practical",label:t.practical,sub:`125 ${t.items} / 150 min`},{id:"wrong",label:t.wrongLoop,sub:`${t.currentCount} ${wrong.length} ${t.items}`}].map(p => <button key={p.id} disabled={p.id === "wrong" && !wrong.length} className={preset === p.id ? "active" : ""} onClick={() => { setPreset(p.id); if (p.id === "diagnostic") { setCount(30); setMode("exam"); } }}><b>{p.label}</b><span>{p.sub}</span></button>)}
      </div>
      <label className="range-label"><span>{t.roundSize} <b>{count}</b></span><input type="range" min="5" max="30" step="5" value={count} disabled={preset === "diagnostic"} onChange={e => setCount(Number(e.target.value))} /></label>
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

function CourseChapterReader({ lang, chapter, course, task, chapterScope, completed, onClose, onOpenChapter, onComplete, onPractice }: { lang: Lang; chapter: CourseChapter; course: CourseChapter[]; task?: ActiveLesson; chapterScope?: number[]; completed: boolean; onClose: () => void; onOpenChapter: (n: number) => void; onComplete: () => void; onPractice: () => void }) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<number, number>>({});
  const tx = (value: CourseText) => value[lang];
  const other = (value: CourseText) => value[lang === "en" ? "zh" : "en"];
  const sectionCount = chapter.sections.length;
  const visibleCourse = task && chapterScope?.length ? course.filter(item => chapterScope.includes(item.n)) : course;
  const visibleIndex = visibleCourse.findIndex(item => item.n === chapter.n);
  const previous = visibleIndex > 0 ? visibleCourse[visibleIndex - 1].n : null;
  const next = visibleIndex >= 0 && visibleIndex < visibleCourse.length - 1 ? visibleCourse[visibleIndex + 1].n : null;
  const checkpointScore = chapter.sections.reduce((score, _section, index) => score + (checkpointAnswers[index] === index % 3 ? 1 : 0), 0);

  function checkpointOptions(sectionIndex: number) {
    const correct = chapter.sections[sectionIndex].decision.en;
    const distractors = [1, 2].map(offset => chapter.sections[(sectionIndex + offset) % chapter.sections.length].decision.en);
    const correctIndex = sectionIndex % 3;
    const options = [...distractors];
    options.splice(correctIndex, 0, correct);
    return { options, correctIndex };
  }

  return <div className="course-overlay" role="dialog" aria-modal="true" aria-label={chapter.title.en} data-testid="course-chapter-reader">
    <div className="course-reader">
      <header className="course-topbar">
        <button className="text-button" onClick={onClose}><ArrowLeft size={17} /> {task ? (lang === "en" ? "Back to plan" : "返回计划") : (lang === "en" ? "Back to course" : "返回课程")}</button>
        <div><BookMarked size={15} /><span>{chapter.source}</span></div>
        <button className="icon-button" onClick={onClose} aria-label={lang === "en" ? "Close chapter" : "关闭章节"}><X size={18} /></button>
      </header>

      <div className="course-layout">
        <aside className="course-outline">
          <span className="eyebrow">{task ? "TASK COURSE PATH" : "COMPLETE COURSE"}</span>
          <strong>{task ? task.label : "CSCS · 5th Edition"}</strong>
          <div className="course-progress"><i style={{ width: `${Math.max(1, visibleIndex + 1) / visibleCourse.length * 100}%` }} /></div>
          <small>{visibleIndex + 1} / {visibleCourse.length} {lang === "en" ? "linked chapters" : "个关联章节"}</small>
          <nav aria-label={lang === "en" ? "Course chapters" : "课程章节"}>{visibleCourse.map(item => <button key={item.n} className={item.n === chapter.n ? "active" : ""} onClick={() => onOpenChapter(item.n)}><span>{String(item.n).padStart(2,"0")}</span><b>{tx(item.title)}</b></button>)}</nav>
        </aside>

        <article className="course-article">
          {task && <section className="task-course-banner"><div><span className="eyebrow">PLAN ITEM · FULL LEARNING EXPERIENCE</span><h2>{task.label}</h2><p>{task.weekTitle} — {task.weekSubtitle}</p></div><aside><span>{task.domain}</span><b>{task.chapters}</b><small>{lang === "en" ? "Learn every linked chapter, use the visual lab, complete checkpoints, then mark this plan item done." : "学习全部关联章节，完成互动实验和测试后，再将计划项标为完成。"}</small></aside></section>}
          <section className="course-hero">
            <span className="domain-label">{tx(chapter.domain)}</span>
            <p className="chapter-kicker">CHAPTER {String(chapter.n).padStart(2,"0")} · COMPLETE LESSON</p>
            <h1>{tx(chapter.title)}</h1>
            <p className="translation-line">{other(chapter.title)}</p>
            <div className="lesson-meta"><span><Clock3 size={14} /> {chapter.minutes} min</span><span><BookOpen size={14} /> {sectionCount} {lang === "en" ? "deep-dive units" : "个深度单元"}</span><span><Brain size={14} /> {chapter.recall.length} {lang === "en" ? "recall checks" : "个主动回忆"}</span>{completed && <span className="lesson-complete"><Check size={14} /> {lang === "en" ? "Completed" : "已完成"}</span>}</div>
          </section>

          <div className="course-content">
            <section className="course-objectives">
              <span className="eyebrow">LEARNING OBJECTIVES</span>
              <h2>{lang === "en" ? "What you will be able to do" : "完成本章后你能做到"}</h2>
              <ol>{chapter.objectives.map((objective, index) => <li key={index}><span>{index + 1}</span><div><b>{objective.en}</b><small>{objective.zh}</small></div></li>)}</ol>
            </section>

            <ChapterVisualLab chapter={chapter} lang={lang} />

            <TextbookVisualAtlas chapter={chapter.n} lang={lang} />

            <nav className="section-jump" aria-label={lang === "en" ? "Chapter sections" : "章节小节"}>{chapter.sections.map((section, index) => <a key={section.id} href={`#chapter-${chapter.n}-${section.id}`}><span>{String(index + 1).padStart(2,"0")}</span>{tx(section.title)}</a>)}</nav>

            {chapter.sections.map((section, index) => <section className="deep-dive" id={`chapter-${chapter.n}-${section.id}`} key={section.id}>
              <div className="deep-dive-heading"><span>{String(index + 1).padStart(2,"0")}</span><div><span className="eyebrow">DEEP DIVE</span><h2>{tx(section.title)}</h2><small>{other(section.title)}</small></div></div>
              <div className="lecture-copy">{section.explanation.map((paragraph, pi) => <p key={pi}>{paragraph}</p>)}</div>
              <div className="knowledge-board"><span className="eyebrow">KNOWLEDGE YOU MUST OWN</span><ul>{section.details.map((detail, di) => <li key={di}><Check size={15} /><span>{detail}</span></li>)}</ul></div>
              <SectionNoteFigures chapter={chapter.n} sectionId={section.id} lang={lang} />
              <div className="decision-grid">
                <aside className="coach-decision"><span className="eyebrow">COACHING DECISION</span><strong>{section.decision.en}</strong><p>{section.decision.zh}</p></aside>
                <aside className="exam-cue"><span className="eyebrow">EXAM CUE</span><strong>{section.examCue.en}</strong><p>{section.examCue.zh}</p></aside>
              </div>
            </section>)}

            {!!chapter.formulas.length && <section className="reference-block"><span className="eyebrow">FORMULAS & WORKED USE</span><h2>{lang === "en" ? "Calculate it, then interpret it" : "先计算，再解释"}</h2><div className="formula-grid">{chapter.formulas.map(formula => <article key={formula.name}><span>{formula.name}</span><code>{formula.expression}</code><p>{formula.use.en}</p><small>{formula.use.zh}</small>{formula.example && <em>Example · {formula.example}</em>}</article>)}</div></section>}

            <section className="reference-block"><span className="eyebrow">KEY TERMINOLOGY</span><h2>{lang === "en" ? "Language the exam expects" : "考试要求掌握的术语"}</h2><div className="term-grid">{chapter.terms.map(item => <article key={item.term}><strong>{item.term}</strong><p>{item.meaning.en}</p><small>{item.meaning.zh}</small></article>)}</div></section>

            <section className="mastery-block"><div><span className="eyebrow">EXAM-READY CHECKLIST</span><h2>{lang === "en" ? "Can you do all of these without notes?" : "你能否不看笔记完成以下任务？"}</h2></div><ul>{chapter.examChecklist.map((item, index) => <li key={index}><span><Check size={15} /></span><div><b>{item.en}</b><small>{item.zh}</small></div></li>)}</ul></section>

            <MindMapRecap chapter={chapter.n} lang={lang} />

            <section className="checkpoint-lab"><div className="checkpoint-heading"><div><span className="eyebrow">CHAPTER CHECKPOINTS</span><h2>{lang === "en" ? "Apply every deep-dive decision" : "应用每个深度单元的决策"}</h2><p>{lang === "en" ? "These exam-style checks make every section testable. Choose the decision that best fits the named problem." : "这些考试式检查覆盖每个小节。选择最符合指定问题的教练决策。"}</p></div><strong>{Object.keys(checkpointAnswers).length === sectionCount ? `${checkpointScore}/${sectionCount}` : `${Object.keys(checkpointAnswers).length}/${sectionCount}`}</strong></div><div className="checkpoint-list">{chapter.sections.map((section, index) => { const { options, correctIndex } = checkpointOptions(index); const selected = checkpointAnswers[index]; const answered = selected !== undefined; return <article key={section.id}><span className="checkpoint-number">CHECK {String(index + 1).padStart(2,"0")}</span><h3>{lang === "en" ? `Which decision best applies to ${section.title.en}?` : `哪项决策最适用于「${section.title.zh}」？`}</h3><small>{section.title[lang === "en" ? "zh" : "en"]}</small><div>{options.map((option, optionIndex) => <button key={optionIndex} disabled={answered} className={cn(answered && optionIndex === correctIndex && "correct", answered && selected === optionIndex && optionIndex !== correctIndex && "wrong")} onClick={() => setCheckpointAnswers(values => ({ ...values, [index]: optionIndex }))}><span>{String.fromCharCode(65 + optionIndex)}</span><b>{option}</b>{answered && optionIndex === correctIndex && <Check size={17} />}{answered && selected === optionIndex && optionIndex !== correctIndex && <X size={17} />}</button>)}</div>{answered && <aside className={selected === correctIndex ? "good" : "bad"}><strong>{selected === correctIndex ? (lang === "en" ? "Correct" : "正确") : (lang === "en" ? `Best answer: ${String.fromCharCode(65 + correctIndex)}` : `最佳答案：${String.fromCharCode(65 + correctIndex)}`)}</strong><p>{section.examCue.en}</p><small>{section.examCue.zh}</small></aside>}</article>})}</div></section>

            <section className="recall-lab"><span className="eyebrow">ACTIVE RECALL LAB</span><h2>{lang === "en" ? "Answer aloud before revealing" : "先口述，再查看答案"}</h2><p>{lang === "en" ? "Retrieval is the study event. Close your notes, produce the answer, then compare and correct." : "主动提取本身就是学习。合上笔记，先说出答案，再对照纠正。"}</p><div>{chapter.recall.map((item, index) => { const isOpen = revealed.includes(index); return <article key={index}><span>Q{index + 1}</span><h3>{tx(item.prompt)}</h3><small>{other(item.prompt)}</small>{isOpen ? <div className="recall-answer"><strong>MODEL ANSWER</strong><p>{item.answer.en}</p><small>{item.answer.zh}</small></div> : <button className="ghost" onClick={() => setRevealed(values => [...values, index])}>{lang === "en" ? "Reveal after answering" : "回答后查看"} <ChevronRight size={15} /></button>}</article>})}</div></section>

            <section className="course-source-note"><BookMarked size={19} /><div><strong>{lang === "en" ? "How this lesson was built" : "本课程如何编写"}</strong><p>{lang === "en" ? "Original instruction aligned to the English fifth-edition chapter and the official CSCS Detailed Content Outline. It teaches and synthesizes the tested concepts without reproducing publisher text or figures. English is the source of truth; Chinese is learning support." : "原创教学内容依据英文第五版章节与官方 CSCS 考试大纲综合编写，不复制出版社原文或插图。英文为唯一事实基准，中文仅作学习辅助。"}</p></div></section>
          </div>

          <footer className="course-footer">
            <button className="ghost" disabled={!previous} onClick={() => previous && onOpenChapter(previous)}><ArrowLeft size={16} /> {lang === "en" ? "Previous chapter" : "上一章"}</button>
            <div><button className="ghost" onClick={onPractice}>{lang === "en" ? "Test this domain" : "测试本领域"}</button><button className="primary" disabled={completed || revealed.length < chapter.recall.length || Object.keys(checkpointAnswers).length < sectionCount} onClick={onComplete}>{completed ? (task ? (lang === "en" ? "Plan item complete" : "计划项已完成") : (lang === "en" ? "Chapter complete" : "章节已完成")) : (task ? (lang === "en" ? "Complete plan item" : "完成计划项") : (lang === "en" ? "Complete chapter" : "完成本章"))} <Check size={16} /></button></div>
            <button className="ghost" disabled={!next} onClick={() => next && onOpenChapter(next)}>{lang === "en" ? "Next chapter" : "下一章"} <ChevronRight size={16} /></button>
          </footer>
        </article>
      </div>
    </div>
  </div>;
}

function Library({ lang, pack, chapters, completed, onOpen }: { lang: Lang; pack: CertificationPack; chapters: CourseChapter[]; completed: string[]; onOpen: (chapter: CourseChapter) => void }) {
  const t = copy[lang];
  const [query, setQuery] = useState("");
  const [flipped, setFlipped] = useState<number[]>([]);
  const filtered = chapters.filter(c => `${c.n}${c.title.en}${c.title.zh}${c.domain.en}${c.domain.zh}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="page-content"><section className="page-intro"><div><span className="eyebrow">FIFTH EDITION MAP · ENGLISH SOURCE OF TRUTH</span><h2>{t.libraryTitle}</h2><p>{t.libraryDesc}</p></div><input className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search} /></section>
    <section className="official-panel"><div className="section-heading"><div><span className="eyebrow">OFFICIAL NSCA CHECK · VERIFIED {pack.verifiedOn}</span><h3>{lang === "en" ? "Current exam facts" : "当前官方考试信息"}</h3></div><div className="official-links">{pack.officialSources.map(s => <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>)}</div></div><div className="official-facts">{pack.officialFacts.map(f => <div key={f.value}><strong>{f.value}</strong><span>{lang === "en" ? f.labelEn : f.labelZh}</span></div>)}</div><p>{lang === "en" ? "Eligibility changes are scheduled for U.S. candidates beginning January 1, 2030. Always recheck the official page before registering." : "美国考生资格要求计划自 2030 年 1 月 1 日起调整。报名前请再次核对官网。"}</p></section>
    <ResearchPulse lang={lang} />
    <section className="library-section"><div className="section-heading"><div><span className="eyebrow">ACTIVE RECALL</span><h3>{t.cards}</h3></div><span className="duration">{t.flip}</span></div><div className="flash-grid">{pack.quickCards.map((card, i) => <button key={card.front} className={cn("flash-card", flipped.includes(i) && "flipped")} onClick={() => setFlipped(f => f.includes(i) ? f.filter(x => x !== i) : [...f, i])}><span>{card.tag}</span><strong>{flipped.includes(i) ? (lang === "en" && card.en ? card.en.back : card.back) : (lang === "en" && card.en ? card.en.front : card.front)}</strong><small>{flipped.includes(i) ? t.back : t.seeAnswer}</small></button>)}</div></section>
    <section className="library-section"><div className="section-heading"><div><span className="eyebrow">FULL COURSE · NOT SUMMARIES</span><h3>{lang === "en" ? "26 complete chapter lessons" : "26 节完整章节课程"}</h3></div><span className="duration">26 {t.chapters}</span></div><div className="chapter-table course-chapter-table">{filtered.map(c => { const done = completed.includes(`course-chapter-${c.n}`); return <button key={c.n} onClick={() => onOpen(c)}><span>{String(c.n).padStart(2,"0")}</span><p><b>{txCourse(c.title, lang)}</b><small>{c.title[lang === "en" ? "zh" : "en"]} · {c.sections.length} deep dives · {c.minutes} min</small></p><em>{txCourse(c.domain, lang)}</em><i>{done ? <Check size={15} /> : <ChevronRight size={16} />}</i></button>})}</div></section>
    <p className="disclaimer">{lang === "en" ? "This is an original, standalone exam-prep course aligned to the English fifth-edition textbook and official DCO. English controls if a translation differs. Publisher text and figures are not reproduced; always verify current eligibility and policy with NSCA." : "这是依据英文第五版教材和官方大纲编写的原创独立备考课程。若翻译有差异，以英文为准；不复制出版社原文或插图。资格与政策请始终向 NSCA 核实。"}</p>
  </div>;
}

function txCourse(value: CourseText, lang: Lang) { return value[lang]; }
