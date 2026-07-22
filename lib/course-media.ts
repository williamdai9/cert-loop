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
  textbookFigures?: Array<{
    path: string;
    sectionId: string;
    figureRef: string;
    page: number;
    title: CourseText;
    caption: CourseText;
    check: CourseText;
    alt: CourseText;
  }>;
  textbookAtlas: Array<{
    title: CourseText;
    relationship: CourseText;
    steps: CourseText[];
  }>;
};

const t = (en: string, zh: string): CourseText => ({ en, zh });

const textbookFigure = (
  file: string,
  sectionId: string,
  figureRef: string,
  page: number,
  titleEn: string,
  titleZh: string,
  captionEn: string,
  captionZh: string,
  checkEn: string,
  checkZh: string,
) => ({
  path: `textbook/chapter-01/${file}`,
  sectionId,
  figureRef,
  page,
  title: t(titleEn, titleZh),
  caption: t(captionEn, captionZh),
  check: t(checkEn, checkZh),
  alt: t(`${figureRef}: ${titleEn}`, `${figureRef}：${titleZh}`),
});

const textbookFigureForChapter = (
  chapter: number,
  file: string,
  sectionId: string,
  figureRef: string,
  page: number,
  titleEn: string,
  titleZh: string,
  captionEn: string,
  captionZh: string,
  checkEn: string,
  checkZh: string,
) => ({
  path: `textbook/chapter-${String(chapter).padStart(2, "0")}/${file}`,
  sectionId,
  figureRef,
  page,
  title: t(titleEn, titleZh),
  caption: t(captionEn, captionZh),
  check: t(checkEn, checkZh),
  alt: t(`${figureRef}: ${titleEn}`, `${figureRef}：${titleZh}`),
});

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
    textbookFigures: [
      textbookFigure("figure-1-1.png", "musculoskeletal", "Figure 1.1", 41, "Adult skeleton: anterior and posterior views", "成人骨骼：前后视图", "Use the paired views to locate the axial skeleton, appendicular skeleton, and the named landmarks most likely to anchor movement questions.", "用前后视图定位中轴骨骼、附肢骨骼，以及动作题常用的骨性标志。", "Without labels, can you identify the scapula, sternum, pelvis, radius, ulna, femur, tibia, and fibula?", "遮住标签后，你能指出肩胛骨、胸骨、骨盆、桡骨、尺骨、股骨、胫骨和腓骨吗？"),
      textbookFigure("figure-1-2.png", "musculoskeletal", "Figure 1.2", 45, "Major skeletal musculature: anterior and posterior views", "主要骨骼肌：前后视图", "Read the figure spatially: identify where each muscle sits, then connect that location to its main joint action rather than memorizing an isolated name.", "按空间关系读图：先定位肌肉，再把位置与主要关节动作连接起来，而不是孤立背名称。", "Which muscles shown contribute to shoulder abduction, elbow extension, hip extension, knee extension, and plantar flexion?", "图中哪些肌肉参与肩外展、伸肘、髋伸、伸膝和跖屈？"),
      textbookFigure("figure-1-3.png", "musculoskeletal", "Figure 1.3", 46, "Whole muscle, fascicle, fiber, and connective tissue", "整块肌肉、肌束、肌纤维与结缔组织", "This is the accurate hierarchy missing from the former abstract diagram. Follow muscle belly → fasciculus → single fiber → myofibril → myofilaments while matching epimysium, perimysium, and endomysium to the structure each surrounds.", "这是原抽象图未能准确表达的层级。沿肌腹 → 肌束 → 单条肌纤维 → 肌原纤维 → 肌丝学习，并把肌外膜、肌束膜和肌内膜对应到各自包绕的结构。", "Explain how the three connective-tissue layers converge toward tendon and transmit contractile force to bone.", "解释三层结缔组织如何汇向肌腱，并把收缩力传递到骨。"),
      textbookFigure("figure-1-5.png", "contraction", "Figure 1.5", 48, "Sectional view of a muscle fiber", "肌纤维剖面", "Locate the sarcolemma, myofibrils, mitochondria, T-tubule openings, and sarcoplasmic reticulum. The arrangement explains how a surface action potential rapidly reaches the fiber interior and triggers calcium release.", "定位肌膜、肌原纤维、线粒体、T 管开口与肌浆网。这个布局解释了表面动作电位如何快速进入纤维内部并触发钙释放。", "Why are T-tubules and the sarcoplasmic reticulum positioned around the myofibrils rather than only at the cell surface?", "为什么 T 管和肌浆网围绕肌原纤维分布，而不只存在于细胞表面？"),
      textbookFigure("figure-1-6.png", "contraction", "Figure 1.6", 50, "Myofilament and sarcomere organization", "肌丝与肌节组织", "Move from the muscle to the myofibril, then to a single sarcomere and its thick and thin filaments. Use the cross-sections to understand why the A band, I band, H zone, M line, and Z lines look different.", "从肌肉进入肌原纤维，再到单个肌节及粗、细肌丝。结合横截面理解 A 带、I 带、H 区、M 线与 Z 线为何不同。", "Which proteins form the thick and thin filaments, and where do crossbridges form?", "粗肌丝和细肌丝分别由哪些蛋白构成？横桥在哪里形成？"),
      textbookFigure("figure-1-7.png", "contraction", "Figure 1.7", 52, "Sarcomere length and filament overlap", "肌节长度与肌丝重叠", "Compare stretched, useful-overlap, and over-shortened states. The filaments keep their length; Z lines move, the I band and H zone change, and the A band remains constant.", "比较拉长、有效重叠和过度缩短状态。肌丝长度不变；Z 线移动，I 带与 H 区改变，而 A 带保持不变。", "At which state is force potential reduced by too little overlap, and what causes force loss when the sarcomere is over-shortened?", "哪种状态因重叠不足而降低产力？肌节过度缩短时又为什么丢失力量？"),
      textbookFigure("figure-1-4.png", "neuromuscular", "Figure 1.4", 47, "Motor neuron and motor-unit anatomy", "运动神经元与运动单位结构", "Use the labeled neuron to follow dendrites → cell body → axon hillock → myelinated axon → terminal branches. A motor unit includes one alpha motor neuron and every muscle fiber supplied by its terminal branches.", "沿树突 → 胞体 → 轴丘 → 有髓轴突 → 末梢分支追踪信号。一个运动单位包括一个 α 运动神经元及其末梢支配的全部肌纤维。", "What is the functional effect of myelin and nodes of Ranvier on action-potential conduction?", "髓鞘和郎飞结对动作电位传导有什么功能影响？"),
      textbookFigure("figure-1-8.png", "neuromuscular", "Figure 1.8", 58, "Twitch, summation, and tetanus", "单收缩、叠加与强直收缩", "Read left to right as firing frequency rises: single twitch, summation, unfused tetanus, then fused tetanus. A new stimulus arriving before full relaxation raises total force.", "随放电频率从左到右增加：单收缩、收缩叠加、不完全强直、完全强直。完全舒张前到来的新刺激会提高总力量。", "What distinguishes unfused from fused tetanus on a force-time trace?", "在力量—时间曲线上，不完全强直与完全强直有何区别？"),
      textbookFigure("figure-1-9.png", "neuromuscular", "Figure 1.9", 60, "Slow- and fast-twitch motor units", "慢肌与快肌运动单位", "The mosaic shows that fibers from different motor units are intermingled. Compare threshold, conduction velocity, fiber number, fatigue resistance, and the recruitment response to low versus higher force demand.", "镶嵌图说明不同运动单位的肌纤维彼此交错。比较募集阈值、传导速度、支配纤维数、抗疲劳性，以及低负荷与较高负荷的募集反应。", "State the size principle and explain why a heavier curl recruits units that an unloaded curl may not require.", "说出大小原则，并解释为什么更重的弯举会募集徒手弯举不需要的运动单位。"),
      textbookFigure("table-1-1a.png", "neuromuscular", "Table 1.1 · Part 1", 61, "Major characteristics of muscle fiber types", "肌纤维类型主要特征（上）", "Begin the Type I, IIa, and IIx comparison with motor-neuron size, recruitment threshold, and conduction velocity.", "从运动神经元大小、募集阈值和传导速度开始比较 I、IIa 与 IIx 型肌纤维。", "Which phenotype is recruited first, and which has the highest threshold?", "哪种表型最先募集？哪种募集阈值最高？"),
      textbookFigure("table-1-1b.png", "neuromuscular", "Table 1.1 · Part 2", 62, "Muscle fiber phenotype comparison", "肌纤维表型比较（下）", "Continue across speed, fatigue resistance, force, power, enzyme content, capillary density, myoglobin, mitochondria, diameter, and color. IIa is often intermediate rather than identical to either extreme.", "继续比较速度、抗疲劳性、力量、功率、酶含量、毛细血管密度、肌红蛋白、线粒体、直径和颜色。IIa 往往处于两端之间。", "Cover the values and reconstruct one complete column from memory before comparing it with the table.", "遮住数值，先凭记忆重建一整列，再与表格核对。"),
      textbookFigure("table-1-2a.png", "neuromuscular", "Table 1.2 · Part 1", 63, "Relative fiber-type involvement by sport", "不同运动项目的相对肌纤维参与（上）", "Treat the entries as relative demand patterns, not as a claim that only one fiber type works. Duration, force, speed, and repeated-effort demands shape the profile.", "把表中内容理解为相对需求模式，而不是某项目只使用一种肌纤维。持续时间、力量、速度和重复用力共同决定参与模式。", "Before revealing each row, predict Type I and Type II involvement from the event's intensity-duration profile.", "查看每一行前，先依据项目的强度—持续时间特征预测 I 型与 II 型参与。"),
      textbookFigure("table-1-2b.png", "neuromuscular", "Table 1.2 · Part 2", 64, "Relative fiber-type involvement by sport, continued", "不同运动项目的相对肌纤维参与（续）", "Use the continuation to compare mixed-demand events with predominantly endurance or power events.", "用续表比较混合需求项目与主要耐力或功率项目。", "Why can rowing show high involvement of both Type I and Type II fibers?", "为什么划船项目中 I 型和 II 型肌纤维都可能高度参与？"),
      textbookFigure("figure-1-10.png", "neuromuscular", "Figure 1.10", 66, "Muscle spindle and Golgi tendon organ", "肌梭与高尔基腱器官", "The muscle spindle lies in parallel with extrafusal fibers and responds to length and rate of stretch. The Golgi tendon organ lies in the tendon in series with the muscle and responds to tension.", "肌梭与梭外肌纤维并联，感受长度及拉伸速度；高尔基腱器官位于肌腱内，与肌肉串联，感受张力。", "Compare location, stimulus, afferent information, and immediate reflex effect for the spindle and GTO.", "比较肌梭与 GTO 的位置、刺激、传入信息及即时反射作用。"),
      textbookFigure("figure-1-11.png", "cardiovascular", "Figure 1.11", 71, "Heart chambers, valves, and blood flow", "心腔、瓣膜与血流", "Trace one complete circuit: venae cavae → right atrium → tricuspid valve → right ventricle → pulmonary valve and artery → lungs → pulmonary veins → left atrium → mitral valve → left ventricle → aortic valve and aorta.", "追踪完整循环：腔静脉 → 右心房 → 三尖瓣 → 右心室 → 肺动脉瓣与肺动脉 → 肺 → 肺静脉 → 左心房 → 二尖瓣 → 左心室 → 主动脉瓣与主动脉。", "Can you trace the route without using color as a cue and name all four valves in order?", "不依赖颜色提示，你能按顺序说出完整路线和四个瓣膜吗？"),
      textbookFigure("figure-1-12.png", "cardiovascular", "Figure 1.12", 72, "Electrical conduction system of the heart", "心脏电传导系统", "Follow SA node → internodal pathways → AV node → bundle branches → Purkinje fibers. The delay and distribution coordinate atrial contraction before organized ventricular contraction.", "沿 SA 结 → 结间通路 → AV 结 → 束支 → 浦肯野纤维学习。延迟与分布使心房先收缩，再协调心室收缩。", "Why is AV nodal delay useful, and which structures rapidly distribute depolarization through the ventricles?", "AV 结延迟为什么有用？哪些结构把去极化快速分布到心室？"),
      textbookFigure("figure-1-13.png", "cardiovascular", "Figure 1.13", 74, "Normal electrocardiogram", "正常心电图", "Map the P wave to atrial depolarization, the QRS complex to ventricular depolarization, and the T wave to ventricular repolarization. Electrical events precede the mechanical response.", "把 P 波对应心房去极化、QRS 波群对应心室去极化、T 波对应心室复极。电活动发生在机械反应之前。", "What electrical event is largely hidden within the QRS complex?", "哪一个电活动通常被 QRS 波群掩盖？"),
      textbookFigure("figure-1-14.png", "cardiovascular", "Figure 1.14", 75, "Circulatory route and resting blood-volume distribution", "循环路线与静息血容量分布", "Read the closed circuit and the percentages together. At rest, veins and venules contain the largest share of blood volume, supporting their role as a capacitance reservoir.", "把闭合循环与比例一起阅读。静息时，静脉和小静脉容纳最大比例的血容量，体现其容量血管作用。", "Which compartment stores the most blood at rest, and how can venoconstriction support venous return during exercise?", "静息时哪个区室储血最多？运动时静脉收缩如何支持静脉回流？"),
      textbookFigure("figure-1-15.png", "respiratory", "Figure 1.15", 80, "Gross anatomy of the respiratory system", "呼吸系统大体解剖", "Trace inspired air through the upper airway, trachea, main bronchi, bronchioles, and alveoli. Distinguish air-conducting structures from the alveolar surface where gas exchange occurs.", "追踪吸入空气经上气道、气管、主支气管、细支气管到肺泡。区分传导气道与发生气体交换的肺泡表面。", "Where does conducting-zone airflow end and the gas-exchange region begin?", "传导区气流在哪里结束？气体交换区从哪里开始？"),
      textbookFigure("figure-1-16.png", "respiratory", "Figure 1.16", 91, "Tidal volume and dead-space distribution", "潮气量与无效腔分布", "A typical 500 mL breath is partitioned into alveolar air, anatomical dead space, and a smaller physiological dead-space component. Only the alveolar portion directly participates in exchange.", "典型 500 mL 呼吸被分为肺泡气、解剖无效腔和较小的生理无效腔部分；只有肺泡部分直接参与交换。", "Why can minute ventilation rise without an equal rise in effective alveolar ventilation?", "为什么分钟通气量增加时，有效肺泡通气量不一定等比例增加？"),
      textbookFigure("figure-1-17.png", "respiratory", "Figure 1.17", 92, "Oxygen and carbon-dioxide pressure gradients", "氧与二氧化碳分压梯度", "At the lungs, oxygen moves from alveoli toward blood while carbon dioxide moves toward alveoli. At working tissue the directions reverse, always following the relevant partial-pressure gradient.", "在肺部，氧从肺泡进入血液，二氧化碳进入肺泡；在工作组织处方向相反，始终沿相应分压梯度移动。", "Using the displayed PO₂ and PCO₂ values, explain every gas-direction arrow without relying on memorization.", "根据图中 PO₂ 与 PCO₂ 数值解释每一条气体移动箭头，而不是死记方向。"),
    ],
    textbookAtlas: [
      { title: t("Muscle organization", "肌肉组织层级"), relationship: t("Structure constrains force transmission", "结构决定力量传递"), steps: [t("Whole muscle", "整块肌肉"), t("Fascicle", "肌束"), t("Fiber", "肌纤维"), t("Myofibril", "肌原纤维"), t("Sarcomere", "肌节")] },
      { title: t("Excitation–contraction coupling", "兴奋—收缩耦联"), relationship: t("Electrical signal becomes mechanical force", "电信号转化为机械力"), steps: [t("Motor neuron", "运动神经元"), t("ACh and action potential", "ACh 与动作电位"), t("Ca²⁺ release", "Ca²⁺ 释放"), t("Cross-bridge cycling", "横桥循环"), t("Force", "力量")] },
      { title: t("Cardiopulmonary oxygen pathway", "心肺氧运输路径"), relationship: t("Ventilation + circulation + extraction", "通气 + 循环 + 提取"), steps: [t("Alveoli", "肺泡"), t("Left heart", "左心"), t("Arterial blood", "动脉血"), t("Working muscle", "工作肌肉"), t("Venous return", "静脉回流")] },
    ],
  },
  2: {
    mindMap: map("mind-maps/ch02-biomechanics.jpg", "Resistance-exercise biomechanics — personal mind map", "抗阻运动生物力学——个人思维导图", [t("Planes, axes, and joint actions", "平面、轴与关节动作"), t("Force, torque, and lever arms", "力、力矩与力臂"), t("Work, power, impulse, and resistance profiles", "功、功率、冲量与阻力曲线")]),
    textbookFigures: [
      textbookFigureForChapter(2, "figure-2-1.png", "force-torque", "Figure 2.1", 108, "First-class lever: elbow extension", "第一类杠杆：伸肘", "Locate the fulcrum, muscle force, resistance force, and both perpendicular moment arms. The small muscle moment arm means the triceps must create much more force than the external resistance.", "定位支点、肌肉力、阻力及两条垂直力臂。较短的肌肉力臂意味着肱三头肌必须产生远大于外部阻力的力量。", "Using the displayed dimensions, can you explain why the mechanical advantage is less than 1.0?", "利用图中尺寸，你能解释为什么机械优势小于 1.0 吗？"),
      textbookFigureForChapter(2, "figure-2-2.png", "force-torque", "Figure 2.2", 109, "Force, moment arm, and torque", "力、力臂与力矩", "A force produces the greatest rotary effect when its line of action is perpendicular to the lever. Resolve the force into useful tangential and nonrotary components before calculating torque.", "当力的作用线与杠杆垂直时，旋转效应最大。计算力矩前，应把力分解为有效切向分量与非旋转分量。", "Which distance in the diagram is the true moment arm, and why is lever length alone insufficient?", "图中哪一段才是真正的力臂？为什么仅知道杠杆长度还不够？"),
      textbookFigureForChapter(2, "figure-2-3.png", "force-torque", "Figure 2.3", 111, "Second-class lever: standing heel raise", "第二类杠杆：站姿提踵", "The ball of the foot is the fulcrum, body resistance lies between the fulcrum and the plantar-flexor force, and the muscle moment arm exceeds the resistance moment arm. This arrangement favors force.", "前脚掌是支点，身体阻力位于支点与跖屈肌力之间，肌肉力臂大于阻力力臂，因此这一结构有利于力量。", "Why can muscle force be smaller than the resistance force in this configuration?", "为什么在这一结构中肌肉力可以小于阻力？"),
      textbookFigureForChapter(2, "figure-2-4.png", "force-torque", "Figure 2.4", 112, "Third-class lever: biceps curl", "第三类杠杆：肱二头肌弯举", "The elbow is the fulcrum and biceps force is applied between it and the dumbbell. The short internal moment arm creates a mechanical disadvantage for force but supports large distal displacement and speed.", "肘关节为支点，肱二头肌力作用在支点与哑铃之间。较短的内部力臂造成力量上的机械劣势，却有利于远端更大的位移与速度。", "If the dumbbell moves farther from the elbow, what happens to external torque when its mass is unchanged?", "若哑铃离肘关节更远而质量不变，外部力矩会怎样变化？"),
      textbookFigureForChapter(2, "figure-2-5.png", "force-torque", "Figure 2.5", 114, "Patella and knee-extensor mechanical advantage", "髌骨与膝伸肌机械优势", "Compare the intact patella with patellectomy. By holding the quadriceps tendon farther from the knee axis, the patella increases the knee-extensor moment arm and torque for a given muscle force.", "比较保留髌骨与髌骨切除后的结构。髌骨使股四头肌腱远离膝关节轴，因此在相同肌肉力下增加膝伸力臂和力矩。", "What must the quadriceps do after the moment arm becomes shorter if the same external knee torque is required?", "如果力臂缩短但仍需产生相同的外部膝关节力矩，股四头肌必须怎样变化？"),
      textbookFigureForChapter(2, "figure-2-6.png", "force-torque", "Figure 2.6", 116, "Elbow moment arm across joint range", "肘关节全幅度中的力臂变化", "The biceps line of pull and its perpendicular distance from the elbow axis change throughout flexion. Mechanical advantage is therefore angle dependent rather than a fixed property of the exercise.", "肱二头肌的拉力线及其到肘关节轴的垂直距离会随屈曲角度变化。因此机械优势取决于关节角度，并非动作的固定属性。", "At which illustrated position is the perpendicular moment arm largest, and what does that imply for muscle force demand?", "图示哪个位置的垂直力臂最大？这对肌肉力量需求意味着什么？"),
      textbookFigureForChapter(2, "figure-2-7.png", "force-torque", "Figure 2.7", 117, "External moment arm during a curl", "弯举过程中的外部力臂", "Gravity acts vertically through the weight, so the resistance moment arm is the horizontal distance from that line of action to the elbow. It peaks near a horizontal forearm and shrinks toward either vertical position.", "重力沿重量的竖直作用线向下，因此阻力力臂是该作用线到肘关节的水平距离。前臂接近水平时力臂最大，靠近任一竖直位置时减小。", "Why does the same dumbbell feel hardest near the middle of the curl?", "为什么同一只哑铃在弯举中段通常最难？"),
      textbookFigureForChapter(2, "figure-2-8.png", "force-torque", "Figure 2.8", 120, "Tendon insertion, torque, and movement speed", "肌腱止点、力矩与动作速度", "Moving the tendon insertion farther from the joint increases the moment arm and torque for a given muscle force, but produces less joint rotation per unit of muscle shortening. A force advantage therefore trades against movement speed and range.", "肌腱止点离关节更远时，相同肌肉力可产生更大的力臂与力矩，但每单位肌肉缩短造成的关节转动更少。因此力量优势会与动作速度和幅度形成权衡。", "Compare configurations a and b: which favors torque, and which favors angular displacement per unit shortening?", "比较 a 与 b：哪一个有利于力矩？哪一个有利于每单位缩短产生更大的角位移？"),
      textbookFigureForChapter(2, "figure-2-9.png", "movement-language", "Figure 2.9", 122, "Anatomical planes and exercise examples", "解剖平面与训练动作示例", "Pair each plane with its perpendicular axis and a dominant exercise example: sagittal with the biceps curl, frontal with lateral raise, and transverse with dumbbell fly. Real exercises may still contain motion or stabilization in other planes.", "将每个平面与其垂直轴及主要训练动作配对：矢状面对应弯举，额状面对应侧平举，水平面对应哑铃飞鸟。真实动作仍可能包含其他平面的运动或稳定。", "Without looking, name the axis perpendicular to each of the three planes.", "不看图时，说出与三个平面分别垂直的旋转轴。"),
      textbookFigureForChapter(2, "figure-2-10a.png", "movement-language", "Figure 2.10 · Part 1", 124, "Joint movements and exercise examples: upper body", "关节动作与训练示例：上肢", "Use this first plate as movement vocabulary, not decoration. Link the pictured wrist, elbow, forearm, shoulder, scapular, and cervical actions to a plane, axis, and familiar exercise phase.", "把这张上半部分图版作为动作词汇表使用，而不是装饰。将腕、肘、前臂、肩、肩胛与颈部动作连接到对应平面、轴和熟悉的训练阶段。", "Can you distinguish forearm pronation-supination from shoulder internal-external rotation without relying on the exercise name?", "不依赖动作名称，你能区分前臂旋前旋后与肩内旋外旋吗？"),
      textbookFigureForChapter(2, "figure-2-10b.png", "movement-language", "Figure 2.10 · Part 2", 126, "Joint movements and exercise examples: trunk and lower body", "关节动作与训练示例：躯干与下肢", "Continue the movement vocabulary through trunk, hip, knee, and ankle actions. For every example, name the moving joint and phase before assigning concentric or eccentric muscle action.", "继续学习躯干、髋、膝与踝的动作词汇。对每个示例，先指出运动关节和阶段，再判断向心或离心肌肉动作。", "During a squat descent and ascent, which hip, knee, and ankle joint actions occur in each phase?", "深蹲下降与上升阶段，髋、膝和踝分别发生哪些关节动作？"),
      textbookFigureForChapter(2, "table-2-1a.png", "work-power-impulse", "Table 2.1 · Part 1", 131, "Units of measure and conversions", "计量单位与换算", "Use the table to keep distance, angle, velocity, force, work, and power units consistent before solving. Unit checking often exposes a wrong setup before arithmetic does.", "解题前使用该表确保距离、角度、速度、力量、功和功率的单位一致。单位检查往往能在计算前暴露错误设定。", "Which SI units correspond to force, work, and power, and how are they related dimensionally?", "力量、功和功率分别对应哪些 SI 单位？它们在量纲上如何关联？"),
      textbookFigureForChapter(2, "table-2-1b.png", "work-power-impulse", "Table 2.1 · Part 2", 132, "Torque conversion row", "力矩换算行", "The continuation isolates torque conversion between newton-meters and foot-pounds. Keep torque units distinct from work even though both can contain force multiplied by distance.", "续表给出牛顿米与英尺磅之间的力矩换算。尽管力矩和功的单位都可能包含力乘距离，也要保持概念区分。", "Why are torque and work not interchangeable physical quantities even when their base units look similar?", "即使基本单位形式相似，为什么力矩与功仍不是可互换的物理量？"),
      textbookFigureForChapter(2, "figure-2-11.png", "muscle-mechanics", "Figure 2.11", 141, "Muscle fiber arrangements", "肌纤维排列形式", "Compare longitudinal, fusiform, radiate, unipennate, bipennate, and multipennate arrangements. More fibers in parallel generally favor force; longer series arrangements favor shortening distance and velocity.", "比较纵行、梭形、放射形、单羽状、双羽状与多羽状排列。更多并联肌纤维通常有利于产力，较长的串联排列有利于缩短距离与速度。", "Which pictured architectures prioritize physiological cross-sectional area, and which prioritize excursion?", "图中哪些结构更偏向生理横截面积，哪些更偏向收缩位移？"),
      textbookFigureForChapter(2, "figure-2-12.png", "muscle-mechanics", "Figure 2.12", 143, "Actin, myosin, and titin across muscle lengths", "不同肌长下的肌动蛋白、肌球蛋白与肌联蛋白", "Compare resting, shortened, and stretched configurations. Active force depends on useful actin-myosin overlap, while titin contributes passive force and alignment as the sarcomere is lengthened beyond resting length.", "比较静息、缩短和拉长状态。主动张力取决于有效的肌动蛋白—肌球蛋白重叠；肌节超过静息长度时，肌联蛋白参与被动张力与排列稳定。", "Why can active force fall at both very short and very long muscle lengths?", "为什么肌肉在过短和过长时主动张力都可能下降？"),
      textbookFigureForChapter(2, "figure-2-13.png", "muscle-mechanics", "Figure 2.13", 145, "Force-velocity curves for muscle actions", "不同肌肉动作的力—速度曲线", "Concentric force capability declines as shortening velocity rises. Eccentric capability is greater than isometric and generally rises with lengthening velocity before approaching a plateau.", "向心缩短速度越快，力量能力越低。离心力量能力高于等长，并通常随拉长速度增加而上升，随后趋于平台。", "At the same absolute angular speed, how do eccentric, isometric, and concentric force capabilities compare?", "在相同绝对角速度下，离心、等长和向心力量能力如何比较？"),
      textbookFigureForChapter(2, "figure-2-14.png", "force-torque", "Figure 2.14", 153, "Cam-based variable resistance", "凸轮式可变阻力", "A cam changes the horizontal distance from the weight-stack line of action to its pivot. As that moment arm changes through the repetition, external resistance torque changes even though stack mass is constant.", "凸轮会改变配重作用线到旋转轴的水平距离。随着力臂在重复动作中改变，即使配重质量不变，外部阻力矩也会变化。", "From position 1 to 2, what happens to the weight-stack moment arm and resistive torque?", "从位置 1 到 2，配重力臂和阻力矩如何变化？"),
      textbookFigureForChapter(2, "figure-2-15.png", "joint-risk", "Figure 2.15", 164, "Intra-abdominal pressure and trunk support", "腹内压与躯干支撑", "Contraction of the diaphragm and deep abdominal musculature creates a pressurized fluid compartment that contributes to trunk stiffness under load. The following text distinguishes this mechanism from assuming that a Valsalva maneuver is always required.", "膈肌和深层腹肌收缩会形成加压的液体区室，为负荷下的躯干刚度提供支持。后续正文进一步说明，这一机制并不等于始终必须使用瓦尔萨尔瓦动作。", "How can intra-abdominal pressure support the spine, and why must breathing strategy still be individualized?", "腹内压如何帮助支撑脊柱？为什么呼吸策略仍需个体化？"),
    ],
    textbookAtlas: [
      { title:t("Plane–axis pairing","平面—轴配对"),relationship:t("Movement occurs in a plane around its perpendicular axis","动作发生在平面内并绕垂直轴旋转"),steps:[t("Sagittal / mediolateral","矢状面 / 左右轴"),t("Frontal / anteroposterior","额状面 / 前后轴"),t("Transverse / longitudinal","水平面 / 垂直轴")] },
      { title:t("External torque","外部力矩"),relationship:t("Torque changes with force and perpendicular distance","力矩随力和垂直距离变化"),steps:[t("Joint axis","关节轴"),t("Moment arm","力臂"),t("External force","外力"),t("Muscular response","肌肉应对")] },
    ],
  },
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
