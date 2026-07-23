"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowRight, Check, Gauge, RotateCcw } from "lucide-react";
import type { CourseChapter } from "@/lib/course";

type Lang = "en" | "zh";

export function ChapterVisualLab({ chapter, lang }: { chapter: CourseChapter; lang: Lang }) {
  const [selectedSection, setSelectedSection] = useState(0);
  const active = chapter.sections[selectedSection] || chapter.sections[0];

  return <section className="visual-lab" aria-label={lang === "en" ? "Interactive chapter lab" : "章节互动实验室"}>
    <div className="visual-lab-heading">
      <div><span className="eyebrow">VISUAL MODEL · INTERACTIVE LAB</span><h2>{lang === "en" ? "See the system, then change it" : "先看懂系统，再改变变量"}</h2><p>{lang === "en" ? "Original diagrams translate the chapter into relationships you can manipulate—not publisher figures." : "原创图解把本章转化为可操作的关系，而不是复制出版社插图。"}</p></div>
      <span className="visual-badge"><Activity size={16} /> {lang === "en" ? "Hands-on" : "可操作"}</span>
    </div>

    <div className="concept-map">
      <div className="concept-core"><small>CHAPTER {String(chapter.n).padStart(2, "0")}</small><strong>{chapter.title[lang]}</strong></div>
      <div className="concept-branches">{chapter.sections.map((section, index) => <button key={section.id} className={selectedSection === index ? "active" : ""} onClick={() => setSelectedSection(index)}><span>{String(index + 1).padStart(2, "0")}</span><b>{section.title[lang]}</b><ArrowRight size={14} /></button>)}</div>
      <aside className="concept-detail"><span className="eyebrow">{lang === "en" ? "SELECTED DECISION" : "当前决策"}</span><h3>{active.title[lang]}</h3><p>{active.decision[lang]}</p><div><Check size={15} /><span>{active.examCue[lang]}</span></div></aside>
    </div>

    <SpecializedLab chapter={chapter} lang={lang} />
  </section>;
}

function SpecializedLab({ chapter, lang }: { chapter: CourseChapter; lang: Lang }) {
  if (chapter.n === 1) return null;
  if (chapter.n === 2) return <TorqueLab lang={lang} />;
  if (chapter.n === 3) return <EnergyLab lang={lang} />;
  if (chapter.n === 9) return <ArousalLab lang={lang} />;
  if (chapter.n === 10) return <HydrationLab lang={lang} />;
  if (chapter.n === 14) return <TestingSequenceLab lang={lang} />;
  if (chapter.n === 18) return <VolumeLab lang={lang} />;
  if (chapter.n === 21) return <HeartRateLab lang={lang} />;
  if (chapter.n === 22) return <PeriodizationLab lang={lang} />;
  if (chapter.n === 24) return <ReadinessLab lang={lang} />;
  return <DecisionLab chapter={chapter} lang={lang} />;
}

function LabShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <div className="special-lab"><div className="special-lab-title"><span><Gauge size={17} /></span><div><strong>{title}</strong><small>{subtitle}</small></div></div>{children}</div>;
}

function TorqueLab({ lang }: { lang: Lang }) {
  const [force, setForce] = useState(200);
  const [arm, setArm] = useState(35);
  const torque = Math.round(force * arm / 100);
  return <LabShell title={lang === "en" ? "Joint torque calculator" : "关节力矩计算器"} subtitle="τ = F × perpendicular moment arm">
    <div className="calculator-grid"><label>{lang === "en" ? "External force" : "外力"}<span><input type="range" min="20" max="500" step="10" value={force} onChange={e => setForce(Number(e.target.value))} /><b>{force} N</b></span></label><label>{lang === "en" ? "Perpendicular moment arm" : "垂直力臂"}<span><input type="range" min="5" max="80" value={arm} onChange={e => setArm(Number(e.target.value))} /><b>{arm} cm</b></span></label><output><small>{lang === "en" ? "External torque" : "外部力矩"}</small><strong>{torque} N·m</strong><p>{lang === "en" ? "Move the load closer to the joint to reduce demand without changing its mass." : "将负荷移近关节，可在不改变质量的情况下降低需求。"}</p></output></div>
  </LabShell>;
}

function EnergyLab({ lang }: { lang: Lang }) {
  const [seconds, setSeconds] = useState(10);
  const phosphagen = Math.max(4, Math.round(86 - seconds * 1.7));
  const oxidative = Math.min(82, Math.round(4 + seconds * 1.15));
  const glycolytic = Math.max(8, 100 - phosphagen - oxidative);
  return <LabShell title={lang === "en" ? "Energy-system continuum" : "供能系统连续谱"} subtitle={lang === "en" ? "All systems contribute; the dominant share changes with duration and intensity." : "所有系统都参与，只是主导比例随持续时间和强度变化。"}>
    <label className="duration-slider"><span>{lang === "en" ? "Maximal effort duration" : "最大强度持续时间"}<b>{seconds}s</b></span><input type="range" min="1" max="75" value={seconds} onChange={e => setSeconds(Number(e.target.value))} /></label>
    <div className="energy-bars"><div style={{ "--bar": `${phosphagen}%` } as React.CSSProperties}><span>ATP-PC</span><i /><b>{phosphagen}%</b></div><div style={{ "--bar": `${glycolytic}%` } as React.CSSProperties}><span>Glycolytic</span><i /><b>{glycolytic}%</b></div><div style={{ "--bar": `${oxidative}%` } as React.CSSProperties}><span>Oxidative</span><i /><b>{oxidative}%</b></div></div><small className="lab-caveat">{lang === "en" ? "Teaching estimate—not a metabolic measurement. Work rate, training status, and recovery change the actual contribution." : "这是教学估算，并非代谢测量；功率、训练状态与恢复会改变实际比例。"}</small>
  </LabShell>;
}

function ArousalLab({ lang }: { lang: Lang }) {
  const [arousal, setArousal] = useState(50);
  const performance = Math.max(5, Math.round(100 - Math.pow((arousal - 55) / 5.2, 2)));
  const zone = arousal < 35 ? (lang === "en" ? "Under-aroused" : "唤醒不足") : arousal > 75 ? (lang === "en" ? "Over-aroused" : "唤醒过高") : (lang === "en" ? "Functional zone" : "功能区间");
  return <LabShell title={lang === "en" ? "Arousal–performance explorer" : "唤醒—表现探索器"} subtitle={lang === "en" ? "The optimal zone depends on the athlete and task." : "最佳区间取决于运动员与任务。"}><label className="duration-slider"><span>{lang === "en" ? "Arousal" : "唤醒水平"}<b>{arousal}%</b></span><input type="range" min="0" max="100" value={arousal} onChange={e => setArousal(Number(e.target.value))} /></label><div className="single-output"><strong>{performance}%</strong><span>{zone}</span><p>{lang === "en" ? "Use breathing and process cues when activation is too high; energizing routines can help when it is too low." : "过高时使用呼吸与过程提示；过低时可用激活性准备流程。"}</p></div></LabShell>;
}

function HydrationLab({ lang }: { lang: Lang }) {
  const [before, setBefore] = useState(80);
  const [after, setAfter] = useState(78.8);
  const [drink, setDrink] = useState(0.5);
  const [minutes, setMinutes] = useState(75);
  const loss = Math.max(0, before - after + drink);
  const rate = loss / (minutes / 60);
  const pct = before ? (before - after) / before * 100 : 0;
  return <LabShell title={lang === "en" ? "Sweat-loss worksheet" : "出汗量工作表"} subtitle={lang === "en" ? "Estimate replacement needs from a standardized training session." : "通过标准化训练估算补液需要。"}><div className="number-inputs"><label>{lang === "en" ? "Pre body mass (kg)" : "训练前体重 (kg)"}<input type="number" step="0.1" value={before} onChange={e => setBefore(Number(e.target.value))} /></label><label>{lang === "en" ? "Post body mass (kg)" : "训练后体重 (kg)"}<input type="number" step="0.1" value={after} onChange={e => setAfter(Number(e.target.value))} /></label><label>{lang === "en" ? "Fluid consumed (L)" : "饮水量 (L)"}<input type="number" step="0.1" value={drink} onChange={e => setDrink(Number(e.target.value))} /></label><label>{lang === "en" ? "Session (min)" : "训练时长 (分钟)"}<input type="number" step="5" value={minutes} onChange={e => setMinutes(Number(e.target.value))} /></label></div><div className="result-row"><output><small>{lang === "en" ? "Estimated sweat loss" : "估算出汗量"}</small><strong>{loss.toFixed(1)} L</strong></output><output><small>{lang === "en" ? "Sweat rate" : "出汗率"}</small><strong>{rate.toFixed(2)} L/h</strong></output><output><small>{lang === "en" ? "Body-mass change" : "体重变化"}</small><strong>{pct.toFixed(1)}%</strong></output></div></LabShell>;
}

function TestingSequenceLab({ lang }: { lang: Lang }) {
  const ordered = ["Nonfatiguing", "Agility", "Max power / strength", "Sprint", "Local muscular endurance", "Fatiguing anaerobic", "Aerobic capacity"];
  const [revealed, setRevealed] = useState(1);
  return <LabShell title={lang === "en" ? "Testing-order simulator" : "测试顺序模拟器"} subtitle={lang === "en" ? "Protect validity by putting the most fatigue-sensitive qualities first." : "把最怕疲劳影响的能力放在前面，以保护效度。"}><div className="sequence-track">{ordered.map((item, index) => <button key={item} className={index < revealed ? "visible" : ""} onClick={() => setRevealed(Math.max(revealed, index + 1))}><span>{index + 1}</span><b>{index < revealed ? item : "?"}</b></button>)}</div><button className="lab-reset" onClick={() => setRevealed(revealed === ordered.length ? 1 : Math.min(ordered.length, revealed + 1))}>{revealed === ordered.length ? <><RotateCcw size={14} /> Reset</> : <>Reveal next <ArrowRight size={14} /></>}</button></LabShell>;
}

function VolumeLab({ lang }: { lang: Lang }) {
  const [sets, setSets] = useState(4), [reps, setReps] = useState(6), [load, setLoad] = useState(100), [sessions, setSessions] = useState(2);
  const volume = sets * reps * load;
  return <LabShell title={lang === "en" ? "Resistance-training dose calculator" : "抗阻训练剂量计算器"} subtitle={lang === "en" ? "Separate intensity, volume, and frequency before judging the program." : "判断计划前，先区分强度、训练量与频率。"}><div className="number-inputs four"><label>Sets<input type="number" min="1" max="12" value={sets} onChange={e => setSets(Number(e.target.value))} /></label><label>Reps<input type="number" min="1" max="30" value={reps} onChange={e => setReps(Number(e.target.value))} /></label><label>Load kg<input type="number" min="1" value={load} onChange={e => setLoad(Number(e.target.value))} /></label><label>Sessions/wk<input type="number" min="1" max="7" value={sessions} onChange={e => setSessions(Number(e.target.value))} /></label></div><div className="result-row"><output><small>{lang === "en" ? "Session volume load" : "单次训练量负荷"}</small><strong>{volume.toLocaleString()} kg</strong></output><output><small>{lang === "en" ? "Weekly volume load" : "每周训练量负荷"}</small><strong>{(volume * sessions).toLocaleString()} kg</strong></output></div></LabShell>;
}

function HeartRateLab({ lang }: { lang: Lang }) {
  const [age, setAge] = useState(24), [rest, setRest] = useState(60), [intensity, setIntensity] = useState(70);
  const max = 220 - age;
  const target = Math.round((max - rest) * intensity / 100 + rest);
  return <LabShell title={lang === "en" ? "Karvonen target-HR calculator" : "Karvonen 目标心率计算器"} subtitle="Target HR = (HRmax − HRrest) × intensity + HRrest"><div className="number-inputs"><label>{lang === "en" ? "Age" : "年龄"}<input type="number" min="12" max="90" value={age} onChange={e => setAge(Number(e.target.value))} /></label><label>{lang === "en" ? "Resting HR" : "静息心率"}<input type="number" min="35" max="120" value={rest} onChange={e => setRest(Number(e.target.value))} /></label><label>{lang === "en" ? "Intensity %HRR" : "强度 %HRR"}<input type="number" min="40" max="95" value={intensity} onChange={e => setIntensity(Number(e.target.value))} /></label></div><div className="single-output"><strong>{target} bpm</strong><span>{lang === "en" ? `Estimated HRmax ${max} bpm` : `估算最大心率 ${max} bpm`}</span><p>{lang === "en" ? "A field estimate guides prescription; symptoms, environment, medication, and the athlete's response still govern decisions." : "现场估算用于指导处方；症状、环境、药物与个体反应仍决定实际调整。"}</p></div></LabShell>;
}

function PeriodizationLab({ lang }: { lang: Lang }) {
  const [phase, setPhase] = useState(0);
  const phases = [
    { en: "Accumulation", zh: "积累期", load: "65–75%", volume: "High", aim: "Work capacity / hypertrophy" },
    { en: "Strength", zh: "力量期", load: "80–90%", volume: "Moderate", aim: "Maximal strength" },
    { en: "Power", zh: "功率期", load: "Goal-dependent", volume: "Low–moderate", aim: "High-quality velocity" },
    { en: "Competition / taper", zh: "比赛 / 减量期", load: "Maintain key intensity", volume: "Low", aim: "Express fitness, reduce fatigue" },
  ];
  const item = phases[phase];
  return <LabShell title={lang === "en" ? "Phase sequencing board" : "阶段排序面板"} subtitle={lang === "en" ? "Adaptation is cumulative; phase goals constrain the next training dose." : "适应具有累积性，阶段目标会约束下一阶段剂量。"}><div className="phase-timeline">{phases.map((entry, index) => <button key={entry.en} className={index === phase ? "active" : ""} onClick={() => setPhase(index)}><span>0{index + 1}</span><b>{entry[lang]}</b></button>)}</div><div className="phase-detail"><strong>{item[lang]}</strong><span><b>{lang === "en" ? "Load" : "负荷"}</b>{item.load}</span><span><b>{lang === "en" ? "Volume" : "训练量"}</b>{item.volume}</span><span><b>{lang === "en" ? "Primary aim" : "主要目标"}</b>{item.aim}</span></div></LabShell>;
}

function ReadinessLab({ lang }: { lang: Lang }) {
  const [sleep, setSleep] = useState(4), [soreness, setSoreness] = useState(2), [mood, setMood] = useState(4), [performance, setPerformance] = useState(4);
  const score = Math.round(((sleep + (6 - soreness) + mood + performance) / 20) * 100);
  const action = score >= 80 ? (lang === "en" ? "Proceed; monitor warm-up quality" : "按计划进行，并观察热身质量") : score >= 60 ? (lang === "en" ? "Keep intensity; trim optional volume" : "保留强度，减少可选训练量") : (lang === "en" ? "Investigate; regress today's dose" : "进一步排查，并降低当日剂量");
  return <LabShell title={lang === "en" ? "Readiness decision lab" : "准备度决策实验室"} subtitle={lang === "en" ? "A trend plus context is stronger than a single score." : "趋势加情境比单次分数更可靠。"}><div className="readiness-controls">{[["Sleep", sleep, setSleep], ["Soreness", soreness, setSoreness], ["Mood", mood, setMood], ["Warm-up performance", performance, setPerformance]].map(([label, value, setter]) => <label key={String(label)}><span>{String(label)} <b>{Number(value)}/5</b></span><input type="range" min="1" max="5" value={Number(value)} onChange={e => (setter as (n:number)=>void)(Number(e.target.value))} /></label>)}</div><div className="single-output"><strong>{score}%</strong><span>{lang === "en" ? "Composite readiness" : "综合准备度"}</span><p>{action}</p></div></LabShell>;
}

function DecisionLab({ chapter, lang }: { chapter: CourseChapter; lang: Lang }) {
  const [choice, setChoice] = useState(0);
  const scenario = useMemo(() => chapter.sections[choice % chapter.sections.length], [chapter, choice]);
  return <LabShell title={lang === "en" ? "Coach's decision explorer" : "教练决策探索器"} subtitle={lang === "en" ? "Move from observed problem → governing concept → defensible action." : "从观察到的问题，经核心原理，走向可辩护的行动。"}><div className="decision-explorer"><div><span>1 · {lang === "en" ? "OBSERVE" : "观察"}</span><p>{scenario.examCue[lang]}</p></div><ArrowRight size={18} /><div><span>2 · {lang === "en" ? "INTERPRET" : "解释"}</span><p>{scenario.title[lang]}</p></div><ArrowRight size={18} /><div><span>3 · {lang === "en" ? "ACT" : "行动"}</span><p>{scenario.decision[lang]}</p></div></div><button className="lab-reset" onClick={() => setChoice(value => (value + 1) % chapter.sections.length)}>{lang === "en" ? "Try another scenario" : "换一个情境"} <ArrowRight size={14} /></button></LabShell>;
}
