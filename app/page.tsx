"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Award, BookOpen, BrainCircuit, Check, ChevronRight,
  Layers3, Route, ShieldCheck, Sparkles, Target,
} from "lucide-react";

type Lang = "en" | "zh";

const certification = {
  organization: "National Strength and Conditioning Association (NSCA)",
  name: "Certified Strength and Conditioning Specialist® (CSCS®)",
  route: "/certifications/nsca-cscs",
};

export default function CertificateCatalogPage() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("cert-loop-language-v2");
    if (saved === "en" || saved === "zh") queueMicrotask(() => setLang(saved));
  }, []);

  function chooseLanguage(next: Lang) {
    setLang(next);
    localStorage.setItem("cert-loop-language-v2", next);
  }

  return <main className="catalog-page">
    <header className="catalog-header">
      <Link href="/" className="catalog-brand" aria-label="Cert Loop home"><span>CL</span><div><b>CERT LOOP</b><small>{lang === "en" ? "Certification learning platform" : "认证考试学习平台"}</small></div></Link>
      <nav aria-label={lang === "en" ? "Landing page navigation" : "首页导航"}>
        <a href="#certifications">{lang === "en" ? "Certifications" : "认证项目"}</a>
        <a href="#method">{lang === "en" ? "Learning system" : "学习系统"}</a>
      </nav>
      <div className="catalog-actions"><div className="lang-toggle"><button className={lang === "zh" ? "active" : ""} onClick={() => chooseLanguage("zh")}>{lang === "en" ? "Chinese" : "中"}</button><button className={lang === "en" ? "active" : ""} onClick={() => chooseLanguage("en")}>EN</button></div><a href="#certifications" className="catalog-header-cta">{lang === "en" ? "Choose a certification" : "选择认证"}<ArrowRight size={15}/></a></div>
    </header>

    <section className="catalog-hero">
      <div className="catalog-hero-copy">
        <span className="catalog-kicker"><Sparkles size={14}/>{lang === "en" ? "ONE ACCOUNT · COMPLETE LEARNING PATHS" : "一个账号 · 完整认证学习路径"}</span>
        <h1>{lang === "en" ? <>Prepare for the credential.<br/><i>Own the knowledge.</i></> : <>为认证考试做好准备，<br/><i>真正掌握完整知识。</i></>}</h1>
        <p>{lang === "en" ? "Choose a recognized certification and follow one connected system for lessons, visual learning, practice, review, progress, and exam readiness." : "选择权威认证项目，在同一个系统中完成课程学习、视觉理解、练习测试、错题复习、进度管理与考前准备。"}</p>
        <div><a href="#certifications" className="catalog-primary">{lang === "en" ? "Explore certifications" : "查看认证项目"}<ChevronRight size={17}/></a><span><ShieldCheck size={15}/>{lang === "en" ? "Progress stays with your account" : "学习进度跟随你的账号"}</span></div>
      </div>
      <aside className="catalog-system-card" aria-label={lang === "en" ? "Learning system overview" : "学习系统概览"}>
        <header><span>YOUR LEARNING LOOP</span><b>01 — 05</b></header>
        <ol>
          <li><span><Route/></span><div><b>{lang === "en" ? "Choose your starting point" : "选择学习起点"}</b><small>{lang === "en" ? "Start from zero or take an optional placement test" : "从零开始，或选择参加摸底测试"}</small></div></li>
          <li><span><BookOpen/></span><div><b>{lang === "en" ? "Learn the complete curriculum" : "学习完整课程"}</b><small>{lang === "en" ? "Lessons, illustrations, interactive models, and recall" : "课程、图解、交互模型与主动回忆"}</small></div></li>
          <li><span><Target/></span><div><b>{lang === "en" ? "Practice in exam format" : "按考试形式练习"}</b><small>{lang === "en" ? "Immediate teaching or timed simulation" : "即时讲解或限时模拟"}</small></div></li>
          <li><span><BrainCircuit/></span><div><b>{lang === "en" ? "Repair weak reasoning" : "修复薄弱推理"}</b><small>{lang === "en" ? "Misses return through spaced retrieval" : "错题通过间隔提取反复巩固"}</small></div></li>
          <li><span><Award/></span><div><b>{lang === "en" ? "Reach exam readiness" : "达到考试准备状态"}</b><small>{lang === "en" ? "Track mastery across the full credential" : "追踪整个认证体系的掌握度"}</small></div></li>
        </ol>
      </aside>
    </section>

    <section className="catalog-proof" id="method">
      {[{icon:Layers3,en:"End-to-end curriculum",zh:"端到端完整课程",enBody:"Study plans open into full lessons—not summary cards.",zhBody:"学习计划中的每一项都能打开完整课程，而不是摘要。"},{icon:BrainCircuit,en:"Adaptive when useful",zh:"按需使用自适应",enBody:"Placement is optional. The learning system works from zero without it.",zhBody:"摸底测试完全可选；不参加也能从零开始完整学习。"},{icon:ShieldCheck,en:"Protected personal progress",zh:"受保护的个人进度",enBody:"Your completion, attempts, and review queue stay attached to your account.",zhBody:"完成度、测试记录和错题队列都会保存到个人账号。"}].map(item => { const Icon=item.icon; return <article key={item.en}><Icon/><h2>{lang === "en" ? item.en : item.zh}</h2><p>{lang === "en" ? item.enBody : item.zhBody}</p></article>; })}
    </section>

    <section className="catalog-certifications" id="certifications">
      <header><div><span className="catalog-kicker">CERTIFICATION CATALOG</span><h2>{lang === "en" ? "Choose the credential you are preparing for." : "选择你正在准备的认证项目。"}</h2></div><p>{lang === "en" ? "Each certification is an independent content system with its own curriculum, exam blueprint, questions, and progress." : "每个认证项目都是独立的内容系统，拥有自己的课程、考试大纲、题库和学习进度。"}</p></header>
      <div className="certificate-grid">
        <Link href={certification.route} className="certificate-card available">
          <div className="certificate-seal"><Award size={28}/><span>NSCA</span></div>
          <div className="certificate-copy"><span><i/>{lang === "en" ? "AVAILABLE NOW" : "现已开放"}</span><small>{certification.organization}</small><h3>{certification.name}</h3><p>{lang === "en" ? "A complete Fifth Edition learning path with 26 chapter lessons, visual instruction, exam practice, progress tracking, and an AI tutor." : "基于第五版教材的完整学习路径，包含 26 章课程、视觉教学、考试练习、进度追踪与 AI 导师。"}</p><ul><li><Check/>{lang === "en" ? "26 complete chapter lessons" : "26 章完整课程"}</li><li><Check/>{lang === "en" ? "Official exam-outline alignment" : "对齐官方考试大纲"}</li><li><Check/>{lang === "en" ? "Optional 30-question placement" : "可选 30 题摸底测试"}</li></ul></div>
          <span className="certificate-enter">{lang === "en" ? "Open certification" : "进入认证课程"}<ArrowRight size={17}/></span>
        </Link>
        <article className="certificate-card future"><div className="certificate-seal"><Layers3 size={26}/><span>+</span></div><div className="certificate-copy"><span>{lang === "en" ? "EXPANDING CATALOG" : "持续扩展"}</span><h3>{lang === "en" ? "More professional certifications" : "更多专业认证项目"}</h3><p>{lang === "en" ? "The same learning engine is ready for additional credentials without mixing their content or progress." : "同一套学习引擎可以接入更多认证，同时保持各项目的内容与进度完全独立。"}</p></div><span className="certificate-soon">{lang === "en" ? "More programs will appear here" : "更多项目将在此开放"}</span></article>
      </div>
    </section>

    <footer className="catalog-footer"><div><b>CERT LOOP</b><span>{lang === "en" ? "Complete learning systems for professional credentials." : "面向专业认证的完整学习系统。"}</span></div><a href="#certifications">{lang === "en" ? "View certifications" : "查看认证项目"}<ArrowRight size={14}/></a></footer>
  </main>;
}
