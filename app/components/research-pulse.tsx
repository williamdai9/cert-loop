"use client";

import { useEffect, useState } from "react";
import { ExternalLink, FlaskConical, MessageSquareText, RefreshCw, ShieldCheck } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type Lang = "en" | "zh";
type ResearchItem = { id: string; provider: string; title: string; authors?: string; journal?: string; published_at?: string; source_url: string; summary_en?: string; summary_zh?: string; chapter_numbers?: number[]; curation_status: string };

export function ResearchPulse({ lang }: { lang: Lang }) {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) { queueMicrotask(() => setLoading(false)); return; }
    supabase.from("research_items").select("id,provider,title,authors,journal,published_at,source_url,summary_en,summary_zh,chapter_numbers,curation_status").order("published_at", { ascending: false }).limit(36).then(({ data }) => {
      const all = (data || []) as ResearchItem[];
      const official = all.filter(item => item.provider === "NSCA official").slice(0, 3);
      const community = all.filter(item => item.provider.includes("community lead")).slice(0, 2);
      const research = all.filter(item => item.provider !== "NSCA official" && !item.provider.includes("community lead")).slice(0, 3);
      setItems([...official, ...research, ...community].sort((a, b) => (b.published_at || "").localeCompare(a.published_at || "")));
      setLoading(false);
    });
  }, []);

  return <section className="research-pulse">
    <div className="research-pulse-heading"><div><span className="eyebrow">DAILY WATCH · OFFICIAL · RESEARCH · COMMUNITY</span><h3>{lang === "en" ? "What changed outside the textbook" : "教材之外有什么新变化"}</h3><p>{lang === "en" ? "Every day, Cert Loop checks NSCA's official feed, new open research, and selected coaching-community discussions. Community posts are leads to verify—not evidence and never an exam-key override." : "Cert Loop 每天检查 NSCA 官方动态、最新开放研究与精选教练社区讨论。社区内容只是待核验线索，不是证据，也不会覆盖考试答案。"}</p></div><span><RefreshCw size={14} /> {lang === "en" ? "Daily 08:17 UTC" : "每日 08:17 UTC"}</span></div>
    {loading ? <div className="research-empty"><RefreshCw size={18} /> {lang === "en" ? "Loading the evidence feed…" : "正在加载研究动态…"}</div> : items.length ? <div className="research-grid">{items.map(item => {
      const official = item.provider === "NSCA official";
      const community = item.provider.includes("community lead");
      const SourceIcon = official ? ShieldCheck : community ? MessageSquareText : FlaskConical;
      const label = official ? (lang === "en" ? "NSCA official" : "NSCA 官方") : community ? (lang === "en" ? "Unverified community lead" : "未核验社区线索") : item.curation_status === "approved" ? (lang === "en" ? "Reviewed research" : "已审核研究") : (lang === "en" ? "Research watch" : "研究观察");
      const fallback = community ? (lang === "en" ? "Community discussion captured as a lead. Verify the claim against official guidance and primary research before using it." : "已将社区讨论收录为线索；使用前必须用官方指南和原始研究核验。") : official ? (lang === "en" ? "Official NSCA source captured. Open the article to review its scope and publication context." : "已抓取 NSCA 官方来源；请打开文章核对适用范围和发布背景。") : (lang === "en" ? "Source metadata captured. Open the primary record to evaluate methods and results." : "已抓取来源信息；请打开原始记录评估方法与结果。");
      return <article key={item.id}><div><span><SourceIcon size={13} /> {label}</span><small>{item.published_at || "Recent"}</small></div><h4>{item.title}</h4><p>{(lang === "zh" ? item.summary_zh : item.summary_en) || fallback}</p><footer><span>{item.chapter_numbers?.length ? `Ch. ${item.chapter_numbers.join(", ")}` : item.journal || item.provider}</span><a href={item.source_url} target="_blank" rel="noreferrer">{official ? (lang === "en" ? "Official article" : "官方文章") : community ? (lang === "en" ? "Community thread" : "社区讨论") : (lang === "en" ? "Primary record" : "原始记录")} <ExternalLink size={12} /></a></footer></article>;
    })}</div> : <div className="research-empty"><FlaskConical size={19} /><span>{lang === "en" ? "The daily pipeline is ready. The first source-only digest appears after the next scheduled scan." : "每日更新管线已就绪；下次定时扫描后会出现第一批来源摘要。"}</span></div>}
    <p className="research-policy">{lang === "en" ? "Trust order: official NSCA → English 5th edition/DCO → consensus & systematic review → primary study → community lead. AI-drafted questions enter a private review queue before publication." : "信任顺序：NSCA 官方 → 英文第五版/大纲 → 共识与系统综述 → 原始研究 → 社区线索。AI 生成的候选题必须先进入私有审核队列。"}</p>
  </section>;
}
