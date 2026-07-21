import type { CourseText } from "./course";

export type CourseMedia = {
  mindMap?: {
    path: string;
    title: CourseText;
    caption: CourseText;
    outline: CourseText[];
  };
  noteFigures?: Array<{
    path: string;
    sectionId: string;
    title: CourseText;
    caption: CourseText;
    alt: CourseText;
  }>;
  textbookAtlas: Array<{
    title: CourseText;
    relationship: CourseText;
    steps: CourseText[];
  }>;
};

const t = (en: string, zh: string): CourseText => ({ en, zh });

const map = (path: string, en: string, zh: string, outline: CourseText[]) => ({
  path,
  title: t(en, zh),
  caption: t(
    "Personal study map supplied by the learner. Use it for retrieval after completing the lesson, and verify any conflicting wording against the fifth edition.",
    "学习者提供的个人思维导图。请先学习英文主课程，再用它主动回忆；如有冲突，以第五版英文内容为准。",
  ),
  outline,
});

export const courseMedia: Record<number, CourseMedia> = {
  1: {
    mindMap: map("mind-maps/ch01-body-systems.jpg", "Body systems — personal mind map", "身体系统——个人思维导图", [
      t("Musculoskeletal hierarchy and tissue roles", "肌骨层级与组织作用"),
      t("Neural activation and muscle contraction", "神经激活与肌肉收缩"),
      t("Cardiovascular flow and respiratory exchange", "心血管血流与呼吸交换"),
    ]),
    noteFigures: [
      { path: "chapter-01/skeleton.jpg", sectionId: "musculoskeletal", title: t("Axial and appendicular skeleton", "中轴骨骼与附肢骨骼"), caption: t("Use the anterior/posterior views to locate landmarks, then hide the labels and retrieve them aloud.", "用前后视图定位骨性标志，然后遮住标签口述回忆。"), alt: t("Labeled anterior and posterior human skeleton", "带标注的人体骨骼前后视图") },
      { path: "chapter-01/joints.jpg", sectionId: "musculoskeletal", title: t("Synovial joint families", "滑膜关节类型"), caption: t("Connect joint shape to available degrees of freedom and common training actions.", "把关节形态与自由度及常见训练动作联系起来。"), alt: t("Examples of major joint classifications", "主要关节分类示例") },
      { path: "chapter-01/muscle-hierarchy.png", sectionId: "musculoskeletal", title: t("From whole muscle to myofilament", "从整块肌肉到肌丝"), caption: t("Follow the nesting: muscle → fascicle → fiber → myofibril → sarcomere → filaments.", "按层级学习：肌肉 → 肌束 → 肌纤维 → 肌原纤维 → 肌节 → 肌丝。"), alt: t("Muscle structural hierarchy", "肌肉结构层级") },
      { path: "chapter-01/muscle-fiber.jpg", sectionId: "contraction", title: t("Muscle fiber and myofibrils", "肌纤维与肌原纤维"), caption: t("Locate the sarcolemma, nuclei, myofibrils, and repeating sarcomeres before studying force production.", "学习产力前，先定位肌膜、细胞核、肌原纤维与重复肌节。"), alt: t("Cross-section and longitudinal view of a muscle fiber", "肌纤维横截面与纵向结构") },
      { path: "chapter-01/sliding-filament.jpg", sectionId: "contraction", title: t("Sliding-filament comparison", "滑行肌丝对比"), caption: t("During shortening, Z-lines approach and the I band and H zone narrow; the A band stays constant.", "缩短时 Z 线靠近、I 带与 H 区变窄；A 带长度保持不变。"), alt: t("Relaxed and contracted sarcomere comparison", "放松与收缩肌节对比") },
      { path: "chapter-01/contraction-phases.png", sectionId: "contraction", title: t("Cross-bridge cycle", "横桥循环"), caption: t("Trace ATP binding, detachment, hydrolysis, cross-bridge formation, and the power stroke as a causal loop.", "把 ATP 结合、解离、水解、横桥形成与动力冲程作为因果循环学习。"), alt: t("Phases of the actin-myosin cross-bridge cycle", "肌动蛋白与肌球蛋白横桥循环阶段") },
      { path: "chapter-01/neuromuscular-junction.png", sectionId: "neuromuscular", title: t("Neuromuscular junction", "神经肌肉接头"), caption: t("Link acetylcholine release to end-plate depolarization, T-tubule signaling, and calcium release.", "把乙酰胆碱释放与终板去极化、T 管信号和钙释放连成一条链。"), alt: t("Neuromuscular junction anatomy and signaling", "神经肌肉接头结构与信号传递") },
    ],
    textbookAtlas: [
      { title: t("Muscle organization", "肌肉组织层级"), relationship: t("Structure constrains force transmission", "结构决定力量传递"), steps: [t("Whole muscle", "整块肌肉"), t("Fascicle", "肌束"), t("Fiber", "肌纤维"), t("Myofibril", "肌原纤维"), t("Sarcomere", "肌节")] },
      { title: t("Excitation–contraction coupling", "兴奋—收缩耦联"), relationship: t("Electrical signal becomes mechanical force", "电信号转化为机械力"), steps: [t("Motor neuron", "运动神经元"), t("ACh and action potential", "ACh 与动作电位"), t("Ca²⁺ release", "Ca²⁺ 释放"), t("Cross-bridge cycling", "横桥循环"), t("Force", "力量")] },
      { title: t("Cardiopulmonary oxygen pathway", "心肺氧运输路径"), relationship: t("Ventilation + circulation + extraction", "通气 + 循环 + 提取"), steps: [t("Alveoli", "肺泡"), t("Left heart", "左心"), t("Arterial blood", "动脉血"), t("Working muscle", "工作肌肉"), t("Venous return", "静脉回流")] },
    ],
  },
  2: { mindMap: map("mind-maps/ch02-biomechanics.jpg", "Resistance-exercise biomechanics — personal mind map", "抗阻运动生物力学——个人思维导图", [t("Planes, axes, and joint actions", "平面、轴与关节动作"), t("Force, torque, and lever arms", "力、力矩与力臂"), t("Work, power, impulse, and resistance profiles", "功、功率、冲量与阻力曲线")]), textbookAtlas: [
    { title:t("Plane–axis pairing","平面—轴配对"),relationship:t("Movement occurs in a plane around its perpendicular axis","动作发生在平面内并绕垂直轴旋转"),steps:[t("Sagittal / mediolateral","矢状面 / 左右轴"),t("Frontal / anteroposterior","额状面 / 前后轴"),t("Transverse / longitudinal","水平面 / 垂直轴")] },
    { title:t("External torque","外部力矩"),relationship:t("Torque changes with force and perpendicular distance","力矩随力和垂直距离变化"),steps:[t("Joint axis","关节轴"),t("Moment arm","力臂"),t("External force","外力"),t("Muscular response","肌肉应对")] },
  ]},
  3: { mindMap: map("mind-maps/ch03-bioenergetics.jpg", "Exercise bioenergetics — personal mind map", "运动生物能量——个人思维导图", [t("ATP resynthesis systems", "ATP 再合成系统"), t("Intensity–duration continuum", "强度—持续时间连续谱"), t("Recovery and substrate restoration", "恢复与底物补充")]), textbookAtlas: [
    {title:t("Energy-system continuum","供能系统连续谱"),relationship:t("All systems contribute; dominance shifts","所有系统均参与，主导比例会变化"),steps:[t("Phosphagen","磷酸原"),t("Fast glycolysis","快速糖酵解"),t("Oxidative metabolism","氧化代谢")]},
    {title:t("Lactate shuttle","乳酸穿梭"),relationship:t("Lactate is a transportable fuel and signal","乳酸是可运输燃料与信号"),steps:[t("Production","生成"),t("Transport","转运"),t("Oxidation or gluconeogenesis","氧化或糖异生")]},
  ]},
  4: { mindMap: map("mind-maps/ch04-endocrine.jpg", "Endocrine response — personal mind map", "内分泌反应——个人思维导图", [t("Hormone classes and receptors", "激素分类与受体"),t("Acute resistance-exercise response", "抗阻运动急性反应"),t("Chronic adaptation and context", "长期适应与情境")]), textbookAtlas:[
    {title:t("Hormonal signaling","激素信号"),relationship:t("Stimulus → gland → hormone → receptor → response","刺激 → 腺体 → 激素 → 受体 → 反应"),steps:[t("Training stress","训练刺激"),t("Secretion","分泌"),t("Transport","运输"),t("Target-cell receptor","靶细胞受体"),t("Cellular response","细胞反应")]},
  ]},
  5: { mindMap: map("mind-maps/ch05-anaerobic-adaptations.jpg", "Anaerobic adaptations — personal mind map", "无氧适应——个人思维导图", [t("Neural and muscular adaptation", "神经与肌肉适应"),t("Connective tissue and bone", "结缔组织与骨"),t("Detraining and interference", "停训与干扰效应")]), textbookAtlas:[
    {title:t("Adaptation timeline","适应时间线"),relationship:t("Neural changes precede much hypertrophy","神经变化早于多数肌肥大"),steps:[t("Technique and neural drive","技术与神经驱动"),t("Hypertrophy","肌肥大"),t("Tendon and bone remodeling","肌腱与骨重塑")]},
  ]},
  6: { mindMap: map("mind-maps/ch06-aerobic-adaptations.jpg", "Aerobic adaptations — shared personal map", "有氧适应——共享个人思维导图", [t("Central cardiovascular changes", "中枢心血管变化"),t("Peripheral muscular changes", "外周肌肉变化"),t("Performance, heat, and detraining", "表现、热适应与停训")]), textbookAtlas:[
    {title:t("Fick adaptation map","Fick 适应图"),relationship:t("VO₂ = cardiac output × extraction","VO₂ = 心输出量 × 氧提取"),steps:[t("Stroke volume","每搏输出量"),t("Blood volume","血容量"),t("Capillaries and mitochondria","毛细血管与线粒体"),t("Higher VO₂ capacity","更高摄氧能力")]},
  ]},
  7: { mindMap: map("mind-maps/ch06-aerobic-adaptations.jpg", "Age-related adaptation — shared personal map", "年龄相关适应——共享个人思维导图", [t("Growth and maturation", "生长与成熟"),t("Youth safety and coaching", "青少年安全与教学"),t("Aging physiology and trainability", "衰老生理与可训练性")]), textbookAtlas:[
    {title:t("Lifespan coaching","全生命周期训练"),relationship:t("Chronological age does not equal biological readiness","实际年龄不等于生物成熟度"),steps:[t("Assess maturity and skill","评估成熟与技能"),t("Scale technique and load","调整技术与负荷"),t("Monitor response","监测反应"),t("Progress individually","个体化进阶")]},
  ]},
  8: { mindMap: map("mind-maps/ch06-aerobic-adaptations.jpg", "Sex-related considerations — shared personal map", "性别相关考量——共享个人思维导图", [t("Body size and absolute performance", "体型与绝对表现"),t("Relative adaptation to training", "相对训练适应"),t("Energy availability and injury context", "能量可用性与伤病情境")]), textbookAtlas:[
    {title:t("Individual-first decision","个体优先决策"),relationship:t("Population averages do not prescribe an individual","群体平均不能直接决定个人处方"),steps:[t("Needs analysis","需求分析"),t("Health and training history","健康与训练史"),t("Performance data","表现数据"),t("Individual program","个体计划")]},
  ]},
  9: { mindMap: map("mind-maps/ch09-psychology.jpg", "Performance psychology — personal mind map", "运动表现心理学——个人思维导图", [t("Arousal, anxiety, and attention", "唤醒、焦虑与注意"),t("Motivation, confidence, and goals", "动机、信心与目标"),t("Mental health recognition and referral", "心理健康识别与转介")]), textbookAtlas:[
    {title:t("Performance-state regulation","表现状态调节"),relationship:t("Person × task × environment","个体 × 任务 × 环境"),steps:[t("Observe state","观察状态"),t("Select breathing/cue/routine","选择呼吸/提示/流程"),t("Execute task","执行任务"),t("Debrief and learn","复盘学习")]},
  ]},
  10: { mindMap: map("mind-maps/ch10-nutrition-basics.jpg", "Nutrition foundations — personal mind map", "基础营养——个人思维导图", [t("Energy balance and macronutrients", "能量平衡与宏量营养"),t("Micronutrients and risk", "微量营养与风险"),t("Hydration and scope of practice", "补水与执业范围")]), textbookAtlas:[
    {title:t("Energy availability","能量可用性"),relationship:t("Intake − exercise expenditure supports body function","摄入 − 运动消耗用于维持身体功能"),steps:[t("Energy intake","能量摄入"),t("Exercise expenditure","运动消耗"),t("Physiological availability","生理可用能量"),t("Health and adaptation","健康与适应")]},
  ]},
  11: { mindMap: map("mind-maps/ch11-performance-nutrition.jpg", "Performance nutrition — personal mind map", "运动表现营养——个人思维导图", [t("Pre-, during-, and postexercise fueling", "运动前、中、后补给"),t("Hydration and sodium planning", "补水与钠计划"),t("Body composition, RED-S, and referral", "身体成分、RED-S 与转介")]), textbookAtlas:[
    {title:t("Competition fueling timeline","比赛补给时间线"),relationship:t("Timing changes the priority, not the physiology","时间改变优先级，不改变基本生理"),steps:[t("Build stores","建立储备"),t("Start fueled and comfortable","有储备且舒适地开始"),t("Maintain output","维持输出"),t("Restore for next demand","为下一次需求恢复")]},
  ]},
  12: { textbookAtlas:[
    {title:t("Supplement decision gate","补剂决策门"),relationship:t("Need → evidence → dose → safety → rules","需求 → 证据 → 剂量 → 安全 → 规则"),steps:[t("Define the performance problem","定义表现问题"),t("Check independent evidence","核查独立证据"),t("Verify dose and interactions","确认剂量与相互作用"),t("Use third-party testing","使用第三方检测"),t("Monitor response","监测反应")]},
    {title:t("Risk hierarchy","风险层级"),relationship:t("A benefit claim never cancels health or anti-doping risk","效果宣称不能抵消健康或反兴奋剂风险"),steps:[t("Food-first foundation","食物优先基础"),t("Evidence-supported aid","有证据助力"),t("Unsupported product","证据不足产品"),t("Prohibited/harmful method","禁用或有害方法")]},
  ]},
  13: { mindMap: map("mind-maps/ch13-test-selection.jpg", "Test selection and administration — personal mind map", "测试选择与实施——个人思维导图", [t("Purpose and decision utility", "目的与决策价值"),t("Validity, reliability, and sensitivity", "效度、信度与敏感性"),t("Standardization and test order", "标准化与测试顺序")]), textbookAtlas:[
    {title:t("Test-selection funnel","测试选择漏斗"),relationship:t("A useful test must be valid, reliable, feasible, and actionable","有用测试必须有效、可靠、可行且能指导行动"),steps:[t("Question","问题"),t("Construct","能力构念"),t("Protocol","方案"),t("Quality check","质量检查"),t("Decision","决策")]},
  ]},
  14: { mindMap: map("mind-maps/ch14-test-administration.jpg", "Scoring and interpretation — personal mind map", "测试评分与解读——个人思维导图", [t("Anthropometry and body composition", "人体测量与身体成分"),t("Strength, power, speed, and capacity tests", "力量、功率、速度与能力测试"),t("Statistics and communication", "统计与沟通")]), textbookAtlas:[
    {title:t("From raw score to decision","从原始分数到决策"),relationship:t("Quality-controlled measurement precedes interpretation","先保证测量质量，再做解释"),steps:[t("Standardize","标准化"),t("Score","评分"),t("Compare","比较"),t("Estimate meaningful change","估计有意义变化"),t("Communicate","沟通")]},
  ]},
  15: { mindMap: map("mind-maps/ch15-warmup-flexibility.jpg", "Performance preparation — personal mind map", "运动准备——个人思维导图", [t("RAMP sequence", "RAMP 顺序"),t("Mobility, flexibility, and stability", "灵活性、柔韧性与稳定性"),t("Stretching methods and timing", "拉伸方法与时机")]), textbookAtlas:[
    {title:t("RAMP warm-up","RAMP 热身"),relationship:t("Progress from general readiness to task specificity","从一般准备逐步走向专项"),steps:[t("Raise","Raise 提升"),t("Activate","Activate 激活"),t("Mobilize","Mobilize 活动"),t("Potentiate","Potentiate 增效")]},
  ]},
  16: { mindMap: map("mind-maps/ch17-nontraditional-training.jpg", "Free-weight technique — shared personal map", "自由重量技术——共享个人思维导图", [t("Setup, grip, and breathing", "设置、握法与呼吸"),t("Squat, press, pull, and weightlifting patterns", "深蹲、推、拉与举重模式"),t("Spotting and failed-repetition safety", "保护与失败重复安全")]), textbookAtlas:[
    {title:t("Technique observation loop","技术观察循环"),relationship:t("Setup → movement → outcome → one priority cue","设置 → 动作 → 结果 → 一个优先提示"),steps:[t("Create stable setup","建立稳定设置"),t("Observe from useful angles","从有效角度观察"),t("Identify primary fault","识别主要错误"),t("Cue and retest","提示并复测")]},
  ]},
  17: { mindMap: map("mind-maps/ch17-nontraditional-training.jpg", "Alternative-mode technique — shared personal map", "替代训练技术——共享个人思维导图", [t("Bodyweight, suspension, and stability", "自重、悬吊与稳定"),t("Variable and flywheel resistance", "可变阻力与飞轮"),t("Sled, rope, kettlebell, and medicine-ball decisions", "雪橇、战绳、壶铃与药球决策")]), textbookAtlas:[
    {title:t("Implement selection","器械选择"),relationship:t("Choose the tool only after defining the adaptation","先定义适应，再选择工具"),steps:[t("Training goal","训练目标"),t("Movement and force demand","动作与力需求"),t("Athlete skill and risk","运动员技能与风险"),t("Dose and progression","剂量与进阶")]},
  ]},
  18: { mindMap: map("mind-maps/ch18-resistance-programming.jpg", "Resistance-program design — personal mind map", "抗阻训练计划设计——个人思维导图", [t("Needs analysis and goal hierarchy", "需求分析与目标层级"),t("Exercise, order, frequency, load, and volume", "动作、顺序、频率、负荷与训练量"),t("Progression and monitoring", "进阶与监测")]), textbookAtlas:[
    {title:t("Program-design sequence","计划设计顺序"),relationship:t("Each variable must serve the needs analysis","每个变量都必须服务于需求分析"),steps:[t("Needs analysis","需求分析"),t("Exercise selection/order","动作选择/顺序"),t("Frequency","频率"),t("Load and volume","负荷与训练量"),t("Rest and progression","休息与进阶")]},
  ]},
  19: { mindMap: map("mind-maps/ch19-plyometrics.jpg", "Plyometric design — shared personal map", "增强式训练设计——共享个人思维导图", [t("Stretch-shortening cycle", "拉伸—缩短周期"),t("Landing and exercise progression", "落地与动作进阶"),t("Frequency, volume, intensity, and recovery", "频率、容量、强度与恢复")]), textbookAtlas:[
    {title:t("SSC sequence","SSC 顺序"),relationship:t("A short amortization preserves elastic and reflex contribution","短转换期保留弹性能与反射贡献"),steps:[t("Eccentric preload","离心预拉伸"),t("Amortization","转换期"),t("Concentric takeoff","向心起跳"),t("Controlled landing","受控落地")]},
  ]},
  20: { mindMap: map("mind-maps/ch19-plyometrics.jpg", "Speed and agility — shared personal map", "速度与敏捷——共享个人思维导图", [t("Acceleration and maximum velocity", "加速与最大速度"),t("Deceleration and change of direction", "减速与变向"),t("Reactive agility and practice design", "反应敏捷与练习设计")]), textbookAtlas:[
    {title:t("Sprint-to-agility continuum","冲刺—敏捷连续谱"),relationship:t("Closed skill becomes open decision-making","封闭技能逐步转向开放决策"),steps:[t("Posture and projection","姿势与投射"),t("Acceleration","加速"),t("Max velocity","最大速度"),t("Deceleration/COD","减速/变向"),t("Perception-action agility","知觉—动作敏捷")]},
  ]},
  21: { mindMap: map("mind-maps/ch21-aerobic-programming.jpg", "Aerobic-endurance design — personal mind map", "有氧耐力设计——个人思维导图", [t("Mode, frequency, intensity, and duration", "方式、频率、强度与时长"),t("Continuous and interval methods", "持续与间歇方法"),t("Progression, taper, and environment", "进阶、减量与环境")]), textbookAtlas:[
    {title:t("Aerobic prescription","有氧处方"),relationship:t("Mode + frequency + intensity + duration + progression","方式 + 频率 + 强度 + 时长 + 进阶"),steps:[t("Needs analysis","需求分析"),t("Select intensity metric","选择强度指标"),t("Choose session method","选择训练方法"),t("Track response","追踪反应"),t("Progress one constraint","推进一个限制因素")]},
  ]},
  22: { mindMap: map("mind-maps/ch22-periodization.jpg", "Periodization — personal mind map", "周期化——个人思维导图", [t("Macro-, meso-, and microcycles", "大、中、小周期"),t("Preparatory, competitive, and transition phases", "准备、比赛与过渡阶段"),t("Variation, peaking, and tapering", "变式、巅峰与减量")]), textbookAtlas:[
    {title:t("Annual-plan hierarchy","年度计划层级"),relationship:t("Long-term goals constrain short-term training","长期目标约束短期训练"),steps:[t("Annual plan","年度计划"),t("Phase/mesocycle","阶段/中周期"),t("Microcycle","小周期"),t("Session","单次训练"),t("Exercise dose","动作剂量")]},
  ]},
  23: { mindMap: map("mind-maps/ch24-recovery.jpg", "Rehabilitation and reconditioning — personal mind map", "康复与再训练——个人思维导图", [t("Interdisciplinary roles and scope", "跨专业角色与边界"),t("Tissue-healing phases and training goals", "组织愈合阶段与训练目标"),t("Criteria-based return to sport", "基于标准的重返运动")]), textbookAtlas:[
    {title:t("Return-to-performance continuum","重返表现连续谱"),relationship:t("Time is necessary; criteria determine progression","时间是必要条件，标准决定进阶"),steps:[t("Protect and maintain","保护并维持"),t("Restore capacity","恢复能力"),t("Rebuild sport demand","重建专项需求"),t("Return to participation","重返参与"),t("Return to performance","重返表现")]},
  ]},
  24: { textbookAtlas:[
    {title:t("Fatigue–recovery continuum","疲劳—恢复连续谱"),relationship:t("Training stress is useful only when recovery converts it into adaptation","训练刺激只有经恢复转化为适应才有价值"),steps:[t("Acute fatigue","急性疲劳"),t("Functional overreaching","功能性过度训练"),t("Nonfunctional overreaching","非功能性过度训练"),t("Overtraining syndrome","过度训练综合征")]},
    {title:t("Readiness decision","准备度决策"),relationship:t("Trend + context + performance beats one isolated score","趋势 + 情境 + 表现优于单一分数"),steps:[t("Collect consistent markers","收集一致指标"),t("Compare with baseline","对照基线"),t("Investigate context","调查情境"),t("Adjust minimally","最小必要调整"),t("Reassess","重新评估")]},
  ]},
  25: { mindMap: map("mind-maps/ch25-facility-design.jpg", "Facility design — personal mind map", "设施设计——个人思维导图", [t("Needs analysis and space allocation", "需求分析与空间分配"),t("Traffic, visibility, access, and safety", "动线、视野、通行与安全"),t("Equipment placement and operations", "器材布局与运营")]), textbookAtlas:[
    {title:t("Facility flow","设施动线"),relationship:t("Safe supervision depends on sightlines, clearance, and traffic control","安全监督取决于视野、间距与动线控制"),steps:[t("Entry and check-in","入口与签到"),t("Warm-up zone","热身区"),t("Primary training zones","主要训练区"),t("Storage and circulation","储存与通行"),t("Emergency access","应急通道")]},
  ]},
  26: { mindMap: map("mind-maps/ch26-policy-legal.jpg", "Policy, procedure, and legal duties — personal mind map", "政策、程序与法律责任——个人思维导图", [t("Duty, breach, causation, and damage", "义务、违约、因果与损害"),t("Risk management and documentation", "风险管理与记录"),t("EAP, staffing, and professional scope", "EAP、人员与专业边界")]), textbookAtlas:[
    {title:t("Risk-control loop","风险控制循环"),relationship:t("Written systems must be trained, used, documented, and improved","书面制度必须训练、执行、记录并改进"),steps:[t("Identify hazard","识别危险"),t("Control exposure","控制暴露"),t("Train staff","培训人员"),t("Respond and document","响应并记录"),t("Review system","复盘系统")]},
  ]},
};

export function mediaForChapter(chapter: number) {
  return courseMedia[chapter] || { textbookAtlas: [] };
}
