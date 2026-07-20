"use client";

import { useEffect, useState } from "react";
import { ExternalLink, FlaskConical, RefreshCw } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type Lang = "en" | "zh";
type ResearchItem = { id: string; title: string; authors?: string; journal?: string; published_at?: string; source_url: string; summary_en?: string; summary_zh?: string; chapter_numbers?: number[]; curation_status: string };

export function ResearchPulse({ lang }: { lang: Lang }) {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) { queueMicrotask(() => setLoading(false)); return; }
    supabase.from("research_items").select("id,title,authors,journal,published_at,source_url,summary_en,summary_zh,chapter_numbers,curation_status").order("published_at", { ascending: false }).limit(8).then(({ data }) => { setItems((data || []) as ResearchItem[]); setLoading(false); });
  }, []);

  return <section className="research-pulse">
    <div className="research-pulse-heading"><div><span className="eyebrow">DAILY EVIDENCE WATCH · OPEN RESEARCH</span><h3>{lang === "en" ? "What changed outside the textbook" : "教材之外有什么新变化"}</h3><p>{lang === "en" ? "A daily Europe PMC scan finds new strength, conditioning, recovery, and sports-nutrition research. These items enrich practice but do not silently change the exam key." : "系统每天扫描 Europe PMC 的体能、恢复与运动营养研究。这些内容用于拓展实践，不会静默改写考试答案。"}</p></div><span><RefreshCw size={14} /> {lang === "en" ? "Daily 08:17 UTC" : "每日 08:17 UTC"}</span></div>
    {loading ? <div className="research-empty"><RefreshCw size={18} /> {lang === "en" ? "Loading the evidence feed…" : "正在加载研究动态…"}</div> : items.length ? <div className="research-grid">{items.map(item => <article key={item.id}><div><span><FlaskConical size={13} /> {item.curation_status === "approved" ? (lang === "en" ? "Reviewed" : "已审核") : (lang === "en" ? "Research watch" : "研究观察")}</span><small>{item.published_at || "Recent"}</small></div><h4>{item.title}</h4><p>{(lang === "zh" ? item.summary_zh : item.summary_en) || (lang === "en" ? "Source metadata captured. Open the primary record to evaluate methods and results." : "已抓取来源信息；请打开原始记录评估方法与结果。")}</p><footer><span>{item.chapter_numbers?.length ? `Ch. ${item.chapter_numbers.join(", ")}` : item.journal || "Open research"}</span><a href={item.source_url} target="_blank" rel="noreferrer">{lang === "en" ? "Primary record" : "原始记录"} <ExternalLink size={12} /></a></footer></article>)}</div> : <div className="research-empty"><FlaskConical size={19} /><span>{lang === "en" ? "The daily pipeline is ready. The first source-only digest appears after the next scheduled scan." : "每日更新管线已就绪；下次定时扫描后会出现第一批来源摘要。"}</span></div>}
    <p className="research-policy">{lang === "en" ? "Trust order: official NSCA → English 5th edition/DCO → consensus & systematic review → primary study → community lead. AI-drafted questions enter a private review queue before publication." : "信任顺序：NSCA 官方 → 英文第五版/大纲 → 共识与系统综述 → 原始研究 → 社区线索。AI 生成的候选题必须先进入私有审核队列。"}</p>
  </section>;
}
