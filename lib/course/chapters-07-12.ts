import { T, type CourseChapter } from "./types";

export const chapters0712: CourseChapter[] = [
  {
    n: 7,
    title: T("Age-Related Differences and Their Implications for Resistance Training", "年龄差异与抗阻训练"),
    domain: T("Exercise Science", "运动科学"),
    minutes: 105,
    source: "Essentials, 5th ed., Ch. 7 · DCO Exercise Science A-H individual differences",
    objectives: [
      T("Program from biological readiness rather than chronological age alone.", "依据生物准备度而不是只按实际年龄设计计划。"),
      T("Apply safe progression, supervision, and recovery principles to youth and older adults.", "把安全进阶、监督和恢复原则应用于青少年与老年人。"),
    ],
    sections: [
      {
        id: "growth-maturation",
        title: T("Growth, maturation, and trainability", "生长、成熟与可训练性"),
        explanation: [
          "Chronological age measures time since birth; biological age reflects maturation. Peak height velocity marks the period of fastest stature growth and helps contextualize temporary changes in coordination, tissue loading, and recovery. Children of the same age may differ substantially in size, strength, and maturity.",
          "Youth can gain strength through neural coordination, skill, and later hypertrophy. Well-designed resistance training does not inherently damage growth plates; poor supervision, excessive loading, unsafe equipment, or inappropriate progression creates risk.",
        ],
        details: [
          "Assess movement competency, training age, attention, ability to follow instructions, and emotional readiness before load progression.",
          "During rapid growth, limb lengths and leverage change quickly; regress complexity when technique temporarily becomes inconsistent.",
          "Prepubertal athletes often gain strength mainly through neural and technical factors, while hormonal maturation expands hypertrophy potential.",
          "Long-term athletic development balances strength, speed, power, coordination, mobility, and enjoyment rather than early single-sport volume alone.",
        ],
        decision: T("Progress the child who demonstrates control, not the child who is merely older or larger.", "进阶应给予能稳定控制动作的孩子，而不是仅仅年龄更大或体型更大者。"),
        examCue: T("Chronological age is not a readiness test. Qualified supervision and technique are central safety factors.", "实际年龄不是准备度测试；合格监督和技术是安全核心。"),
      },
      {
        id: "youth-programming",
        title: T("Youth session design and safety", "青少年训练设计与安全"),
        explanation: [
          "Youth resistance training begins with clear rules, appropriately sized equipment, dynamic preparation, and mastery of fundamental movement patterns. Loads should allow controlled repetition and successful instruction; maximal testing is acceptable only when technique, supervision, and protocol are appropriate.",
          "Frequency, volume, and intensity must fit school, sport, growth, and recovery demands. The goal is a durable base of competence rather than rapid specialization.",
        ],
        details: [
          "Use one or more light-to-moderate sets initially and progress volume before maximal loading when skill is limited.",
          "Teach landing, deceleration, pushing, pulling, squatting, hinging, bracing, carrying, jumping, and throwing.",
          "Allow adequate recovery between sessions for the same muscle groups and monitor pain, growth-related symptoms, and enthusiasm.",
          "External load is only one progression variable; range, speed, stability, unilateral demand, and task complexity also matter.",
        ],
        decision: T("When technique fails, reduce complexity or load and reteach; do not use fatigue as proof of a productive youth session.", "技术失败时降低复杂度或负荷并重新教学；不要把疲劳当作青少年训练有效的证明。"),
        examCue: T("A supervised youth program is beneficial; the unsafe answer is unsupervised, poorly progressed, or technically uncontrolled training.", "有监督的青少年计划有益；不安全的是无人监督、进阶不当或技术失控。"),
      },
      {
        id: "aging",
        title: T("Aging physiology and performance", "衰老生理与表现"),
        explanation: [
          "Aging is associated with losses in muscle mass, strength, power, bone density, balance, aerobic capacity, and recovery speed, but inactivity accelerates these changes. Fast force and type II fiber function often decline disproportionately, making power and fall-prevention capacity important targets.",
          "Older adults remain highly trainable. Resistance, power, balance, aerobic, and mobility training can improve function and independence when medical context and current ability are respected.",
        ],
        details: [
          "Sarcopenia describes age-related loss of muscle mass and function; dynapenia emphasizes loss of strength.",
          "Reduced anabolic sensitivity increases the importance of adequate protein distribution and sufficient training stimulus.",
          "Comorbidities, medications, blood-pressure response, joint limitations, vision, and fall risk influence exercise choice and setup.",
          "Longer warm-up and recovery may be useful, but age alone does not justify permanently low effort or no progression.",
        ],
        decision: T("Train the capacity that protects independence: lower-body strength, rapid but controlled force, balance, gait, and aerobic reserve.", "训练能保护独立生活的能力：下肢力量、快速但受控的发力、平衡、步态和有氧储备。"),
        examCue: T("Older adults need individualized progression, not automatic exclusion from heavy or power training.", "老年人需要个体化进阶，而不是自动排除大重量或功率训练。"),
      },
      {
        id: "older-programming",
        title: T("Programming and monitoring older adults", "老年人计划与监控"),
        explanation: [
          "Start from the athlete's functional baseline. Stable machines, supported patterns, controlled free weights, and sit-to-stand variations can build confidence before more complex tasks. Power work uses light-to-moderate resistance with intentional acceleration and safe deceleration.",
          "Monitor symptoms and response to medication. Stop and follow referral or emergency procedures for concerning chest pain, syncope, unusual shortness of breath, neurological symptoms, or other red flags.",
        ],
        details: [
          "Use rating of perceived exertion and repetition quality when heart-rate response is altered by medication.",
          "Progress one major variable at a time and allow familiarization before interpreting performance tests.",
          "Balance tasks should challenge without creating unmanageable fall risk; environmental setup and spotting matter.",
          "Functional outcomes such as rising, stair climbing, carrying, walking speed, and confidence can be more meaningful than gym numbers alone.",
        ],
        decision: T("Choose the safest exercise that still trains the limiting capacity; safety is not synonymous with underloading.", "选择既安全又能训练限制能力的动作；安全不等于负荷不足。"),
        examCue: T("Beta-blockers can blunt HR response, so use symptoms, workload, and RPE rather than a standard HR target alone.", "β 受体阻滞剂可减弱心率反应，因此应结合症状、工作量和 RPE，而非只看标准心率区间。"),
      },
    ],
    terms: [
      { term: "Chronological age", meaning: T("Time since birth.", "出生后的时间。") },
      { term: "Biological age", meaning: T("Level of physical and physiological maturation.", "身体和生理成熟水平。") },
      { term: "Peak height velocity", meaning: T("Period of fastest increase in stature during adolescence.", "青春期身高增长最快的时期。") },
      { term: "Sarcopenia", meaning: T("Age-related decline in muscle mass and function.", "与年龄相关的肌肉量和功能下降。") },
      { term: "Dynapenia", meaning: T("Age-related decline in muscle strength.", "与年龄相关的肌力下降。") },
    ],
    formulas: [],
    examChecklist: [
      T("Compare chronological age, biological age, and training age.", "比较实际年龄、生物年龄和训练年龄。"),
      T("Write a safe youth progression and an older-adult power progression.", "写出安全的青少年进阶和老年人功率进阶。"),
      T("Identify when medication or symptoms require modified monitoring or referral.", "识别药物或症状何时需要修改监控或转介。"),
    ],
    recall: [
      { prompt: T("What four readiness factors are more useful than age alone?", "哪四项准备因素比年龄更有用？"), answer: T("Movement competency, training age, maturation/health status, ability to follow instruction, supervision, and recovery capacity are valid examples.", "动作能力、训练年龄、成熟/健康状态、遵循指令能力、监督和恢复能力均可。") },
      { prompt: T("Why is power training relevant to older adults?", "为什么功率训练对老年人重要？"), answer: T("Rapid force declines strongly with age and is required for balance recovery, stair climbing, and preventing falls.", "快速发力随年龄显著下降，而恢复平衡、爬楼和预防跌倒都需要它。") },
    ],
  },
  {
    n: 8,
    title: T("Sex-Related Differences and Their Implications for Resistance Training", "性别差异与抗阻训练"),
    domain: T("Exercise Science", "运动科学"),
    minutes: 80,
    source: "Essentials, 5th ed., Ch. 8 · DCO Exercise Science individual differences",
    objectives: [
      T("Distinguish average population differences from individual programming decisions.", "区分群体平均差异与个体计划决策。"),
      T("Apply evidence-based considerations for strength, body composition, menstrual health, and injury risk.", "把证据应用于力量、身体成分、月经健康和伤病风险。"),
    ],
    sections: [
      {
        id: "body-composition",
        title: T("Body size, composition, and absolute performance", "体型、身体成分与绝对表现"),
        explanation: [
          "On average, adult males have greater total and upper-body lean mass and higher absolute strength and power, influenced by body size, muscle cross-sectional area, and hormonal environment. Relative to muscle cross-sectional area, force capacity is much more similar than absolute comparisons imply.",
          "Group averages do not define an individual athlete. Sport, training history, position, technique, motivation, and access to training create large overlap between sexes.",
        ],
        details: [
          "Upper-body absolute differences are commonly larger than lower-body differences because lean-mass distribution differs.",
          "Allometric or body-mass scaling can change comparisons; simple strength divided by body mass is useful but not perfect.",
          "Women may perform more repetitions at the same relative load in some exercises, but this varies by muscle group, load, and training status.",
          "Programming from stereotypes can underload the individual and limit adaptation.",
        ],
        decision: T("Use the athlete's assessment, goal, and response—not sex alone—to assign load, volume, rest, and progression.", "依据运动员评估、目标和反应，而不是仅凭性别分配负荷、容量、休息和进阶。"),
        examCue: T("Expect similar relative trainability with appropriate training; do not confuse lower average absolute strength with lower ability to improve.", "合适训练下相对可训练性相近；不要把较低平均绝对力量等同于较低改善能力。"),
      },
      {
        id: "adaptation-fatigue",
        title: T("Training adaptation and fatigue characteristics", "训练适应与疲劳特点"),
        explanation: [
          "Women and men both gain strength, power, muscle, bone, and endurance from progressive training. Relative improvements are often similar when program quality and baseline are matched. Differences in substrate use, fiber distribution, and absolute muscle mass may affect fatigue and recovery in specific tasks.",
          "Lower absolute force can produce less mechanical disruption at the same relative intensity, while greater proportional type I area in some muscles may support fatigue resistance. These are tendencies, not universal rules.",
        ],
        details: [
          "Trainability depends more on initial status, dose, adherence, energy availability, and sleep than on a single sex category.",
          "Individual recovery should be monitored through performance and symptoms rather than assumed.",
          "Strength and power training are essential for female athletes and should not be replaced by only low-load endurance work.",
          "Pregnancy and postpartum training require individualized medical coordination and are separate from generic sex-based programming.",
        ],
        decision: T("Adjust recovery when the athlete's actual output and symptoms indicate it; avoid fixed sex-based rest prescriptions.", "根据实际输出和症状调整恢复，避免固定的性别化休息处方。"),
        examCue: T("The most defensible answer individualizes from measured performance rather than assuming all women are more fatigue resistant.", "最可靠的答案会依据测得表现个体化，而不是假定所有女性都更抗疲劳。"),
      },
      {
        id: "menstrual-health",
        title: T("Menstrual health, energy availability, and training", "月经健康、能量可用性与训练"),
        explanation: [
          "Menstrual-cycle effects on performance are individually variable and usually smaller than sleep, illness, training load, or energy availability. The coach can track symptoms and performance with consent, but should not impose blanket phase-based programming.",
          "Menstrual dysfunction can be a sign of low energy availability or medical concern. Combined with recurrent stress injury, fatigue, or restrictive eating, it warrants referral to qualified medical and nutrition professionals.",
        ],
        details: [
          "Oral contraceptives alter the hormonal pattern and make simple natural-cycle assumptions invalid.",
          "Iron deficiency risk is relevant because of menstrual losses and endurance demands; diagnosis and treatment are medical responsibilities.",
          "Communication must protect privacy and avoid stigma. Ask about symptoms that affect training rather than making assumptions.",
          "Adequate energy, carbohydrate, protein, calcium, vitamin D, and recovery support both performance and bone health.",
        ],
        decision: T("Use symptom-guided flexible adjustments and refer persistent dysfunction; do not diagnose or prescribe treatment.", "使用症状指导的灵活调整并对持续异常进行转介；不要自行诊断或治疗。"),
        examCue: T("Amenorrhea is not a normal or desirable training adaptation; recognize and refer.", "闭经不是正常或理想的训练适应，应识别并转介。"),
      },
      {
        id: "injury-context",
        title: T("Injury risk and neuromuscular preparation", "伤病风险与神经肌肉准备"),
        explanation: [
          "Some female athlete populations show higher noncontact ACL injury rates, but risk is multifactorial: exposure, anatomy, hormones, strength, landing and cutting strategy, fatigue, sport context, and previous injury all contribute. Screening does not perfectly predict an individual injury.",
          "Neuromuscular programs that include strength, landing, deceleration, plyometrics, balance, and change-of-direction technique can reduce risk when performed consistently.",
        ],
        details: [
          "Hip and hamstring strength, trunk control, braking strategy, and progressive cutting exposure are trainable.",
          "Risk reduction is not achieved by one corrective exercise or one visual screen.",
          "Programs should begin before the competitive season and continue with a maintenance dose.",
          "The coach manages modifiable capacity and exposure while collaborating with the medical team after injury.",
        ],
        decision: T("Build robust movement options and progressive exposure instead of labeling an athlete as 'high risk' from one test.", "通过多样动作能力和渐进暴露建立稳健性，而不是凭一次测试给运动员贴“高风险”标签。"),
        examCue: T("Choose multifactorial, sustained neuromuscular training over a single muscle or single-angle explanation.", "选择多因素、持续性的神经肌肉训练，而不是单一肌肉或单一角度解释。"),
      },
    ],
    terms: [
      { term: "Absolute strength", meaning: T("Total external force or load without scaling to body size.", "未按体型标准化的总外力或负荷。") },
      { term: "Relative strength", meaning: T("Strength scaled to body mass or another size measure.", "按体重或其他体型指标标准化的力量。") },
      { term: "Amenorrhea", meaning: T("Absence of menstrual periods; persistent cases require medical evaluation.", "月经缺失；持续情况需要医疗评估。") },
      { term: "Low energy availability", meaning: T("Insufficient dietary energy remaining for physiological function after exercise expenditure.", "扣除运动消耗后，留给生理功能的膳食能量不足。") },
    ],
    formulas: [
      { name: "Simple relative strength", expression: "1RM ÷ body mass", use: T("Compare performance across body sizes while recognizing that nonlinear scaling may be better for research.", "跨体型比较表现，同时认识研究中非线性缩放可能更合适。"), example: "120 kg squat ÷ 60 kg = 2.0× body mass" },
    ],
    examChecklist: [
      T("Separate absolute differences from relative adaptation.", "区分绝对差异与相对适应。"),
      T("Recognize low-energy-availability and menstrual-health referral signals.", "识别低能量可用性和月经健康转介信号。"),
      T("Describe a multifactorial lower-limb injury-risk-reduction program.", "描述多因素下肢伤病风险降低计划。"),
    ],
    recall: [
      { prompt: T("Why should programs not be assigned from sex alone?", "为什么不能只按性别分配计划？"), answer: T("Individual training status, body size, skill, sport demands, goals, and response show substantial overlap and determine the needed dose.", "个体训练状态、体型、技能、专项需求、目标和反应存在大量重叠，并决定所需剂量。") },
      { prompt: T("What cluster should trigger RED-S or low-energy-availability referral?", "哪些信号组合应触发 RED-S 或低能量可用性转介？"), answer: T("Persistent fatigue or performance decline with restrictive intake, menstrual dysfunction, recurrent stress injury, or other health changes.", "持续疲劳或表现下降，同时出现限制性饮食、月经异常、反复应力性损伤或其他健康变化。") },
    ],
  },
  {
    n: 9,
    title: T("Psychological Foundations of Performance", "运动表现的心理学基础"),
    domain: T("Sport Psychology", "运动心理学"),
    minutes: 135,
    source: "Essentials, 5th ed., Ch. 9 · DCO Sport Psychology A-B · DCO Program Implementation A2",
    objectives: [
      T("Apply motivation, arousal, attention, confidence, imagery, and self-talk to coaching.", "把动机、唤醒、注意、信心、表象和自我对话应用于教练实践。"),
      T("Recognize distress, injury responses, and when referral is required.", "识别心理困扰、伤后反应和何时需要转介。"),
      T("Use motor-learning principles to teach and retain skill.", "使用运动学习原则教授并保持技能。"),
    ],
    sections: [
      {
        id: "arousal",
        title: T("Arousal, anxiety, stress, and the ideal state", "唤醒、焦虑、压力与理想状态"),
        explanation: [
          "Arousal is general activation; anxiety includes cognitive worry and somatic symptoms; stress arises when perceived demands exceed perceived resources. Performance depends on task, experience, interpretation, and the athlete's preferred state rather than one universally optimal arousal level.",
          "Simple tasks and gross power actions may tolerate higher arousal, while fine or unfamiliar skills often require a narrower, calmer state. Catastrophe models emphasize that high cognitive anxiety can make excessive physiological arousal especially disruptive.",
        ],
        details: [
          "Under-arousal may present as flat energy and slow initiation; over-arousal may narrow attention, speed decisions excessively, and increase unnecessary tension.",
          "Breathing, routines, cue words, muscle relaxation, and attentional shifts can downregulate arousal.",
          "Music, movement, energizing self-talk, and competitive cues can increase activation when appropriate.",
          "The athlete should practice regulation during training so the strategy is familiar under competition pressure.",
        ],
        decision: T("Identify whether activation is too low, useful, or too high for this athlete and task before selecting a strategy.", "先判断对该运动员和任务而言唤醒是过低、合适还是过高，再选择策略。"),
        examCue: T("The best answer regulates arousal toward an individual task-specific zone; it does not always reduce arousal.", "最佳答案把唤醒调向个体化、任务特定区间，并非总是降低唤醒。"),
      },
      {
        id: "motivation",
        title: T("Motivation, goals, confidence, and reinforcement", "动机、目标、信心与强化"),
        explanation: [
          "Self-determination theory emphasizes autonomy, competence, and relatedness. Goal-orientation theory distinguishes mastery or task focus from ego or comparison focus. A mastery climate rewards learning, effort, problem solving, and progress, which supports persistence when outcomes are uncertain.",
          "Outcome goals give direction, performance goals define measurable standards, and process goals specify controllable actions. The strongest plan links all three while daily coaching emphasizes process.",
        ],
        details: [
          "Confidence grows from mastery experiences, credible feedback, modeling, preparation, and interpretation of physiological state.",
          "Positive reinforcement increases the likelihood of a behavior by adding a valued consequence; negative reinforcement increases behavior by removing an aversive condition. Punishment aims to reduce behavior.",
          "Feedback should be specific, truthful, and tied to controllable behavior rather than empty praise.",
          "Athlete choice can support autonomy without abandoning structure: offer bounded options that both serve the session goal.",
        ],
        decision: T("Translate 'win' into today's controllable behaviors and give feedback on the behavior, timing, and result.", "把“赢”转化为今天可控的行为，并针对行为、时机和结果提供反馈。"),
        examCue: T("Negative reinforcement is not punishment; it increases behavior by removing something aversive.", "负强化不是惩罚；它通过移除厌恶刺激来增加行为。"),
      },
      {
        id: "attention-skills",
        title: T("Attention, imagery, self-talk, and routines", "注意、表象、自我对话与流程"),
        explanation: [
          "Attention can be broad or narrow and internal or external. Athletes scan broadly to assess a situation, then narrow attention to the most relevant cue. Under pressure, attention may become too narrow or shift toward threat and internal monitoring.",
          "Imagery is most useful when vivid, controllable, and functionally similar to performance. Self-talk should be short, believable, and linked to a decision or action. Preperformance routines stabilize attention and reduce unnecessary choice.",
        ],
        details: [
          "External-focus cues direct attention to the movement effect and often support automatic execution; internal cues can still be useful for rehabilitation or body awareness.",
          "Instructional self-talk guides technique; motivational self-talk regulates effort and confidence.",
          "Imagery can include visual, kinesthetic, auditory, and emotional features and should rehearse coping as well as ideal performance.",
          "Routines should be practiced under increasing pressure and include a reset step after errors.",
        ],
        decision: T("Give one cue that directs attention to the most important movement effect, then let the athlete execute before adding information.", "给出一个指向最重要动作效果的提示，然后让运动员执行，再决定是否增加信息。"),
        examCue: T("'Push the floor away' is external focus; 'extend your knees' is internal focus.", "“把地面推开”是外部注意；“伸膝”是内部注意。"),
      },
      {
        id: "mental-health",
        title: T("Mental health, eating concerns, injury, and referral", "心理健康、进食问题、伤病与转介"),
        explanation: [
          "The strength coach observes, listens, supports, follows organizational policy, and refers. The coach does not diagnose or provide psychotherapy. Useful warning signs include persistent changes in affect, behavior, and cognition; functional impairment; social withdrawal; sleep or appetite change; hopeless statements; and concerning eating or exercise patterns.",
          "Injury may threaten identity, belonging, control, and confidence. A supportive coach maintains appropriate team connection, offers realistic controllable goals, and coordinates with the interdisciplinary team.",
        ],
        details: [
          "Use a private, nonjudgmental conversation: describe observations, express concern, listen, and connect the athlete with the designated resource.",
          "Imminent self-harm, harm to others, or inability to maintain safety requires immediate emergency or crisis protocol.",
          "Disordered eating and eating disorders are not diagnosed by the coach; recognize patterns and refer.",
          "Confidentiality has limits when safety, law, or policy requires disclosure. Explain those limits honestly.",
        ],
        decision: T("If safety is immediate, stay with the athlete and activate the crisis procedure; do not promise secrecy or manage the situation alone.", "若存在即时安全风险，陪伴运动员并启动危机流程；不要承诺绝对保密，也不要独自处理。"),
        examCue: T("Persistent ABC changes plus impaired function = supportive conversation and referral, not diagnosis.", "持续 ABC 变化并影响功能 = 支持性沟通与转介，而不是诊断。"),
      },
      {
        id: "motor-learning",
        title: T("Motor learning and feedback", "运动学习与反馈"),
        explanation: [
          "Motor performance is temporary execution; motor learning is a relatively permanent change in capability inferred from retention and transfer. Early cognitive learning uses more instruction; associative learning refines errors; autonomous performance requires less conscious control.",
          "Blocked practice repeats one skill and helps initial performance. Random or variable practice is more difficult during training but can improve retention and transfer once a basic pattern exists.",
        ],
        details: [
          "Knowledge of results describes the outcome; knowledge of performance describes the movement pattern.",
          "Concurrent feedback occurs during movement; terminal feedback follows it. Excessive immediate feedback can create dependency.",
          "Bandwidth feedback is given when error exceeds an acceptable range; summary feedback covers several trials.",
          "Demonstration, simple cues, constraints, and representative practice conditions should match the learner's stage.",
        ],
        decision: T("Provide enough feedback for safety and understanding, then fade frequency so the athlete learns to detect and correct errors.", "提供足够反馈确保安全和理解，随后逐步降低频率，让运动员学会自行发现和纠正错误。"),
        examCue: T("A better practice-session score does not always mean better learning; use delayed retention and transfer.", "练习当下表现更好不一定代表学习更好；应看延迟保持与迁移。"),
      },
    ],
    terms: [
      { term: "Arousal", meaning: T("General physiological and psychological activation.", "一般生理与心理激活水平。") },
      { term: "Self-determination", meaning: T("Motivation supported by autonomy, competence, and relatedness.", "由自主、胜任和关系感支持的动机。") },
      { term: "Process goal", meaning: T("A controllable action target used during execution.", "执行过程中可控的行动目标。") },
      { term: "Knowledge of results", meaning: T("Feedback about the outcome of a movement.", "关于动作结果的反馈。") },
      { term: "Retention", meaning: T("Ability to perform the learned skill after a delay.", "延迟后执行已学技能的能力。") },
    ],
    formulas: [],
    examChecklist: [
      T("Select an arousal strategy from the athlete and task, not a universal rule.", "根据运动员与任务选择唤醒策略，而非套用统一规则。"),
      T("Distinguish outcome, performance, and process goals.", "区分结果、表现和过程目标。"),
      T("Use ABC observations, scope of practice, and emergency referral correctly.", "正确使用 ABC 观察、执业范围和紧急转介。"),
      T("Differentiate temporary performance from retained motor learning.", "区分临时表现与保持下来的运动学习。"),
    ],
    recall: [
      { prompt: T("Convert an outcome goal into a process goal.", "把一个结果目标改写为过程目标。"), answer: T("Replace 'win the race' with a controllable action such as 'hold planned first-lap pace and keep shoulders relaxed.'", "把“赢得比赛”改为“首圈保持计划配速并放松肩部”等可控行动。") },
      { prompt: T("What is the first duty when an athlete expresses imminent self-harm intent?", "运动员表达即刻自伤意图时首要职责是什么？"), answer: T("Protect immediate safety, remain with the athlete, and activate the organization's crisis or emergency protocol.", "保障即时安全、陪伴运动员，并启动组织的危机或紧急流程。") },
    ],
  },
  {
    n: 10,
    title: T("Basic Nutritional Factors Affecting Health", "影响健康的基础营养因素"),
    domain: T("Nutrition", "营养"),
    minutes: 130,
    source: "Essentials, 5th ed., Ch. 10 · DCO Nutrition A",
    objectives: [
      T("Explain energy balance, macronutrients, micronutrients, hydration, and scope of practice.", "解释能量平衡、宏量与微量营养素、补水和执业范围。"),
      T("Calculate practical intake and sweat-loss estimates without diagnosing or prescribing medical nutrition therapy.", "计算实用摄入和汗液损失，同时不越界进行诊断或医疗营养治疗。"),
    ],
    sections: [
      {
        id: "scope-energy",
        title: T("Scope of practice and energy balance", "执业范围与能量平衡"),
        explanation: [
          "A strength coach can provide general evidence-based education, reinforce team nutrition plans, identify red flags, and refer. Individual medical nutrition therapy, eating-disorder treatment, and diagnosis belong to qualified dietitians and medical professionals.",
          "Energy balance compares energy intake with expenditure. Body-mass change reflects the long-term balance, but daily scale change is heavily influenced by fluid, glycogen, gut content, and measurement conditions.",
        ],
        details: [
          "Energy expenditure includes resting metabolism, thermic effect of food, planned exercise, and nonexercise activity.",
          "Low energy availability can impair endocrine, bone, immune, cardiovascular, reproductive, and performance function even before dramatic weight loss.",
          "Weight goals should be gradual and aligned with performance, health, season timing, and athlete consent.",
          "Refer unexplained weight change, restrictive behavior, recurrent stress injury, gastrointestinal disease, or complex medical conditions.",
        ],
        decision: T("Provide general plate, timing, and hydration education; refer individualized therapeutic diets or suspected pathology.", "提供一般餐盘、时机和补水教育；个体治疗饮食或疑似病理应转介。"),
        examCue: T("Choose referral when the stem includes diagnosis, disease treatment, eating disorder, or persistent RED-S signs.", "题干涉及诊断、疾病治疗、进食障碍或持续 RED-S 信号时选择转介。"),
      },
      {
        id: "carbohydrate",
        title: T("Carbohydrate and training fuel", "碳水化合物与训练燃料"),
        explanation: [
          "Carbohydrate is stored mainly as muscle and liver glycogen and circulates as blood glucose. It supports high-intensity exercise because it can provide ATP rapidly, and adequate availability helps preserve training quality and skill under fatigue.",
          "Needs scale with training volume, intensity, body size, and schedule. Athletes do not need the same intake every day; periodize carbohydrate upward around demanding sessions and downward when workload is lighter without creating chronic low energy availability.",
        ],
        details: [
          "Muscle glycogen serves the working muscle; liver glycogen helps maintain blood glucose.",
          "Fiber supports health and satiety, but high fiber immediately before competition can increase gastrointestinal symptoms.",
          "Glycemic index describes relative blood-glucose response under standardized conditions; mixed meals and timing change the response.",
          "Very low carbohydrate availability can reduce high-intensity capacity and total training quality even when fat oxidation rises.",
        ],
        decision: T("Place familiar, digestible carbohydrate before and around high-output work; adjust total intake to the athlete's actual workload.", "在高输出训练前后安排熟悉、易消化的碳水，并按实际工作量调整总摄入。"),
        examCue: T("High-intensity work relies heavily on carbohydrate; greater fat use is not automatically better performance.", "高强度运动高度依赖碳水；脂肪利用比例更高不自动等于表现更好。"),
      },
      {
        id: "protein-fat",
        title: T("Protein, fat, and tissue remodeling", "蛋白质、脂肪与组织重塑"),
        explanation: [
          "Protein supplies amino acids for muscle, enzymes, transporters, immune proteins, and other tissue. Training and protein feeding stimulate remodeling; total daily intake, distribution, protein quality, and energy availability all matter.",
          "Fat supplies essential fatty acids, supports cell membranes and steroid synthesis, aids absorption of vitamins A, D, E, and K, and provides dense energy. Chronically very low fat intake can compromise health and diet quality.",
        ],
        details: [
          "Protein should be distributed across meals with high-quality sources rather than concentrated in one feeding.",
          "Leucine is an important signal, but complete essential amino-acid availability is required for building tissue.",
          "Unsaturated fats should make up much of intake; trans-fat intake should be minimized.",
          "Protein can contribute to energy during prolonged or low-glycogen exercise, but using it as a major fuel is not the goal.",
        ],
        decision: T("Set total energy first, then distribute sufficient protein across the day and retain adequate dietary fat.", "先保证总能量，再把足量蛋白质分布到全天，并保留充足膳食脂肪。"),
        examCue: T("Protein supports remodeling but does not replace carbohydrate for high-intensity fuel or energy balance for mass gain.", "蛋白质支持重塑，但不能代替高强度所需碳水，也不能代替增重所需能量平衡。"),
      },
      {
        id: "micronutrients",
        title: T("Vitamins, minerals, and high-risk deficiencies", "维生素、矿物质与高风险缺乏"),
        explanation: [
          "Micronutrients regulate energy metabolism, oxygen transport, bone turnover, immune function, and tissue repair. More is not always better: supplements above requirements may have no benefit and can be toxic or interact with medication.",
          "Athletes at higher risk include those with restricted energy intake, limited food variety, heavy menstrual losses, gastrointestinal conditions, low sun exposure, or high sweat losses.",
        ],
        details: [
          "Iron is essential for hemoglobin and oxidative enzymes; deficiency can impair endurance and cognition. Blood testing and treatment require medical oversight.",
          "Calcium and vitamin D support bone health and muscle function; low energy availability increases bone risk.",
          "Sodium is the major extracellular electrolyte and is lost in sweat; potassium is predominantly intracellular.",
          "Antioxidant nutrients from food support health, while chronic megadoses may interfere with some training signaling and create risk.",
        ],
        decision: T("Use food-first variety and refer suspected deficiency for testing rather than guessing with high-dose supplements.", "优先多样化食物；疑似缺乏应转介检测，而不是猜测性使用大剂量补剂。"),
        examCue: T("Iron-deficiency diagnosis and supplementation are not the strength coach's role.", "缺铁诊断和补充治疗不属于体能教练职责。"),
      },
      {
        id: "hydration",
        title: T("Fluid, electrolytes, and sweat-rate planning", "液体、电解质与出汗率计划"),
        explanation: [
          "Fluid needs vary with body size, climate, clothing, acclimation, intensity, and individual sweat rate. Both dehydration and excessive hypotonic fluid intake can be dangerous. The goal is a practical plan that limits performance-reducing dehydration without causing net weight gain from overdrinking.",
          "Pre/post body mass, fluid consumed, and urine produced can estimate sweat loss. Repeated measurements under similar conditions are more useful than one generic recommendation.",
        ],
        details: [
          "Heat and humidity increase thermoregulatory strain; acclimation improves plasma volume and sweating response.",
          "Sodium replacement becomes more relevant with long sessions, high sweat rates, salty sweat, or repeated same-day exercise.",
          "Urine color is a rough field indicator and is influenced by supplements, food, and first-morning concentration.",
          "Hyponatremia risk rises when fluid intake exceeds losses, especially during long events without appropriate sodium strategy.",
        ],
        decision: T("Build an individualized sweat-rate range, practice it in training, and avoid both large deficits and weight gain during exercise.", "建立个体出汗率范围，在训练中演练，并避免大幅脱水或运动中体重增加。"),
        examCue: T("Body-mass loss plus fluid consumed minus urine approximates sweat loss; keep units consistent.", "体重下降加摄入液体再减尿量可近似汗液损失；注意统一单位。"),
      },
    ],
    terms: [
      { term: "Energy availability", meaning: T("Dietary energy remaining for physiological function after exercise expenditure.", "扣除运动消耗后可供生理功能使用的膳食能量。") },
      { term: "Glycogen", meaning: T("Stored carbohydrate in muscle and liver.", "储存在肌肉和肝脏中的碳水。") },
      { term: "Essential amino acid", meaning: T("An amino acid that must be supplied by the diet.", "必须由膳食提供的氨基酸。") },
      { term: "Hyponatremia", meaning: T("Abnormally low blood sodium concentration.", "血钠浓度异常降低。") },
    ],
    formulas: [
      { name: "Sweat loss", expression: "pre mass − post mass + fluid intake − urine", use: T("Estimate fluid lost during a session, treating 1 kg mass change as about 1 L water.", "估算一次训练的液体损失，1 kg 体重变化约等于 1 L 水。"), example: "80.0 − 78.8 kg + 0.5 L − 0 L ≈ 1.7 L" },
      { name: "Sweat rate", expression: "sweat loss ÷ exercise hours", use: T("Create an individualized hourly hydration plan.", "制定个体化每小时补水计划。"), example: "1.7 L ÷ 1.5 h ≈ 1.13 L/h" },
      { name: "Protein target calculation", expression: "body mass × g·kg⁻¹·day⁻¹", use: T("Translate a body-mass-relative target into daily grams.", "把按体重目标换算为每日克数。"), example: "70 kg × 1.6 g/kg = 112 g/day" },
    ],
    examChecklist: [
      T("State what nutrition guidance is inside versus outside coaching scope.", "说明哪些营养指导在教练职责内，哪些越界。"),
      T("Explain carbohydrate, protein, and fat roles without replacing one with another.", "解释碳水、蛋白质和脂肪角色，避免互相替代。"),
      T("Calculate sweat loss, sweat rate, and body-mass-relative intake.", "计算汗液损失、出汗率和按体重摄入。"),
    ],
    recall: [
      { prompt: T("Why can body mass change overnight without meaningful fat change?", "为什么一夜体重变化不代表有意义的脂肪变化？"), answer: T("Fluid, glycogen and bound water, sodium, gut content, and measurement timing can shift rapidly.", "液体、糖原及结合水、钠、肠内容物和测量时间都会快速变化。") },
      { prompt: T("When does a nutrition question require referral?", "营养问题何时需要转介？"), answer: T("When it involves diagnosis, disease treatment, eating disorder, persistent RED-S signs, complex supplementation, or individualized medical nutrition therapy.", "涉及诊断、疾病治疗、进食障碍、持续 RED-S 信号、复杂补剂或个体医疗营养治疗时。") },
    ],
  },
  {
    n: 11,
    title: T("Nutrition Strategies for Maximizing Performance", "最大化表现的营养策略"),
    domain: T("Nutrition", "营养"),
    minutes: 120,
    source: "Essentials, 5th ed., Ch. 11 · DCO Nutrition A",
    objectives: [
      T("Plan pre-, during-, and postexercise fueling by event demand and gastrointestinal tolerance.", "根据项目需求和胃肠耐受安排赛前、赛中与赛后补给。"),
      T("Manage body-composition goals while recognizing RED-S and eating-disorder risk.", "管理身体成分目标，同时识别 RED-S 与进食障碍风险。"),
    ],
    sections: [
      {
        id: "pre-event",
        title: T("Preexercise fueling and hydration", "运动前补给与补水"),
        explanation: [
          "The preevent meal aims to start with adequate glycogen, hydration, and comfort. Timing, amount, and food choice depend on time available, event duration and intensity, body size, and individual gastrointestinal history.",
          "As the event approaches, meals generally become smaller, more carbohydrate-focused, and lower in fat and fiber. Novel foods, large meals, and untested supplement doses increase risk without guaranteed benefit.",
        ],
        details: [
          "A meal several hours before exercise can be more complete; a snack within an hour should be familiar and easily digested.",
          "Prehydration should begin early enough to absorb fluid and permit urination rather than forcing a large bolus immediately before activity.",
          "Caffeine strategy must account for habitual use, timing, sleep, anxiety, rules, and side effects.",
          "High-intensity morning events may require carbohydrate planning the night before because there is little time for a large breakfast.",
        ],
        decision: T("Practice the exact competition meal and timing during a comparable training session.", "在相似训练课中提前演练完全相同的比赛餐与时间安排。"),
        examCue: T("Close to competition, choose familiar, carbohydrate-rich, lower-fat and lower-fiber options when GI distress is a concern.", "临近比赛且担心胃肠不适时，选择熟悉、富含碳水、较低脂和低纤维食物。"),
      },
      {
        id: "during-event",
        title: T("During-exercise carbohydrate, fluid, and sodium", "运动中碳水、液体与钠"),
        explanation: [
          "During-event fueling matters most as duration, intensity, heat, and starting glycogen demands increase. Carbohydrate supports blood glucose and high rates of oxidation; fluids manage cardiovascular and thermal strain; sodium helps replace sweat losses and retain fluid.",
          "The gut is trainable. Gradual practice with planned concentrations, volumes, and product combinations improves tolerance. More intake is not always better if absorption and gastric emptying cannot keep pace.",
        ],
        details: [
          "Short sessions may need only water or no intake; prolonged or repeated high-output work benefits more from carbohydrate and electrolyte planning.",
          "Multiple transportable carbohydrates can support higher oxidation rates in long events, but they must be practiced.",
          "Concentrated carbohydrate solutions, dehydration, heat, and high intensity can slow gastric emptying and increase symptoms.",
          "Team-sport opportunities are intermittent, so use breaks, substitutions, and halftime strategically.",
        ],
        decision: T("Start with event demands and sweat rate, then choose a plan the athlete can actually tolerate and execute.", "先看项目需求和出汗率，再选择运动员真正能耐受并执行的方案。"),
        examCue: T("A long hot event requires fluid and sodium context; a brief power event does not need aggressive during-event feeding.", "长时间高温项目需要考虑液体和钠；短时功率项目不需要激进的运动中进食。"),
      },
      {
        id: "recovery",
        title: T("Postexercise recovery and repeated sessions", "运动后恢复与重复训练"),
        explanation: [
          "Recovery nutrition restores glycogen and fluid, supplies amino acids for remodeling, and supports the next session. Urgency depends on the time until the next demanding bout. When recovery time is long, total daily intake matters most; when sessions are close, early intake becomes more important.",
          "A mixed meal can meet carbohydrate, protein, micronutrient, and fluid goals. Supplements are convenient tools, not inherently superior to food.",
        ],
        details: [
          "Carbohydrate intake soon after depletion accelerates glycogen restoration when another session occurs within hours.",
          "High-quality protein after training supports muscle-protein synthesis; distributing protein across the day adds repeated opportunities.",
          "Rehydration often requires replacing more than the measured deficit because urine losses continue; sodium supports retention.",
          "Alcohol can impair rehydration, sleep, judgment, and muscle recovery and adds energy without supporting performance.",
        ],
        decision: T("Prioritize fast recovery only when the schedule demands it; otherwise build a sustainable daily pattern.", "只有训练日程要求时才强调快速恢复；否则建立可持续的全天饮食模式。"),
        examCue: T("Short turnaround elevates the importance of immediate carbohydrate, protein, fluid, and sodium.", "恢复窗口很短时，即时碳水、蛋白质、液体和钠更重要。"),
      },
      {
        id: "body-composition",
        title: T("Body-composition change without sacrificing performance", "不牺牲表现的身体成分调整"),
        explanation: [
          "Fat loss requires a sustained energy deficit; mass gain requires a surplus. The size and speed of change affect training quality, lean-mass retention or gain, mood, sleep, and adherence. Performance goals and competition schedule should determine timing.",
          "Use trends from standardized measures rather than daily noise. Combine body mass with performance, circumference or composition measures, menstrual health, recovery, and athlete wellbeing.",
        ],
        details: [
          "Moderate deficits, adequate protein, and resistance training help preserve lean mass during fat loss.",
          "A very large surplus accelerates mass gain but increases fat gain; muscle gain is limited by training status and adaptation rate.",
          "Weight-class athletes need planned strategies with qualified professionals; severe dehydration and rapid weight loss create risk.",
          "Fad diets may change short-term scale weight through glycogen and water before meaningful fat change occurs.",
        ],
        decision: T("Choose the slowest rate that meets the performance timeline, and stop or refer when health or performance deteriorates.", "选择满足表现时间线的最慢变化速度；健康或表现恶化时停止并转介。"),
        examCue: T("Evidence-based body-composition change is gradual, monitored, and paired with adequate protein and resistance training.", "循证身体成分调整应渐进、受监控，并配合充足蛋白质和抗阻训练。"),
      },
      {
        id: "reds-eating",
        title: T("RED-S, disordered eating, and referral", "RED-S、饮食紊乱与转介"),
        explanation: [
          "Relative Energy Deficiency in Sport describes impaired physiological and performance function caused by problematic low energy availability. It can affect athletes of any sex and may involve bone, reproductive, endocrine, immune, cardiovascular, gastrointestinal, hematological, psychological, and performance consequences.",
          "Disordered eating exists on a spectrum; an eating disorder is a clinical condition. Coaches should avoid moralizing food, public body comments, punitive exercise, and uncontrolled weigh-ins.",
        ],
        details: [
          "Warning signs include restrictive rules, rapid weight change, recurrent stress injury, menstrual dysfunction, low libido, fatigue, cold intolerance, mood change, and declining performance.",
          "Body mass can remain stable despite low energy availability because the body adapts; absence of low weight does not rule out risk.",
          "Screening, diagnosis, and treatment require an interdisciplinary team with medical and nutrition expertise.",
          "Immediate medical instability or severe psychological risk requires urgent action under policy.",
        ],
        decision: T("Document objective observations, communicate privately, and refer through the established pathway.", "记录客观观察，私下沟通，并通过既定流程转介。"),
        examCue: T("RED-S affects all sexes and many systems; it is not limited to the historical female-athlete triad.", "RED-S 可影响所有性别和多系统，不限于传统女性运动员三联征。"),
      },
    ],
    terms: [
      { term: "Glycogen restoration", meaning: T("Replenishment of carbohydrate stored in muscle and liver after exercise.", "运动后补充肌肉和肝脏糖原。") },
      { term: "Gut training", meaning: T("Repeated practice of competition fueling to improve tolerance and absorption.", "反复演练比赛补给以改善耐受和吸收。") },
      { term: "RED-S", meaning: T("Multisystem health and performance impairment related to low energy availability.", "与低能量可用性相关的多系统健康与表现损害。") },
      { term: "Disordered eating", meaning: T("Problematic eating attitudes or behaviors that may not meet diagnostic criteria.", "可能未达到诊断标准但存在问题的饮食态度或行为。") },
    ],
    formulas: [
      { name: "Percent body-mass change", expression: "(pre mass − post mass) ÷ pre mass × 100", use: T("Estimate hydration-related mass loss during a session.", "估算一次训练中与水合相关的体重损失。"), example: "(80.0 − 78.8) ÷ 80.0 × 100 = 1.5%" },
      { name: "Energy-balance direction", expression: "intake − expenditure", use: T("Understand long-term direction while avoiding precise prediction from one day.", "理解长期变化方向，避免用单日数据精确预测。") },
    ],
    examChecklist: [
      T("Build a pre/during/post plan for short power, team sport, and long endurance events.", "为短时功率、团队运动和长耐力项目分别制定赛前中后方案。"),
      T("Explain when immediate recovery intake matters most.", "解释即时恢复摄入何时最重要。"),
      T("Recognize RED-S and eating-disorder signals and use referral boundaries.", "识别 RED-S 与进食障碍信号并遵守转介边界。"),
    ],
    recall: [
      { prompt: T("What changes when the next hard session is in four hours rather than tomorrow?", "下一次高强度训练在四小时后而非明天时，策略如何变化？"), answer: T("Earlier carbohydrate, protein, fluid, and sodium replacement becomes more urgent because there is less time for total daily intake to restore readiness.", "由于恢复时间更短，更需要尽早补充碳水、蛋白质、液体和钠。") },
      { prompt: T("Why does stable body mass not rule out RED-S?", "为什么体重稳定不能排除 RED-S？"), answer: T("The body can reduce physiological expenditure and function to defend mass while health and performance deteriorate.", "身体可降低生理消耗和功能以维持体重，同时健康与表现仍在恶化。") },
    ],
  },
  {
    n: 12,
    title: T("Performance-Enhancing Substances and Methods", "提升表现的物质与方法"),
    domain: T("Nutrition", "营养"),
    minutes: 115,
    source: "Essentials, 5th ed., Ch. 12 · DCO Nutrition B",
    objectives: [
      T("Evaluate efficacy, safety, legality, product quality, and scope for common supplements and drugs.", "评估常见补剂与药物的有效性、安全性、合法性、产品质量和职责范围。"),
      T("Use a repeatable decision framework rather than marketing claims.", "使用可重复的决策框架，而非依据营销宣传。"),
    ],
    sections: [
      {
        id: "framework",
        title: T("Evidence, regulation, and third-party testing", "证据、监管与第三方检测"),
        explanation: [
          "Dietary supplements are not evaluated like approved medicines before sale in many jurisdictions. Label accuracy, contamination, adulteration, and dose can vary. The athlete remains responsible for banned substances under strict-liability rules.",
          "Evaluate five questions: Is the proposed mechanism plausible? Do controlled studies show a meaningful effect in a similar population and task? Is the effective dose known? What are the risks and interactions? Is the product independently tested and permitted by the governing body?",
        ],
        details: [
          "A statistically significant effect may be too small to matter in practice; compare the effect with normal performance variability.",
          "Proprietary blends hide ingredient doses and make evaluation difficult.",
          "Third-party certification reduces, but cannot eliminate, contamination risk; it does not prove efficacy.",
          "Natural, clinically tested, or research-backed are marketing phrases unless the exact product, dose, and study are verified.",
        ],
        decision: T("Food, sleep, training, and medical issues come first. Refer supplement decisions through the sport's qualified medical/nutrition process.", "先解决饮食、睡眠、训练和医疗问题；补剂决策应通过专项合格医疗/营养流程。"),
        examCue: T("Third-party testing addresses product quality and banned-substance risk; it does not guarantee performance benefit.", "第三方检测解决产品质量和违禁风险，不保证表现收益。"),
      },
      {
        id: "supported",
        title: T("Common evidence-supported ergogenic aids", "常见有证据支持的助力补剂"),
        explanation: [
          "Creatine monohydrate increases muscle creatine availability and can improve repeated high-intensity work, strength, training volume, and lean-mass gain over time. Caffeine can improve alertness, endurance, repeated sprint, and perceived effort, but response and side effects vary.",
          "Beta-alanine increases muscle carnosine and can support high-intensity efforts where acid-base disturbance is important. Sodium bicarbonate buffers extracellular acidity but commonly causes gastrointestinal distress. Nitrate may improve economy or endurance in some contexts.",
        ],
        details: [
          "Creatine benefit accumulates through regular intake; loading accelerates saturation but is not the only approach. Early mass gain is often water within muscle.",
          "Caffeine timing and dose must account for sleep, anxiety, habituation, medication, and competition time.",
          "Beta-alanine can cause tingling; divided doses improve tolerance, and benefit requires chronic loading rather than a single acute dose.",
          "Bicarbonate and nitrate responses depend on event demands and individual tolerance; training trials are essential.",
        ],
        decision: T("Match the supplement to a limiting mechanism and event, then test tolerability in training—not on competition day.", "把补剂与限制机制和项目匹配，并在训练中测试耐受，而不是比赛当天首次使用。"),
        examCue: T("Creatine supports repeated high-intensity capacity; beta-alanine is chronic buffering support; caffeine is an acute stimulant.", "肌酸支持重复高强度能力；β-丙氨酸提供长期缓冲支持；咖啡因是急性兴奋剂。"),
      },
      {
        id: "weak-evidence",
        title: T("Unsupported claims and practical evidence appraisal", "不可靠宣传与证据评估"),
        explanation: [
          "Supplements often reach market before strong independent evidence exists. Testimonials, mechanistic reasoning, animal studies, and acute biomarker changes do not prove improved sport performance. Evidence should replicate in trained humans using relevant outcomes.",
          "A product can be biologically active yet unhelpful because baseline intake is already adequate, the dose is too low, the event does not depend on the targeted mechanism, or side effects offset benefit.",
        ],
        details: [
          "Branched-chain amino acids add little when total high-quality protein and essential amino acids are sufficient.",
          "Antioxidant megadoses may not improve performance and can create toxicity or alter adaptation.",
          "Hormone boosters frequently rely on indirect markers or deficient populations rather than meaningful results in trained athletes.",
          "Weight-loss products may contain stimulants, undeclared drugs, or doses that increase cardiovascular risk.",
        ],
        decision: T("Require direct evidence for the exact outcome, population, dose, and product category before recommending use.", "推荐前要求针对确切结果、人群、剂量和产品类别的直接证据。"),
        examCue: T("Mechanism is necessary but not sufficient; choose controlled human performance evidence over a marketing pathway diagram.", "机制是必要但不充分的证据；应优先选择受控人体表现研究，而非营销机制图。"),
      },
      {
        id: "peds",
        title: T("Performance-enhancing drugs and harmful methods", "提升表现药物与有害方法"),
        explanation: [
          "Anabolic-androgenic steroids can increase muscle and strength but carry cardiovascular, endocrine, hepatic, psychiatric, reproductive, and legal or sport-sanction risks. Erythropoietin can increase oxygen-carrying capacity but raises blood viscosity and thrombotic risk. Stimulants, growth hormone misuse, insulin misuse, blood doping, and diuretics carry distinct dangers.",
          "The strength coach does not prescribe, source, or manage illicit or medically inappropriate drug use. The coach follows policy, provides factual risk education within competence, protects confidentiality limits, and refers to medical and sport-integrity professionals.",
        ],
        details: [
          "Exogenous hormones suppress normal endocrine feedback and can produce prolonged recovery or infertility.",
          "Diuretics reduce scale weight but impair hydration and electrolytes and may mask other substances.",
          "Blood doping and EPO increase red-cell mass but also viscosity, blood pressure, and clot risk.",
          "Needle sharing, counterfeit products, and unsupervised polypharmacy add infectious and toxicological risk.",
        ],
        decision: T("If use is suspected, avoid accusation; follow organizational policy and refer through designated medical and integrity channels.", "怀疑使用时避免指控；按组织政策并通过指定医疗和诚信渠道转介。"),
        examCue: T("A performance benefit does not make a method safe or permitted. Evaluate efficacy, health risk, legality, and rules separately.", "有表现收益不代表安全或允许；应分别评估有效性、健康风险、合法性和规则。"),
      },
    ],
    terms: [
      { term: "Ergogenic aid", meaning: T("A substance, method, or device intended to improve performance.", "旨在提高表现的物质、方法或设备。") },
      { term: "Third-party testing", meaning: T("Independent verification of product contents and selected contaminants.", "对产品成分和特定污染物的独立验证。") },
      { term: "Strict liability", meaning: T("The athlete is responsible for prohibited substances found in the body.", "运动员对体内检出的违禁物质负责。") },
      { term: "Anabolic-androgenic steroid", meaning: T("A testosterone-related drug with anabolic and androgenic effects.", "具有合成代谢和雄激素作用的睾酮相关药物。") },
    ],
    formulas: [],
    examChecklist: [
      T("Evaluate a supplement using efficacy, dose, safety, quality, legality, and scope.", "按有效性、剂量、安全、质量、合法性和职责范围评估补剂。"),
      T("Match creatine, caffeine, beta-alanine, bicarbonate, and nitrate to likely use cases.", "把肌酸、咖啡因、β-丙氨酸、碳酸氢盐和硝酸盐与用途匹配。"),
      T("Recognize major risks of anabolic steroids, EPO/blood doping, stimulants, and diuretics.", "识别合成代谢类固醇、EPO/血液兴奋、兴奋剂和利尿剂的主要风险。"),
    ],
    recall: [
      { prompt: T("What does third-party certification prove—and not prove?", "第三方认证能证明什么、不能证明什么？"), answer: T("It increases confidence in label accuracy and contaminant screening; it does not prove the product is effective, risk-free, or appropriate for the athlete.", "它提高对标签准确和污染物筛查的信心；但不证明产品有效、零风险或适合该运动员。") },
      { prompt: T("Why is a plausible mechanism insufficient evidence?", "为什么合理机制仍不是充分证据？"), answer: T("The pathway may not create a meaningful performance effect at a practical dose in trained humans, and side effects or adequate baseline status may erase benefit.", "该途径在实际剂量和训练人群中未必产生有意义表现收益，副作用或基线充足也可能抵消收益。") },
    ],
  },
];

