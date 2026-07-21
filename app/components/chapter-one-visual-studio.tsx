"use client";

import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Eye, EyeOff, Layers3, RotateCcw } from "lucide-react";

type Lang = "en" | "zh";
type SectionId = "musculoskeletal" | "contraction" | "neuromuscular" | "cardiovascular" | "respiratory";

const copy = <T,>(lang: Lang, en: T, zh: T) => lang === "en" ? en : zh;

export function ChapterOneVisualStudio({ sectionId, lang }: { sectionId: string; lang: Lang }) {
  if (sectionId === "musculoskeletal") return <StructureExplorer lang={lang} />;
  if (sectionId === "contraction") return <ForceProductionStudio lang={lang} scope="contraction" />;
  if (sectionId === "neuromuscular") return <><ForceProductionStudio lang={lang} scope="neuromuscular" /><NeuromuscularBoard lang={lang} /></>;
  if (sectionId === "cardiovascular" || sectionId === "respiratory") return <OxygenTransportLoop lang={lang} initialView={sectionId as SectionId} />;
  return null;
}

function StudioShell({ eyebrow, title, objective, children }: { eyebrow: string; title: string; objective: string; children: React.ReactNode }) {
  return <section className="chapter-visual-studio" aria-label={title}>
    <header><div><span>{eyebrow}</span><h3>{title}</h3><p>{objective}</p></div><em><Layers3 size={17} /> ORIGINAL INTERACTIVE REDRAW</em></header>
    {children}
    <footer><strong>5TH-EDITION CONCEPT COVERAGE</strong><span>Publisher artwork is not reproduced. The relationships are rebuilt as an original learning model.</span></footer>
  </section>;
}

const hierarchy = [
  ["Whole muscle", "整块肌肉"], ["Fascicle", "肌束"], ["Muscle fiber", "肌纤维"],
  ["Myofibril", "肌原纤维"], ["Sarcomere", "肌节"], ["Myofilaments", "肌丝"],
] as const;

function StructureExplorer({ lang }: { lang: Lang }) {
  const [recall, setRecall] = useState(false);
  const [layer, setLayer] = useState<"all" | "connective" | "contractile">("all");
  const [answer, setAnswer] = useState<string | null>(null);
  const connective = layer === "all" || layer === "connective";
  const contractile = layer === "all" || layer === "contractile";

  return <StudioShell eyebrow="FIGURES 1.1-1.7 · STRUCTURE EXPLORER" title={copy(lang, "Zoom from whole muscle to myofilament", "从整块肌肉逐层进入肌丝")} objective={copy(lang, "Toggle tissue layers, hide labels, and explain how force travels from a sarcomere into tendon and bone.", "切换组织层、隐藏标签，并解释力量如何从肌节传到肌腱与骨。") }>
    <div className="visual-studio-controls" aria-label={copy(lang, "Structure explorer controls", "结构探索器控制") }>
      <div role="group" aria-label={copy(lang, "Learning mode", "学习模式") }>
        <button className={!recall ? "active" : ""} onClick={() => setRecall(false)}><Eye size={16} /> {copy(lang, "Learn labels", "学习标签")}</button>
        <button className={recall ? "active" : ""} onClick={() => setRecall(true)}><EyeOff size={16} /> {copy(lang, "Recall mode", "回忆模式")}</button>
      </div>
      <div role="group" aria-label={copy(lang, "Visible layer", "可见组织层") }>
        {(["all", "connective", "contractile"] as const).map(item => <button key={item} className={layer === item ? "active" : ""} onClick={() => setLayer(item)}>{copy(lang, item === "all" ? "All layers" : item === "connective" ? "Connective tissue" : "Contractile tissue", item === "all" ? "全部层" : item === "connective" ? "结缔组织" : "收缩结构")}</button>)}
      </div>
    </div>

    <div className="structure-workspace">
      <div className="structure-stage" role="img" aria-label={copy(lang, "Original nested diagram showing muscle, fascicle, fiber, myofibril, sarcomere, and myofilaments", "原创嵌套图：肌肉、肌束、肌纤维、肌原纤维、肌节与肌丝") }>
        <svg viewBox="0 0 760 330" aria-hidden="true">
          <defs><linearGradient id="muscleFill" x1="0" x2="1"><stop offset="0" stopColor="#7f342d"/><stop offset="1" stopColor="#c46853"/></linearGradient></defs>
          <path className="bone-shape" d="M18 120h62c18 0 27-24 43-24s28 12 28 31-12 31-28 31-25-23-43-23H18z" />
          <path className="tendon-shape" d="M80 113C125 97 142 81 184 76v94c-42-8-59-23-104-35z" />
          <path className="muscle-shape" fill="url(#muscleFill)" d="M170 62C260 15 366 33 423 123c-57 90-163 108-253 61-22-37-22-85 0-122z" />
          {connective && <g className="connective-layer"><path d="M172 70C259 29 356 43 409 123c-53 80-150 94-237 53"/><ellipse cx="282" cy="123" rx="78" ry="48"/><ellipse cx="282" cy="123" rx="52" ry="31"/><text x="218" y="55">EPIMYSIUM</text><text x="243" y="104">PERIMYSIUM</text><text x="260" y="128">ENDOMYSIUM</text></g>}
          {contractile && <g className="contractile-layer"><path d="M345 123H470"/><rect x="455" y="92" width="112" height="62" rx="29"/><path d="M555 123h75"/><rect x="620" y="104" width="108" height="38" rx="18"/><path d="M649 109v28m27-28v28m27-28v28"/><path d="M636 113h86M636 133h86"/></g>}
          <g className="structure-numbers"><circle cx="125" cy="205" r="16"/><text x="125" y="210">1</text><circle cx="281" cy="205" r="16"/><text x="281" y="210">2</text><circle cx="463" cy="205" r="16"/><text x="463" y="210">3</text><circle cx="548" cy="205" r="16"/><text x="548" y="210">4</text><circle cx="644" cy="205" r="16"/><text x="644" y="210">5</text><circle cx="714" cy="205" r="16"/><text x="714" y="210">6</text></g>
          <path className="force-route" d="M716 267H120"/><path className="force-arrow" d="m120 267 15-9v18z"/>
          <text className="force-label" x="333" y="293">FORCE TRANSMISSION TO TENDON / BONE</text>
        </svg>
        <ol className={recall ? "structure-labels recall" : "structure-labels"}>{hierarchy.map((item, index) => <li key={item[0]}><span>{index + 1}</span><b>{recall ? "?" : item[lang === "en" ? 0 : 1]}</b>{lang === "zh" && !recall && <small>{item[0]}</small>}</li>)}</ol>
      </div>

      <aside className="visual-retrieval-card"><span>RETRIEVAL CHECK</span><h4>{copy(lang, "Which connective layer surrounds a fascicle?", "哪一层结缔组织包绕肌束？")}</h4><div>{[["Epimysium","肌外膜"],["Perimysium","肌束膜"],["Endomysium","肌内膜"]].map(([en,zh]) => <button key={en} className={answer === en ? (en === "Perimysium" ? "correct" : "wrong") : ""} onClick={() => setAnswer(en)}>{lang === "en" ? en : zh}</button>)}</div>{answer && <p aria-live="polite"><strong>{answer === "Perimysium" ? copy(lang,"Correct.","正确。") : copy(lang,"Try again.","再试一次。")}</strong> {copy(lang, "Epimysium surrounds the whole muscle; perimysium surrounds fascicles; endomysium surrounds individual fibers.", "肌外膜包绕整块肌肉；肌束膜包绕肌束；肌内膜包绕单条肌纤维。")}</p>}</aside>
    </div>
    <MuscleLandmarkBoard lang={lang} />
  </StudioShell>;
}

const landmarkData = {
  front: [
    ["Deltoid","三角肌","Shoulder abduction","肩外展",62,78], ["Pectoralis major","胸大肌","Horizontal adduction","肩水平内收",100,98],
    ["Biceps brachii","肱二头肌","Elbow flexion / supination","屈肘 / 旋后",53,132], ["Rectus abdominis","腹直肌","Trunk flexion / bracing","躯干屈曲 / 支撑",100,148],
    ["Quadriceps","股四头肌","Knee extension","伸膝",78,245], ["Tibialis anterior","胫骨前肌","Ankle dorsiflexion","踝背屈",80,326],
  ],
  back: [
    ["Trapezius","斜方肌","Scapular elevation / retraction / rotation","肩胛上提 / 后缩 / 旋转",100,82], ["Triceps brachii","肱三头肌","Elbow extension","伸肘",54,132],
    ["Latissimus dorsi","背阔肌","Shoulder extension / adduction","肩伸 / 内收",100,135], ["Gluteus maximus","臀大肌","Hip extension","髋伸",100,205],
    ["Hamstrings","腘绳肌","Knee flexion / hip extension","屈膝 / 髋伸",78,258], ["Gastrocnemius / soleus","腓肠肌 / 比目鱼肌","Plantar flexion","跖屈",80,325],
  ],
} as const;

function MuscleLandmarkBoard({ lang }: { lang: Lang }) {
  const [side, setSide] = useState<"front" | "back">("front");
  const [selected, setSelected] = useState(0);
  const item = landmarkData[side][selected] || landmarkData[side][0];
  return <section className="muscle-landmark-board">
    <header><div><span>FIGURE 1.2 CONCEPT · LANDMARK LAB</span><h4>{copy(lang,"Locate major skeletal muscles","定位主要骨骼肌")}</h4></div><div className="state-buttons"><button className={side === "front" ? "active" : ""} onClick={() => { setSide("front"); setSelected(0); }}>{copy(lang,"Anterior","前面")}</button><button className={side === "back" ? "active" : ""} onClick={() => { setSide("back"); setSelected(0); }}>{copy(lang,"Posterior","后面")}</button></div></header>
    <div><div className="body-map" role="img" aria-label={`${side} body map highlighting ${item[0]}`}><svg viewBox="0 0 200 380" aria-hidden="true"><circle cx="100" cy="35" r="24"/><path d="M76 62Q100 50 124 62l17 90-20 55 9 145h-25l-5-122-5 122H70l9-145-20-55z"/><path d="M72 70 35 170h19l36-80M128 70l37 100h-19l-36-80"/><ellipse className="landmark-highlight" cx={Number(item[4])} cy={Number(item[5])} rx={item[0].includes("Gastro") ? 18 : item[0].includes("Rectus") || item[0].includes("Latissimus") ? 25 : 16} ry={item[0].includes("Quadriceps") || item[0].includes("Hamstrings") ? 34 : 20}/></svg><strong>{item[lang === "en" ? 0 : 1]}</strong><small>{item[lang === "en" ? 2 : 3]}</small></div><div className="landmark-list">{landmarkData[side].map((muscle,index) => <button className={selected === index ? "active" : ""} onClick={() => setSelected(index)} key={muscle[0]}><span>{index + 1}</span><b>{muscle[lang === "en" ? 0 : 1]}</b><small>{muscle[lang === "en" ? 2 : 3]}</small></button>)}</div></div>
  </section>;
}

const couplingSteps = [
  ["Motor-neuron action potential", "运动神经元动作电位"], ["ACh release at the NMJ", "神经肌肉接头释放 ACh"],
  ["End-plate depolarization", "终板去极化"], ["T-tubule signal", "T 管传导信号"],
  ["SR releases Ca2+", "肌浆网释放 Ca2+"], ["Troponin shifts tropomyosin", "肌钙蛋白使原肌球蛋白移位"],
  ["Cross-bridge cycling", "横桥循环"], ["Ca2+ reuptake and relaxation", "Ca2+ 回收并舒张"],
] as const;

const sportDemandOptions = [
  { id:"sprint-100", label:"100 m sprint", typeI:"Low", typeII:"High" },
  { id:"run-800", label:"800 m run", typeI:"High", typeII:"High" },
  { id:"marathon", label:"Marathon", typeI:"High", typeII:"Low" },
  { id:"weightlifting", label:"Olympic weightlifting", typeI:"Low", typeII:"High" },
  { id:"field-sports", label:"Soccer, lacrosse, hockey", typeI:"High", typeII:"High" },
  { id:"football-wr", label:"American football · wide receiver", typeI:"Low", typeII:"High" },
  { id:"football-line", label:"American football · lineman", typeI:"Low", typeII:"High" },
  { id:"court-power", label:"Basketball / team handball", typeI:"Low", typeII:"High" },
  { id:"volleyball", label:"Volleyball", typeI:"Low", typeII:"High" },
  { id:"pitcher", label:"Baseball / softball pitcher", typeI:"Low", typeII:"High" },
  { id:"mma", label:"Mixed martial arts", typeI:"High", typeII:"High" },
  { id:"wrestling", label:"Wrestling", typeI:"High", typeII:"High" },
  { id:"swim-50", label:"50 m swim", typeI:"Low", typeII:"High" },
  { id:"field-events", label:"Field events", typeI:"Low", typeII:"High" },
  { id:"nordic", label:"Cross-country skiing / biathlon", typeI:"High", typeII:"Low" },
  { id:"tennis", label:"Tennis", typeI:"High", typeII:"High" },
  { id:"alpine", label:"Downhill / slalom skiing", typeI:"High", typeII:"High" },
  { id:"speed-skating", label:"Speed skating", typeI:"High", typeII:"High" },
  { id:"bobsled", label:"Bobsled", typeI:"Low", typeII:"High" },
  { id:"distance-cycling", label:"Distance cycling", typeI:"High", typeII:"Low" },
  { id:"rowing", label:"Rowing", typeI:"High", typeII:"High" },
] as const;
type SportDemandId = typeof sportDemandOptions[number]["id"];

function ForceProductionStudio({ lang, scope }: { lang: Lang; scope: "contraction" | "neuromuscular" }) {
  const availableViews = scope === "contraction" ? (["signal","sarcomere"] as const) : (["frequency","recruitment","fibers"] as const);
  const [view, setView] = useState<"signal" | "sarcomere" | "frequency" | "recruitment" | "fibers">(scope === "contraction" ? "signal" : "frequency");
  const [step, setStep] = useState(0);
  const [sarcomereState, setSarcomereState] = useState<"stretched" | "optimal" | "shortened">("optimal");
  const [demand, setDemand] = useState(35);
  const [frequency, setFrequency] = useState(22);
  const [event, setEvent] = useState<SportDemandId>("sprint-100");
  const activeUnits = demand < 40 ? 1 : demand < 75 ? 2 : 3;
  const forcePattern = frequency < 30 ? "Single twitch" : frequency < 55 ? "Twitch summation" : frequency < 80 ? "Unfused tetanus" : "Fused tetanus";
  const sportDemand = sportDemandOptions.find(item => item.id === event) || sportDemandOptions[0];
  const sportMix = [sportDemand.typeI === "High" ? 85 : 22, sportDemand.typeII === "High" ? 85 : 22];

  return <StudioShell eyebrow={scope === "contraction" ? "FIGURES 1.5-1.7 · FORCE PRODUCTION STUDIO" : "FIGURES 1.4, 1.8-1.9 · TABLES 1.1-1.2"} title={copy(lang, scope === "contraction" ? "Turn neural intent into force" : "Control force with firing rate and recruitment", scope === "contraction" ? "把神经意图转化为力量" : "用放电频率与募集控制力量")} objective={copy(lang, scope === "contraction" ? "Step through excitation-contraction coupling and compare sarcomere length states." : "Change firing frequency and force demand, then compare fiber phenotypes and event demands.", scope === "contraction" ? "逐步学习兴奋-收缩耦联，并对比肌节长度状态。" : "改变放电频率与力量需求，再比较纤维表型和项目需求。") }>
    <div className="visual-view-tabs" role="tablist" aria-label={copy(lang,"Force production views","力量产生视图")}>{availableViews.map(item => <button role="tab" aria-selected={view === item} className={view === item ? "active" : ""} key={item} onClick={() => setView(item)}>{copy(lang,item === "signal" ? "Signal" : item === "sarcomere" ? "Sarcomere" : item === "frequency" ? "Firing rate" : item === "recruitment" ? "Recruitment" : "Fiber matrix",item === "signal" ? "信号" : item === "sarcomere" ? "肌节" : item === "frequency" ? "放电频率" : item === "recruitment" ? "募集" : "纤维矩阵")}</button>)}</div>
    {view === "signal" && <div className="signal-studio">
      <div className="signal-path" role="img" aria-label={copy(lang,"Eight-step excitation-contraction pathway","八步兴奋-收缩耦联路径")}>{couplingSteps.map((item,index) => <div className={index < step ? "complete" : index === step ? "active" : ""} key={item[0]}><span>{index + 1}</span><b>{item[lang === "en" ? 0 : 1]}</b>{index < couplingSteps.length - 1 && <i>→</i>}</div>)}</div>
      <div className="sequence-controller"><button aria-label={copy(lang,"Previous step","上一步")} disabled={step === 0} onClick={() => setStep(value => value - 1)}><ChevronLeft /></button><div aria-live="polite"><span>STEP {step + 1} / {couplingSteps.length}</span><strong>{couplingSteps[step][lang === "en" ? 0 : 1]}</strong><small>{copy(lang,"Explain what changes physically before moving on.","进入下一步前，先解释发生了什么物理变化。")}</small></div><button aria-label={copy(lang,"Next step","下一步")} disabled={step === couplingSteps.length - 1} onClick={() => setStep(value => value + 1)}><ChevronRight /></button></div>
    </div>}
    {view === "sarcomere" && <div className="sarcomere-compare">
      <div className="state-buttons" role="group" aria-label={copy(lang,"Sarcomere state","肌节状态")}>{(["stretched","optimal","shortened"] as const).map(item => <button key={item} className={sarcomereState === item ? "active" : ""} onClick={() => setSarcomereState(item)}>{copy(lang,item === "stretched" ? "Overstretched" : item === "optimal" ? "Useful overlap" : "Over-shortened",item === "stretched" ? "过度拉长" : item === "optimal" ? "有效重叠" : "过度缩短")}</button>)}</div>
      <div className={`original-sarcomere ${sarcomereState}`} role="img" aria-label={copy(lang,"Original three-state sarcomere overlap comparison","原创肌节三状态重叠对比")}><span className="zs left"/><span className="zs right"/><i className="thin left"/><i className="thin right"/><b className="thick"/><em className="a-band">A BAND · CONSTANT</em><em className="i-band left">I BAND</em><em className="i-band right">I BAND</em><em className="h-zone">H ZONE</em></div>
      <output className="force-potential"><span>{copy(lang,"Cross-bridge force potential","横桥产力潜力")}</span><strong>{sarcomereState === "optimal" ? copy(lang,"Higher: useful actin-myosin overlap","较高：肌动-肌球蛋白有效重叠") : sarcomereState === "stretched" ? copy(lang,"Lower: too little overlap","较低：重叠不足") : copy(lang,"Lower: filament interference / compression","较低：肌丝干扰与压缩")}</strong></output>
      <ul><li><Check size={15}/>{copy(lang,"A-band length stays constant.","A 带长度保持不变。")}</li><li><Check size={15}/>{copy(lang,"I-bands and H-zone narrow as overlap rises.","重叠增加时，I 带和 H 区变窄。")}</li><li><Check size={15}/>{copy(lang,"Z-lines move closer; filaments do not become shorter.","Z 线靠近；肌丝本身不会缩短。")}</li></ul>
    </div>}
    {view === "frequency" && <div className="frequency-studio"><label><span>{copy(lang,"Motor-neuron firing frequency","运动神经元放电频率")}<b>{frequency}%</b></span><input type="range" min="5" max="100" value={frequency} onChange={event => setFrequency(Number(event.target.value))}/></label><div className={`twitch-chart ${frequency < 30 ? "twitch" : frequency < 55 ? "summation" : frequency < 80 ? "unfused" : "fused"}`} role="img" aria-label={`${forcePattern} force-time teaching curve`}><i/><i/><i/><i/><span>FORCE</span><b>TIME →</b></div><output aria-live="polite"><strong>{forcePattern}</strong><span>{copy(lang,frequency < 30 ? "One stimulus produces one rise and relaxation." : frequency < 55 ? "A new stimulus arrives before full relaxation, so forces add." : frequency < 80 ? "High-frequency stimuli produce oscillating force without full relaxation." : "Very high frequency merges twitches into a sustained force plateau.",frequency < 30 ? "一次刺激产生一次收缩与舒张。" : frequency < 55 ? "完全舒张前再次刺激，力量发生叠加。" : frequency < 80 ? "高频刺激产生波动性强直，无法完全舒张。" : "极高频率使单收缩融合为持续力量平台。")}</span></output></div>}
    {view === "recruitment" && <div className="recruitment-studio"><label><span>{copy(lang,"Force demand","力量需求")}<b>{demand}%</b></span><input type="range" min="5" max="100" value={demand} onChange={event => setDemand(Number(event.target.value))}/></label><div className="motor-unit-mosaic" role="img" aria-label={copy(lang,"Three motor neurons innervating separate mosaic groups of muscle fibers","三个运动神经元分别支配交错分布的肌纤维群")}><svg viewBox="0 0 720 220" aria-hidden="true">{[0,1,2].map(unit => <g className={unit < activeUnits ? "active" : ""} key={unit}><circle className="neuron" cx={85 + unit * 250} cy="38" r={15 + unit * 4}/><path d={`M${85 + unit * 250} 54 Q${140 + unit * 170} 92 ${170 + unit * 145} 120`}/>{[0,1,2,3].map(fiber => <circle className="fiber" key={fiber} cx={145 + unit * 145 + (fiber % 2) * 42} cy={128 + Math.floor(fiber / 2) * 44} r={9 + unit * 2}/>)}</g>)}</svg><span>{copy(lang,"One motor unit = one alpha motor neuron + every muscle fiber it innervates. Fibers from different units form a mosaic.","一个运动单位 = 一个 α 运动神经元 + 它支配的全部肌纤维；不同单位的肌纤维呈交错镶嵌分布。")}</span></div><div className="motor-unit-pool">{[["Type I","Low threshold · fatigue resistant","低阈值 · 抗疲劳"],["Type IIa","Higher force · intermediate fatigue","更高力量 · 中等疲劳"],["Type IIx","Highest threshold · high power","最高阈值 · 高功率"]].map((unit,index) => <article className={index < activeUnits ? "active" : ""} key={unit[0]}><span>MU {index + 1}</span><strong>{unit[0]}</strong><small>{lang === "en" ? unit[1] : unit[2]}</small></article>)}</div><p aria-live="polite">{copy(lang, activeUnits === 1 ? "Low demand: lower-threshold units can meet the task." : activeUnits === 2 ? "Demand rose: additional, higher-threshold units join the active pool." : "High demand or explosive intent: the pool expands to the highest-threshold units.", activeUnits === 1 ? "低需求：低阈值单位即可完成任务。" : activeUnits === 2 ? "需求上升：更多高阈值单位加入募集。" : "高需求或爆发意图：募集扩展到最高阈值单位。")}</p></div>}
    {view === "fibers" && <div className="fiber-studio"><div className="fiber-matrix" role="table" aria-label={copy(lang,"Muscle fiber comparison matrix","肌纤维比较矩阵")}><div role="row"><b role="columnheader">TRAIT</b><b role="columnheader">TYPE I</b><b role="columnheader">TYPE IIa</b><b role="columnheader">TYPE IIx</b></div>{[["Motor neuron size","Small","Large","Large"],["Recruitment threshold","Low","Intermediate / high","High"],["Nerve conduction velocity","Slow","Fast","Fast"],["Contraction speed","Slow","Fast","Fast"],["Relaxation speed","Slow","Fast","Fast"],["Fatigue resistance","High","Intermediate / low","Low"],["Endurance","High","Intermediate / low","Low"],["Force production","Low","Intermediate","High"],["Power output","Low","Intermediate / high","High"],["Aerobic enzyme content","High","Intermediate / low","Low"],["Anaerobic enzyme content","Low","High","High"],["Sarcoplasmic reticulum complexity","Low","Intermediate / high","High"],["Capillary density","High","Intermediate","Low"],["Myoglobin content","High","Low","Low"],["Mitochondrial size and density","High","Intermediate","Low"],["Fiber diameter","Small","Intermediate","Large"],["Color","Red","White / red","White"]].map(row => <div role="row" key={row[0]}>{row.map((cell,index) => <span role="cell" key={`${row[0]}-${index}`} className={index === 0 ? "trait" : ""}>{cell}</span>)}</div>)}</div><div className="sport-predictor"><label>{copy(lang,"Event demand example","项目需求示例")}<select value={event} onChange={change => setEvent(change.target.value as SportDemandId)}>{sportDemandOptions.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label><div><span>TYPE I <i style={{width:`${sportMix[0]}%`}}/><b>{sportDemand.typeI.toUpperCase()}</b></span><span>TYPE II <i style={{width:`${sportMix[1]}%`}}/><b>{sportDemand.typeII.toUpperCase()}</b></span></div><small>{copy(lang,"Relative involvement is a high/low demand category from the fifth-edition comparison—not a fiber percentage or an individual biopsy prediction.","相对参与度来自第五版的高 / 低需求分类，并非肌纤维百分比，也不代表个体活检结果。")}</small></div></div>}
  </StudioShell>;
}

function NeuromuscularBoard({ lang }: { lang: Lang }) {
  const [stretch, setStretch] = useState(35);
  const [selected, setSelected] = useState<"spindle" | "gto">("spindle");
  return <StudioShell eyebrow="FIGURE 1.10 · SENSOR COMPARISON" title={copy(lang,"Muscle spindle versus Golgi tendon organ","肌梭与高尔基腱器官对比")} objective={copy(lang,"Change the stimulus, inspect location and feedback, then choose the receptor from the training scenario.","改变刺激，观察位置与反馈，再从训练情境中选择感受器。") }>
    <div className="sensor-controls"><label><span>{copy(lang,"Length / tension challenge","长度 / 张力刺激")}<b>{stretch}%</b></span><input type="range" min="5" max="100" value={stretch} onChange={event => setStretch(Number(event.target.value))}/></label></div>
    <div className="sensor-board"><button className={selected === "spindle" ? "active" : ""} onClick={() => setSelected("spindle")}><span className="sensor-icon parallel"><i style={{height:`${35 + stretch / 3}%`}}/></span><b>Muscle spindle</b><small>{copy(lang,"Parallel to extrafusal fibers · senses length and rate of stretch · supports stretch reflex","与梭外肌纤维并联 · 感受长度与拉伸速度 · 参与牵张反射")}</small></button><button className={selected === "gto" ? "active" : ""} onClick={() => setSelected("gto")}><span className="sensor-icon series"><i style={{width:`${35 + stretch / 2}%`}}/></span><b>Golgi tendon organ</b><small>{copy(lang,"In series near the musculotendinous junction · senses tension · contributes inhibitory feedback","在肌腱连接处串联 · 感受张力 · 参与抑制性反馈")}</small></button></div>
    <div className="sensor-decision" aria-live="polite"><strong>{selected === "spindle" ? copy(lang,"Rapid unexpected stretch","快速意外拉伸") : copy(lang,"Very high musculotendinous tension","极高肌肉-肌腱张力")}</strong><span>→</span><p>{selected === "spindle" ? copy(lang,"Spindle afferents increase; the reflex response supports contraction of the stretched muscle.","肌梭传入增加；反射反应支持被拉伸肌肉收缩。") : copy(lang,"GTO afferents signal tension; inhibitory circuitry can reduce agonist activation.","GTO 传入报告张力；抑制回路可降低主动肌激活。")}</p></div>
  </StudioShell>;
}

const flowNodes = [
  ["Venae cavae", "上、下腔静脉"], ["Right atrium", "右心房"], ["Tricuspid valve", "三尖瓣"], ["Right ventricle", "右心室"],
  ["Pulmonary valve + artery", "肺动脉瓣与肺动脉"], ["Alveolar capillaries", "肺泡毛细血管"], ["Pulmonary veins", "肺静脉"], ["Left atrium", "左心房"],
  ["Mitral valve", "二尖瓣"], ["Left ventricle", "左心室"], ["Aortic valve", "主动脉瓣"], ["Systemic arteries", "体循环动脉"],
  ["Working muscle", "工作肌肉"], ["Systemic veins", "体循环静脉"],
] as const;

const conductionSteps = [
  ["SA node fires", "窦房结放电", "P wave", "Atrial depolarization"],
  ["Atria depolarize", "心房去极化", "P-R segment", "Impulse approaches AV node"],
  ["AV nodal delay", "房室结延迟", "P-R interval", "Time for ventricular filling"],
  ["Bundle branches + Purkinje", "束支与浦肯野纤维", "QRS complex", "Ventricular depolarization"],
  ["Ventricles recover", "心室恢复", "T wave", "Ventricular repolarization"],
] as const;

function OxygenTransportLoop({ lang, initialView }: { lang: Lang; initialView: SectionId }) {
  const [view, setView] = useState<"flow" | "conduction" | "ventilation" | "gas" | "states">(initialView === "respiratory" ? "ventilation" : "flow");
  const [trace, setTrace] = useState(0);
  const [condition, setCondition] = useState<"rest" | "aerobic" | "resistance">("rest");
  const [gasLayer, setGasLayer] = useState<"ventilation" | "diffusion" | "extraction">("diffusion");
  const [conduction, setConduction] = useState(0);
  const [tidalVolume, setTidalVolume] = useState(500);
  const anatomicalDeadSpace = Math.min(150, Math.round(tidalVolume * .3));
  const physiologicalDeadSpace = Math.round(tidalVolume * .03);
  const alveolarPortion = tidalVolume - anatomicalDeadSpace - physiologicalDeadSpace;
  const stateRows = useMemo(() => ({
    rest: [["HR","baseline"],["SV","baseline"],["Q","baseline"],["SBP","baseline"],["DBP","baseline"],["V̇E","baseline"],["a-vO2","baseline"]],
    aerobic: [["HR","↑"],["SV","↑ then may plateau"],["Q","↑"],["SBP","↑"],["DBP","↔ / slight change"],["V̇E","↑"],["a-vO2","↑"]],
    resistance: [["HR","↑"],["SV","variable"],["Q","↑"],["SBP","large brief ↑"],["DBP","may ↑"],["V̇E","task / breathing dependent"],["a-vO2","↑ in active tissue"]],
  })[condition], [condition]);

  const resetTrace = () => setTrace(0);
  return <StudioShell eyebrow="FIGURES 1.11-1.17 · OXYGEN TRANSPORT LOOP" title={copy(lang,"Trace blood, gases, and the exercise response","追踪血流、气体与运动反应")} objective={copy(lang,"Follow one red blood cell, separate ventilation from diffusion, and compare directional responses without inventing fixed values.","追踪一个红细胞，区分通气与弥散，并用方向性变化比较反应，不虚构固定数值。") }>
    <div className="visual-view-tabs" role="tablist" aria-label={copy(lang,"Oxygen transport views","氧运输视图")}>{(["flow","conduction","ventilation","gas","states"] as const).map(item => <button role="tab" aria-selected={view === item} className={view === item ? "active" : ""} key={item} onClick={() => setView(item)}>{copy(lang,item === "flow" ? "Blood flow" : item === "conduction" ? "Conduction + ECG" : item === "ventilation" ? "Air + tidal volume" : item === "gas" ? "Gas gradients" : "Acute responses",item === "flow" ? "血流" : item === "conduction" ? "传导 + ECG" : item === "ventilation" ? "空气 + 潮气量" : item === "gas" ? "气体梯度" : "急性反应")}</button>)}</div>
    {view === "flow" && <div className="flow-tracer"><div className="flow-loop">{flowNodes.map((node,index) => <button key={node[0]} className={index < trace ? "complete" : index === trace ? "next" : ""} onClick={() => { if (index === trace) setTrace(value => Math.min(flowNodes.length, value + 1)); }} disabled={index !== trace}><span>{index + 1}</span><b>{node[lang === "en" ? 0 : 1]}</b><small>{index === 5 ? "CO2 → alveoli · O2 → blood" : index === 12 ? "O2 → tissue · CO2 → blood" : index < 6 || index === 13 ? "lower O2" : "higher O2"}</small></button>)}</div><div className="trace-status" aria-live="polite">{trace === flowNodes.length ? <><Check/><strong>{copy(lang,"Loop complete. You passed four chambers and four valves before returning through both circulations.","循环完成：经过四个心腔和四个瓣膜，并完成肺循环与体循环。")}</strong><button onClick={resetTrace}><RotateCcw/> {copy(lang,"Trace again","重新追踪")}</button></> : <><span>{trace + 1}</span><p>{copy(lang,"Select the highlighted next station.","点击高亮的下一站。")}</p></>}</div><div className="blood-volume-distribution"><strong>{copy(lang,"Resting blood-volume distribution","静息血容量分布")}</strong>{[["Veins / venules / sinuses",64],["Arteries",13],["Pulmonary circulation",9],["Arterioles + capillaries",7],["Heart",7]].map(item => <span key={String(item[0])}><b>{item[0]}</b><i style={{width:`${Number(item[1])}%`}}/><em>{item[1]}%</em></span>)}</div></div>}
    {view === "conduction" && <div className="conduction-studio"><div className="heart-conduction" role="img" aria-label={copy(lang,"Original heart conduction pathway synchronized with ECG","原创心脏传导与 ECG 同步图")}><div className="heart-outline"><i className={conduction >= 0 ? "active sa" : "sa"}>SA</i><i className={conduction >= 2 ? "active av" : "av"}>AV</i><i className={conduction >= 3 ? "active bundle" : "bundle"}>HIS</i><i className={conduction >= 3 ? "active purkinje" : "purkinje"}>P</i></div><div className="ecg-strip"><span className={conduction === 0 ? "active" : ""}>P</span><span className={conduction >= 1 && conduction <= 2 ? "active" : ""}>P-R</span><span className={conduction === 3 ? "active" : ""}>QRS</span><span className={conduction === 4 ? "active" : ""}>T</span></div></div><div className="sequence-controller"><button aria-label={copy(lang,"Previous conduction step","上一步传导")} disabled={conduction === 0} onClick={() => setConduction(value => value - 1)}><ChevronLeft/></button><div aria-live="polite"><span>STEP {conduction + 1} / 5 · {conductionSteps[conduction][2]}</span><strong>{conductionSteps[conduction][lang === "en" ? 0 : 1]}</strong><small>{conductionSteps[conduction][3]}</small></div><button aria-label={copy(lang,"Next conduction step","下一步传导")} disabled={conduction === 4} onClick={() => setConduction(value => value + 1)}><ChevronRight/></button></div></div>}
    {view === "ventilation" && <div className="ventilation-studio"><div className="air-route" aria-label={copy(lang,"Air route from nose to alveoli","空气从鼻腔到肺泡的路径")}>{[["Nose / mouth","鼻 / 口"],["Pharynx","咽"],["Larynx","喉"],["Trachea","气管"],["Main bronchi","主支气管"],["Bronchioles","细支气管"],["Alveoli","肺泡"]].map((node,index) => <div key={node[0]}><span>{index + 1}</span><b>{node[lang === "en" ? 0 : 1]}</b>{index < 6 && <i>→</i>}</div>)}</div><label className="tidal-control"><span>{copy(lang,"One-breath tidal volume","一次呼吸潮气量")}<b>{tidalVolume} mL</b></span><input type="range" min="300" max="1000" step="10" value={tidalVolume} onChange={event => setTidalVolume(Number(event.target.value))}/></label><div className="tidal-stack" role="img" aria-label={`${tidalVolume} mL tidal volume partition`}><span style={{height:`${alveolarPortion / tidalVolume * 100}%`}}><b>{alveolarPortion} mL</b><small>ALVEOLAR PORTION</small></span><span style={{height:`${anatomicalDeadSpace / tidalVolume * 100}%`}}><b>{anatomicalDeadSpace} mL</b><small>ANATOMICAL DEAD SPACE</small></span><span style={{height:`${physiologicalDeadSpace / tidalVolume * 100}%`}}><b>{physiologicalDeadSpace} mL</b><small>PHYSIOLOGICAL DEAD SPACE</small></span></div><p>{copy(lang,"Teaching partition: deeper breaths usually raise the alveolar portion more than anatomical dead space. Values vary with body size, posture, and physiology.","教学分配模型：加深呼吸通常使肺泡通气部分的增加大于解剖无效腔；数值会随体型、姿势与生理状态变化。")}</p></div>}
    {view === "gas" && <div className="gas-studio"><div className="gas-layer-controls" role="group" aria-label={copy(lang,"Gas transport layer","气体运输层")}>{(["ventilation","diffusion","extraction"] as const).map(item => <button className={gasLayer === item ? "active" : ""} key={item} onClick={() => setGasLayer(item)}>{copy(lang,item === "ventilation" ? "Ventilation" : item === "diffusion" ? "Alveolar diffusion" : "Tissue extraction",item === "ventilation" ? "通气" : item === "diffusion" ? "肺泡弥散" : "组织提取")}</button>)}</div><div className={`gas-canvas ${gasLayer}`} role="img" aria-label={copy(lang,"Original model of ventilation, alveolar diffusion, and tissue extraction","原创通气、肺泡弥散与组织提取模型")}><div className="airway"><span>ROOM AIR</span><i>↓</i><b>ALVEOLI</b></div><div className="alveolus"><span>PO2 105</span><i>PCO2 40</i></div><div className="capillary"><span>VENOUS<br/>40 / 46</span><i>→</i><b>ARTERIAL<br/>100 / 40</b></div><div className="tissue"><b>WORKING MUSCLE</b><span>O2 ↓ into tissue</span><i>CO2 ↑ into blood</i></div></div><p>{copy(lang,gasLayer === "ventilation" ? "Ventilation moves air. It does not by itself equal oxygen consumption." : gasLayer === "diffusion" ? "At rest, higher alveolar PO2 drives O2 into blood; higher venous PCO2 drives CO2 into alveoli." : "Working tissue extracts O2 and adds CO2; local demand helps shape the gradients.",gasLayer === "ventilation" ? "通气负责移动空气，但本身不等于摄氧。" : gasLayer === "diffusion" ? "静息时，较高的肺泡 PO2 推动 O2 入血；较高的静脉 PCO2 推动 CO2 进入肺泡。" : "工作组织提取 O2 并加入 CO2；局部需求帮助形成分压梯度。")}</p></div>}
    {view === "states" && <div className="state-comparison"><div className="state-buttons" role="group" aria-label={copy(lang,"Exercise condition","运动状态")}>{(["rest","aerobic","resistance"] as const).map(item => <button className={condition === item ? "active" : ""} key={item} onClick={() => setCondition(item)}>{copy(lang,item === "rest" ? "Rest" : item === "aerobic" ? "Dynamic aerobic" : "Heavy resistance",item === "rest" ? "静息" : item === "aerobic" ? "动态有氧" : "大重量抗阻")}</button>)}</div><div className="response-grid">{stateRows.map(row => <article key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span></article>)}</div><small>{copy(lang,"Directional teaching model: individual response varies with posture, intensity, breathing, health, and measurement timing.","方向性教学模型：实际反应受姿势、强度、呼吸、健康与测量时点影响。")}</small></div>}
  </StudioShell>;
}
