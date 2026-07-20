import { T, type CourseChapter } from "./types";

export const chapters1317: CourseChapter[] = [
  {
    n: 13,
    title: T("Principles of Test Selection and Administration", "测试选择与实施原则"),
    domain: T("Program Implementation", "计划实施"),
    minutes: 105,
    source: "Essentials, 5th ed., Ch. 13 · DCO Program Design A · Program Implementation B-C · Exercise Science J",
    objectives: [
      T("Choose tests from needs analysis, validity, reliability, feasibility, and athlete characteristics.", "根据需求分析、效度、信度、可行性和运动员特征选择测试。"),
      T("Standardize testing order, instructions, warm-up, trials, rest, and environment.", "标准化测试顺序、指令、热身、试次、休息和环境。"),
    ],
    sections: [
      {
        id: "purpose",
        title: T("Why test and what decision follows?", "为何测试以及测试后做什么决策"),
        explanation: [
          "Testing should answer a defined question: establish a baseline, profile strengths and weaknesses, guide programming, monitor readiness or adaptation, evaluate return-to-performance, or communicate progress. A test without a planned decision adds fatigue and data burden without improving practice.",
          "Begin with the sport and athlete needs analysis. Identify the quality, movement, energy-system demand, injury context, and practical constraints before choosing the tool.",
        ],
        details: [
          "A test battery should be as small as possible while still covering the decisions that matter.",
          "Benchmarking against norms can describe a group position, but the athlete's own reliable change is usually more useful for monitoring.",
          "Screening is not diagnosis and rarely predicts injury perfectly; it can identify current limitations or referral needs.",
          "Testing frequency must match how quickly the quality can change and the cost of measurement.",
        ],
        decision: T("Write the action rule before collecting data: 'If result changes beyond X, we will adjust Y.'", "采集数据前先写行动规则：“若结果变化超过 X，则调整 Y。”"),
        examCue: T("Select the test that measures the relevant quality and can change the program—not the most sophisticated device.", "选择能测量相关能力并改变计划的测试，而不是最复杂的设备。"),
      },
      {
        id: "quality",
        title: T("Validity, reliability, objectivity, and sensitivity", "效度、信度、客观性与敏感性"),
        explanation: [
          "Validity is the degree to which evidence supports the intended interpretation of scores. Reliability is consistency under repeated conditions. Objectivity or interrater reliability concerns agreement among testers. Sensitivity is the ability to detect meaningful change rather than measurement noise.",
          "A test can be reliable but invalid: it may consistently measure the wrong construct. Poor reliability also limits validity because unstable scores cannot support confident interpretation.",
        ],
        details: [
          "Test-retest reliability examines stability across occasions; intrarater and interrater reliability examine scorer consistency.",
          "Typical error, standard error of measurement, coefficient of variation, and intraclass correlation describe different aspects of reliability.",
          "Minimal detectable change estimates a change unlikely to be measurement error; smallest worthwhile change estimates practical importance.",
          "Learning effects require familiarization before a score is treated as a true baseline.",
        ],
        decision: T("Interpret a change only after comparing it with the test's error, the athlete's normal variability, and the practical importance of the difference.", "只有将变化与测试误差、运动员正常波动和实际意义比较后，才进行解释。"),
        examCue: T("Reliability = consistency; validity = justified meaning; sensitivity = ability to detect useful change.", "信度=一致性；效度=解释是否成立；敏感性=能否检测有用变化。"),
      },
      {
        id: "selection",
        title: T("Specificity, feasibility, and athlete fit", "专项性、可行性与运动员匹配"),
        explanation: [
          "A test should resemble the targeted quality enough to be meaningful, while remaining standardized enough to compare. Movement pattern, velocity, force direction, energy system, duration, and decision demands all contribute to specificity.",
          "Feasibility includes cost, time, equipment, staffing, space, risk, expertise, and athlete burden. A laboratory gold standard may be inferior to a reliable field test that can be repeated consistently.",
        ],
        details: [
          "Use population-appropriate protocols and norms. A test validated in adults may not transfer directly to youth or injured athletes.",
          "Avoid redundant tests that measure the same construct unless confirmation is worth the cost.",
          "High-skill tests may reflect technique more than the intended physical quality in novices.",
          "Choose unilateral, bilateral, horizontal, vertical, or change-of-direction tests based on the actual question.",
        ],
        decision: T("Choose the most reliable practical test that represents the quality and population closely enough to guide a decision.", "选择在实际环境中最可靠、又足够代表目标能力和人群的测试。"),
        examCue: T("Specific does not mean identical to sport. The test must isolate or represent a useful quality with acceptable control.", "专项不等于完全复制比赛；测试应在可控条件下隔离或代表有用能力。"),
      },
      {
        id: "administration",
        title: T("Standardized administration and test order", "标准化实施与测试顺序"),
        explanation: [
          "Standardization controls sleep, food, caffeine, prior exercise, time of day, equipment, calibration, surface, footwear, warm-up, instructions, technique criteria, trial number, rest, and encouragement. Record deviations so later comparisons are honest.",
          "Within a battery, place nonfatiguing measures first, then tests requiring speed, skill, and maximal neural quality, and leave highly fatiguing anaerobic and aerobic capacity tests late. Exact order depends on the battery and priority.",
        ],
        details: [
          "A common sequence is nonfatiguing measurements → agility → maximal power/strength → sprint → muscular endurance → anaerobic capacity → aerobic capacity.",
          "Allow familiarization and a standardized warm-up before maximal performance.",
          "Use the same tester and equipment when possible, and calibrate devices according to procedure.",
          "Terminate for pain, unsafe technique, concerning symptoms, or protocol-defined failure.",
        ],
        decision: T("Protect the highest-priority and most fatigue-sensitive test by placing it before tests that impair it.", "把最高优先级且最易受疲劳影响的测试放在会干扰它的测试之前。"),
        examCue: T("Aerobic capacity is usually last because it creates broad fatigue; nonfatiguing measures are first.", "有氧能力通常最后，因为其造成广泛疲劳；非疲劳测量最先。"),
      },
    ],
    terms: [
      { term: "Validity", meaning: T("Evidence supporting the intended interpretation of a test score.", "支持测试分数预期解释的证据。") },
      { term: "Reliability", meaning: T("Consistency of scores under repeated standardized conditions.", "标准化重复条件下分数的一致性。") },
      { term: "Objectivity", meaning: T("Agreement of results across different testers.", "不同测试者之间结果的一致性。") },
      { term: "Minimal detectable change", meaning: T("Change likely to exceed measurement error at a stated confidence.", "在给定置信度下可能超过测量误差的变化。") },
      { term: "Smallest worthwhile change", meaning: T("Smallest change judged practically meaningful.", "被认为具有实际意义的最小变化。") },
    ],
    formulas: [
      { name: "Coefficient of variation", expression: "CV% = SD ÷ mean × 100", use: T("Express variability relative to the mean when ratio scaling is appropriate.", "在适合比例尺度时，用均值的百分比表示变异。") },
      { name: "Z-score", expression: "z = (score − mean) ÷ SD", use: T("Describe how far a score is from a reference mean in standard deviations.", "描述分数距参考均值多少个标准差。") },
    ],
    examChecklist: [
      T("Build a test battery from a sport needs analysis.", "根据项目需求分析建立测试组合。"),
      T("Explain reliable-but-invalid with an example.", "用例子解释“可靠但无效”。"),
      T("Recite a defensible test order and the fatigue logic behind it.", "口述合理测试顺序及其疲劳逻辑。"),
    ],
    recall: [
      { prompt: T("Why is a new test score not automatically a true baseline?", "为什么第一次测试分数不一定是真实基线？"), answer: T("Learning, unfamiliar technique, anxiety, inconsistent preparation, and measurement error may influence it; familiarization and standardization are needed.", "学习效应、陌生技术、焦虑、准备不一致和测量误差都可能影响，需要熟悉化与标准化。") },
      { prompt: T("What is wrong with using every available test?", "使用所有可用测试有什么问题？"), answer: T("Redundancy, fatigue, time, false positives, data burden, and unclear decisions can outweigh any added information.", "冗余、疲劳、时间、假阳性、数据负担和不明确决策可能超过新增信息价值。") },
    ],
  },
  {
    n: 14,
    title: T("Administration, Scoring, and Interpretation of Selected Tests", "测试的实施、评分与解读"),
    domain: T("Program Implementation", "计划实施"),
    minutes: 165,
    source: "Essentials, 5th ed., Ch. 14 · DCO Program Implementation B-C",
    objectives: [
      T("Administer and interpret tests of body composition, strength, power, speed, agility, anaerobic and aerobic capacity.", "实施并解读身体成分、力量、功率、速度、敏捷、无氧和有氧能力测试。"),
      T("Use descriptive statistics and measurement error to communicate actionable results.", "使用描述统计和测量误差沟通可行动结果。"),
    ],
    sections: [
      {
        id: "body-composition",
        title: T("Anthropometry and body composition", "人体测量与身体成分"),
        explanation: [
          "Body mass, stature, girths, skinfolds, air displacement, hydrostatic weighing, and DXA each measure or estimate different constructs. No method is perfectly direct; hydration, technician skill, device algorithms, food intake, and recent exercise influence results.",
          "Use the same method, conditions, and technician for monitoring. Body-composition data should support performance and health decisions, not become a public ranking or source of stigma.",
        ],
        details: [
          "BMI describes mass relative to height but does not distinguish fat from lean tissue and can misclassify muscular athletes.",
          "Skinfold reliability depends strongly on landmarking, pinch technique, caliper use, and tester experience.",
          "Bioelectrical impedance is sensitive to hydration, temperature, food, and recent exercise.",
          "DXA estimates bone mineral content and regional tissue but still depends on device, software, positioning, and hydration.",
        ],
        decision: T("Choose the least invasive method that is reliable enough for the decision, and standardize before interpreting small change.", "选择足够可靠且侵入性最低的方法，并在解释小变化前标准化条件。"),
        examCue: T("A precise-looking percentage is still an estimate. Compare trends within one method, not values across methods.", "看似精确的百分比仍是估计；应在同一方法内看趋势，不要跨方法直接比较。"),
      },
      {
        id: "strength-power",
        title: T("Strength, isometric force, and power testing", "力量、等长力与功率测试"),
        explanation: [
          "A 1RM test measures exercise-specific maximal dynamic strength. Standardize range, technique, attempt progression, rest, and success criteria. Multiple-RM prediction reduces maximal exposure but introduces equation and fatigue error.",
          "Isometric tests such as the mid-thigh pull can quantify peak force and force-time variables with low movement skill when setup is standardized. Jump and throw tests estimate explosive performance, but calculation method and equipment affect reported power.",
        ],
        details: [
          "Allow adequate rest between maximal attempts and make load jumps smaller as the estimated maximum is approached.",
          "Relative strength helps compare differently sized athletes, while absolute strength matters for moving fixed external loads.",
          "Jump height can be derived from flight time or impulse; errors occur when takeoff and landing positions differ.",
          "Peak power, mean power, peak force, impulse, and rate of force development answer different questions.",
        ],
        decision: T("Select the metric that represents the performance need, then keep calculation and device method constant.", "选择代表表现需求的指标，并保持计算与设备方法一致。"),
        examCue: T("Do not call jump height 'power' unless power was actually calculated with mass and time/force information.", "除非结合质量和时间/力信息实际计算，否则不要把跳高直接称为功率。"),
      },
      {
        id: "speed-agility",
        title: T("Speed, change-of-direction, and agility testing", "速度、变向与敏捷测试"),
        explanation: [
          "Sprint splits reveal acceleration and maximal-speed qualities. Timing-gate height, start distance, stance, surface, footwear, wind, and instructions must be standardized. Hand timing adds substantial reaction and tester error.",
          "Change-of-direction tests use planned movement; agility includes a response to an external stimulus. A preplanned shuttle cannot independently measure perceptual decision skill.",
        ],
        details: [
          "Short splits emphasize acceleration; flying sprints isolate near-maximal speed after a buildup.",
          "Total change-of-direction time includes linear speed; use segment times or a deficit concept when trying to isolate turning ability.",
          "Repeated trials need sufficient recovery to avoid turning a speed test into a conditioning test.",
          "Reactive agility stimulus should be representative and scored for both movement time and decision quality when possible.",
        ],
        decision: T("If the sport problem is perception and decision, include a reactive stimulus; if it is braking mechanics, use a controlled planned task.", "若专项问题是感知与决策，应加入反应刺激；若是制动技术，则使用受控预设任务。"),
        examCue: T("Change of direction is preplanned; agility requires responding to a stimulus.", "变向是预设动作；敏捷要求对刺激作出反应。"),
      },
      {
        id: "capacity",
        title: T("Anaerobic and aerobic capacity tests", "无氧与有氧能力测试"),
        explanation: [
          "Anaerobic tests such as repeated sprints or cycle sprints measure peak power, mean power, fatigue, or work under specific protocols. Aerobic tests may directly measure gas exchange or estimate capacity from time, distance, stage, heart rate, or workload.",
          "Protocol selection should match mode and population. Estimation equations inherit error and should not be treated as direct laboratory measurement.",
        ],
        details: [
          "The Wingate test is highly fatiguing and mode-specific; it should be late in a battery.",
          "Yo-Yo and intermittent field tests reflect repeated high-intensity running and recovery better than continuous tests for some team sports.",
          "30-15 Intermittent Fitness Test output can guide intermittent-running prescription but is not interchangeable with VO2max.",
          "A submaximal heart-rate test assumes a predictable HR-workload relationship and is affected by heat, hydration, caffeine, medication, and fatigue.",
        ],
        decision: T("Use the protocol's actual output for prescription only when the prescription method was validated for that protocol.", "只有处方方法针对该测试方案得到验证时，才用其实际输出进行处方。"),
        examCue: T("A field-test speed is a protocol-specific result; do not label every final speed VO2max.", "场地测试速度是方案特定结果；不要把所有最终速度都称为 VO2max。"),
      },
      {
        id: "statistics",
        title: T("Descriptive statistics and athlete communication", "描述统计与运动员沟通"),
        explanation: [
          "The mean summarizes the arithmetic average, median the middle ordered value, and mode the most frequent value. Standard deviation describes spread around the mean. Percentile ranks locate a score within a reference group but do not measure change or causal effect.",
          "Interpret the athlete's change against measurement error, baseline trend, and program phase. Communicate uncertainty and practical action rather than presenting a dashboard without a decision.",
        ],
        details: [
          "Outliers may reflect true performance, error, protocol deviation, or data-entry problems; investigate before deletion.",
          "Correlation describes association, not causation. A strong relationship does not prove one variable caused another.",
          "Percent change can exaggerate differences when the baseline is small and should accompany raw values.",
          "Protect privacy by sharing only necessary information with authorized stakeholders.",
        ],
        decision: T("Report the result, confidence or variability, likely meaning, and the next training action in plain language.", "用清晰语言报告结果、置信或波动、可能含义和下一步训练行动。"),
        examCue: T("A team mean can hide individual responders. Program changes should consider individual trends and context.", "团队均值会掩盖个体反应；计划调整应考虑个体趋势与情境。"),
      },
    ],
    terms: [
      { term: "Mean", meaning: T("Sum of scores divided by number of scores.", "分数总和除以分数数量。") },
      { term: "Median", meaning: T("Middle value after scores are ordered.", "排序后的中间值。") },
      { term: "Standard deviation", meaning: T("Typical spread of scores around the mean.", "分数围绕均值的典型离散程度。") },
      { term: "Percentile", meaning: T("Percentage of the reference distribution at or below a score.", "参考分布中低于或等于该分数的百分比。") },
      { term: "Correlation", meaning: T("Direction and strength of association between variables.", "变量间关联的方向与强度。") },
    ],
    formulas: [
      { name: "Mean", expression: "Σx ÷ n", use: T("Summarize the arithmetic center of scores.", "汇总分数的算术中心。") },
      { name: "Percent change", expression: "(new − old) ÷ old × 100", use: T("Express change relative to baseline while also reporting raw change.", "相对基线表达变化，同时报告原始变化。") },
      { name: "Relative strength", expression: "1RM ÷ body mass", use: T("Compare strength while scaling for body mass.", "按体重标准化力量比较。") },
      { name: "Change-of-direction deficit", expression: "COD test time − equivalent linear sprint time", use: T("Separate turning cost from linear speed contribution.", "把转弯成本与直线速度贡献分开。") },
    ],
    examChecklist: [
      T("Choose and standardize one test for each major athletic quality.", "为每项主要运动能力选择并标准化一个测试。"),
      T("Separate score, metric, and interpretation: jump height is not automatically power.", "区分分数、指标与解释：跳高不自动等于功率。"),
      T("Calculate mean, percent change, z-score, relative strength, and COD deficit.", "计算均值、百分比变化、z 分数、相对力量和变向缺失。"),
    ],
    recall: [
      { prompt: T("Why can different jump devices report different results?", "为什么不同跳跃设备会报告不同结果？"), answer: T("They may use flight time, impulse, reach displacement, or different filtering and takeoff criteria; each method has distinct assumptions and error.", "它们可能使用腾空时间、冲量、触高位移或不同滤波与起跳标准，各有不同假设和误差。") },
      { prompt: T("What four elements belong in a result report?", "结果报告应包含哪四项？"), answer: T("The result, its uncertainty or normal variability, the likely practical meaning, and the training or communication action.", "结果、其不确定性或正常波动、可能的实际意义，以及训练或沟通行动。") },
    ],
  },
  {
    n: 15,
    title: T("Performance Preparation, Mobility, and Flexibility", "运动准备、灵活性与柔韧性"),
    domain: T("Exercise Technique", "运动技术"),
    minutes: 95,
    source: "Essentials, 5th ed., Ch. 15 · DCO Exercise Technique A, E",
    objectives: [
      T("Build a progressive warm-up that raises readiness without creating fatigue.", "建立提高准备度且不制造疲劳的渐进热身。"),
      T("Choose static, dynamic, ballistic, and PNF methods by goal, timing, athlete, and risk.", "按目标、时机、个体和风险选择静态、动态、弹震与 PNF。"),
    ],
    sections: [
      {
        id: "ramp",
        title: T("RAMP performance preparation", "RAMP 运动准备"),
        explanation: [
          "A warm-up should raise body temperature and circulation, activate relevant muscles and control, mobilize the ranges needed, and potentiate the speed or force of the upcoming task. The RAMP sequence—Raise, Activate/Mobilize, Potentiate—progresses from general preparation to specific rehearsal.",
          "A good warm-up is judged by readiness and performance, not by duration or sweat alone. It should reduce uncertainty, rehearse technique, and finish near the intensity of the first work set without excessive fatigue.",
        ],
        details: [
          "Raise: low-intensity movement that increases temperature, heart rate, and blood flow.",
          "Activate and mobilize: targeted control and dynamic range for the session's demands.",
          "Potentiate: progressive accelerations, jumps, throws, or warm-up sets that approach target force and velocity.",
          "Environmental conditions, athlete age, injury history, and time since the last activity change the required dose.",
        ],
        decision: T("Remove any warm-up drill that does not improve readiness, technique, confidence, or the next task.", "删除不能改善准备度、技术、信心或下一任务的热身动作。"),
        examCue: T("The warm-up becomes more specific and intense as it approaches performance, while total fatigue stays low.", "热身越接近正式表现越专项、强度越高，但总疲劳应保持低。"),
      },
      {
        id: "mobility-flexibility",
        title: T("Mobility, flexibility, and stability", "灵活性、柔韧性与稳定性"),
        explanation: [
          "Flexibility is the available range around a joint or series of joints. Mobility includes the ability to actively access and control range in a task. Stability is the capacity to control position and motion under load. A range limitation can arise from tissue tolerance, joint structure, neural protection, pain, weakness, or motor control.",
          "More range is not universally better. The athlete needs enough controllable range for the sport and exercise while retaining force, stiffness, and joint integrity.",
        ],
        details: [
          "Active range requires force and control; passive range can exceed what the athlete can use safely.",
          "Acute range increases may reflect increased stretch tolerance and altered neural response, not immediate permanent tissue lengthening.",
          "Pain, sudden asymmetry, neurological symptoms, or suspected joint pathology requires referral rather than aggressive stretching.",
          "Strength training through a suitable full range can improve mobility while building control.",
        ],
        decision: T("Identify whether the limiter is range, control, strength, pain, or task setup before choosing a mobility drill.", "先确定限制来自幅度、控制、力量、疼痛还是任务设置，再选择灵活性练习。"),
        examCue: T("Flexibility is range; mobility is usable controlled range. Do not prescribe stretching for every movement fault.", "柔韧性是幅度；灵活性是可用且受控的幅度。不要对所有动作问题都开拉伸。"),
      },
      {
        id: "stretching",
        title: T("Static, dynamic, ballistic, and PNF stretching", "静态、动态、弹震与 PNF 拉伸"),
        explanation: [
          "Static stretching holds a position; dynamic stretching moves actively through range; ballistic stretching uses faster bouncing or momentum; PNF combines stretching with muscle contraction. Each method can improve range when dosed appropriately, but the acute performance effect and skill requirement differ.",
          "Long, intense static stretching immediately before maximal strength or power can transiently reduce output. Shorter static work may be acceptable when a range restriction matters and is followed by dynamic, specific potentiation.",
        ],
        details: [
          "Dynamic stretching fits warm-ups because it raises temperature and rehearses movement while accessing range.",
          "Ballistic methods can be sport-relevant for trained athletes but require progression and control.",
          "PNF hold-relax and contract-relax methods use contraction to alter tolerance and neural response; partner communication is essential.",
          "Long-term flexibility work can be placed after training or in separate sessions when acute power is not the next priority.",
        ],
        decision: T("Use dynamic mobility before explosive work; place larger static-flexibility doses away from immediate maximal performance.", "爆发训练前使用动态灵活性；较大静态柔韧性剂量应远离即时最大表现。"),
        examCue: T("Timing matters: static stretching is not 'bad,' but a large acute dose can reduce immediate high-force or high-power output.", "时机很重要：静态拉伸并非“坏”，但较大急性剂量可降低即时高力量或高功率输出。"),
      },
      {
        id: "programming",
        title: T("Programming range of motion and restoration", "幅度训练与恢复安排"),
        explanation: [
          "Mobility adaptation requires repeated exposure at an effective intensity with adequate recovery, like other training. Combine positional breathing, active control, loaded range, and sport-specific speed according to the athlete's need.",
          "Restoration sessions may use low-intensity movement, breathing, and gentle range work to reduce arousal and support recovery, but they do not replace sleep, nutrition, or load management.",
        ],
        details: [
          "Progress from passive access to active control, then load and speed in the required range.",
          "Measure the task that matters rather than chasing a generic flexibility score.",
          "Do not force range through sharp pain or unstable joint positions.",
          "Reassess after the intervention to confirm that movement or performance actually improved.",
        ],
        decision: T("Earn range, control it, load it, then express it at sport speed.", "先获得幅度，再控制它、加载它，最后在专项速度下表达。"),
        examCue: T("Choose the least aggressive method that produces the required controllable range.", "选择能产生所需可控幅度的最低必要强度方法。"),
      },
    ],
    terms: [
      { term: "Flexibility", meaning: T("Available joint range of motion.", "可获得的关节活动范围。") },
      { term: "Mobility", meaning: T("Ability to actively access and control range in a task.", "在任务中主动获得并控制幅度的能力。") },
      { term: "Potentiation", meaning: T("Acute enhancement of performance after an appropriate conditioning activity.", "适当预备活动后表现的急性增强。") },
      { term: "PNF", meaning: T("Stretching methods combining passive movement and muscle contraction.", "结合被动活动与肌肉收缩的拉伸方法。") },
    ],
    formulas: [],
    examChecklist: [
      T("Build a RAMP warm-up for strength, sprint, and team-sport sessions.", "为力量、冲刺和团队运动课建立 RAMP 热身。"),
      T("Select stretching method and timing from the performance goal.", "依据表现目标选择拉伸方式与时机。"),
      T("Differentiate a range limitation from a control or pain problem.", "区分幅度限制、控制问题和疼痛问题。"),
    ],
    recall: [
      { prompt: T("What are the three RAMP phases?", "RAMP 的三个阶段是什么？"), answer: T("Raise; Activate and Mobilize; Potentiate.", "提高；激活与动员；增强。") },
      { prompt: T("When can static stretching be useful before performance?", "静态拉伸何时可在表现前使用？"), answer: T("When a specific range restriction limits safe performance, using a modest dose followed by dynamic and task-specific potentiation.", "当特定幅度限制安全表现时，可用适量静态拉伸，随后加入动态和任务特定增强。") },
    ],
  },
  {
    n: 16,
    title: T("Exercise Technique for Free Weight and Machine Training", "自由重量与器械训练技术"),
    domain: T("Exercise Technique", "运动技术"),
    minutes: 210,
    source: "Essentials, 5th ed., Ch. 16 · DCO Exercise Technique B",
    objectives: [
      T("Teach, observe, cue, and regress major free-weight and machine patterns.", "教授、观察、提示并回归主要自由重量和器械动作。"),
      T("Apply setup, breathing, spotting, and failure procedures safely.", "安全应用设置、呼吸、保护和失败处理流程。"),
    ],
    sections: [
      {
        id: "fundamentals",
        title: T("Setup, grip, breathing, and observation", "设置、握法、呼吸与观察"),
        explanation: [
          "Technique begins before the first repetition: inspect equipment, set rack height and safeties, select collars and load, establish stance and grip, confirm the movement standard, and clear the area. The coach observes from an angle that reveals the relevant joints without interfering.",
          "Breathing should support trunk stiffness and safety. In moderate work, exhale through the sticking region and inhale during the easier phase. Experienced healthy lifters may use a brief Valsalva for heavy attempts, but medical context and instruction matter.",
        ],
        details: [
          "Closed grips place the thumb around the bar and are generally safer than false grips.",
          "Neutral spinal position means a controlled, task-appropriate posture—not identical geometry for every athlete.",
          "Use collars when plate movement creates risk, except when a specific emergency-dumping protocol and environment dictates otherwise.",
          "Give one high-priority cue, observe the next repetition, and avoid overloading working memory.",
        ],
        decision: T("Correct immediate safety first, then the error with the largest effect on force transfer or the training goal.", "先纠正即时安全问题，再处理最影响力传递或训练目标的错误。"),
        examCue: T("Setup and safety are part of technique. The best answer often fixes rack, grip, spotter, or equipment before movement begins.", "设置和安全属于技术的一部分；最佳答案常在动作前先修正架位、握法、保护者或设备。"),
      },
      {
        id: "squat",
        title: T("Squat and lower-body patterns", "深蹲与下肢动作模式"),
        explanation: [
          "A squat coordinates hip, knee, and ankle flexion on descent and extension on ascent while the whole foot remains stable and the trunk resists unwanted motion. Stance, toe angle, depth, and torso angle vary with anatomy, bar position, footwear, and task.",
          "The bar or load should remain balanced over the base of support. A forward torso is not automatically an error; loss of balance, uncontrolled spinal motion, painful range, or a path that no longer serves the exercise is more important.",
        ],
        details: [
          "High-bar and front squats usually allow a more upright torso than low-bar squats because load position changes the system center of mass.",
          "Knees should track in a controlled direction compatible with the feet; rapid uncontrolled valgus under fatigue is a common correction target.",
          "Depth should match the goal and the athlete's controllable, pain-free range; partial range changes joint and muscle demand.",
          "Regress with goblet squat, box target, reduced load, tempo, or range; progress load, depth, speed, unilateral demand, or complexity.",
        ],
        decision: T("Keep the load balanced, the feet organized, and the joints moving through a controlled range that matches the goal.", "保持负荷平衡、足部稳定，关节在与目标匹配的受控幅度中运动。"),
        examCue: T("Do not choose a universal stance or forbid all forward knee travel; evaluate control, balance, anatomy, and task.", "不要选择统一站距或禁止所有膝盖前移；应评估控制、平衡、解剖和任务。"),
      },
      {
        id: "press-pull",
        title: T("Bench press, overhead press, and rowing", "卧推、过头推与划船"),
        explanation: [
          "The bench press requires stable contact, a controlled grip, organized scapular position, and a bar path that allows the forearms to transfer force efficiently. The overhead press stacks the system over the base while the shoulder blade upwardly rotates and the trunk resists excessive extension.",
          "Rows and pulldowns train shoulder extension or adduction with elbow flexion and scapular motion. The goal is controlled movement rather than fixing the scapula rigidly in every phase.",
        ],
        details: [
          "In the bench press, wrists remain stacked over forearms, the bar descends under control, and the elbows do not lose the chosen stable path.",
          "A liftoff should help position the bar without pulling the athlete out of the setup.",
          "Overhead pressing requires sufficient shoulder motion and trunk control; a landmine or incline press can regress the demand.",
          "Machine seat and axis should be adjusted to align the athlete and joint with the intended movement.",
        ],
        decision: T("Choose grip and path that allow stable joints, effective force transfer, and the intended muscle action without pain.", "选择能保持关节稳定、有效传力并产生目标肌肉动作且无疼痛的握法与路径。"),
        examCue: T("For machines, alignment and seat setup are common first corrections; for bench press, spotting and handoff matter.", "器械动作常先纠正轴线和座椅；卧推则要关注保护和起杠。"),
      },
      {
        id: "hinge",
        title: T("Deadlift, hinge, and pulling from the floor", "硬拉、髋铰链与地面拉起"),
        explanation: [
          "The hip hinge loads hip extensors while the trunk remains braced and the load stays close. In a deadlift, the athlete creates whole-body tension before the bar leaves the floor, pushes through the ground, and extends hip and knee without allowing the bar to drift forward.",
          "Conventional, sumo, trap-bar, Romanian, and block variations change stance, range, torso angle, moment arms, and technical demand. Select the variation from goal, anatomy, competency, and equipment.",
        ],
        details: [
          "The bar begins over the midfoot and close to the shins in common barbell deadlift setups.",
          "The shoulders and hips should rise in a coordinated pattern; an early hip rise can turn the lift into a less favorable stiff-leg pull.",
          "At lockout, finish with hip extension rather than excessive lumbar extension.",
          "Use elevated starts, kettlebell hinges, dowel feedback, or reduced load to teach the pattern.",
        ],
        decision: T("Shorten the external moment arm by keeping the load close and build tension before acceleration.", "保持负荷靠近身体以缩短外部力臂，并在加速前建立张力。"),
        examCue: T("'Bar close to body' is a high-value cue because it directly controls external torque.", "“杠铃贴近身体”是高价值提示，因为它直接控制外部力矩。"),
      },
      {
        id: "weightlifting",
        title: T("Weightlifting derivatives", "举重衍生动作"),
        explanation: [
          "Weightlifting derivatives develop rapid force and whole-body power. Pulling phases coordinate force into the ground, extension, and upward bar momentum; receiving phases require rapid repositioning and stable force absorption. Not every program needs the full competitive lifts.",
          "Teach from stable positions and simpler derivatives: jump-shrug or pull, hang variation, catch pattern, then more complex floor starts or jerk variations when justified.",
        ],
        details: [
          "The first pull establishes position; transition repositions the body; the second pull applies high force and velocity; turnover moves the athlete under the bar.",
          "The bar remains close to reduce unwanted horizontal displacement and improve control.",
          "A power catch is received above a full squat; the exact depth depends on bar height and athlete movement.",
          "Weightlifting movements need clear bailout space, bumper plates, platforms, and no traditional spotters on the moving bar.",
        ],
        decision: T("Use the simplest derivative that trains the desired force-velocity quality and that staff can coach safely.", "使用能训练目标力-速度能力且教练团队能安全指导的最简单衍生动作。"),
        examCue: T("Olympic-lift bars are not spotted through a failed repetition; athletes release safely in a prepared area.", "举重动作失败时不由保护者跟杠；运动员应在准备好的区域安全弃杠。"),
      },
      {
        id: "spotting",
        title: T("Spotting and failed-repetition procedures", "保护与失败重复流程"),
        explanation: [
          "Spotting reduces consequence when a free-weight repetition fails, but it does not replace correct rack setup, safeties, load selection, and communication. The lifter and spotter agree on handoff, repetition count, and intervention cue before the set.",
          "Spotter number and position depend on the lift and load. Bench press commonly uses a head spotter; heavy squats may use side spotters and rack safeties. Dumbbell movements require control at the wrists or forearms rather than the elbows when assistance is necessary.",
        ],
        details: [
          "The spotter maintains a stable base and stays close without touching until assistance is needed.",
          "Use an appropriate grip for the bar and coordinate multiple spotters with one clear leader.",
          "Power exercises and Olympic lifts use safe release procedures rather than conventional spotting.",
          "Machines still require pin, range, seat, cable, and emergency-stop checks.",
        ],
        decision: T("If a lift cannot be safely spotted or released in the current environment, change the exercise or setup.", "若当前环境无法安全保护或弃杠，就必须改变动作或设置。"),
        examCue: T("Spot the implement where control can be maintained; do not grab a lifter's joint or obstruct the bar path.", "应在能保持控制的位置保护器械，不要抓运动员关节或阻挡杠铃路径。"),
      },
    ],
    terms: [
      { term: "Closed grip", meaning: T("Thumb wraps around the implement to secure the grip.", "拇指环绕器械形成安全握法。") },
      { term: "Valsalva maneuver", meaning: T("Brief breath hold against a closed glottis to increase trunk pressure and stiffness.", "短暂闭合声门屏息以提高躯干压力和刚度。") },
      { term: "Sticking region", meaning: T("Range where the lifter has greatest difficulty overcoming the load.", "运动员最难克服负荷的动作区间。") },
      { term: "Weightlifting derivative", meaning: T("A pull, catch, or drive variation derived from Olympic weightlifting.", "源自奥林匹克举重的拉、接或驱动变式。") },
    ],
    formulas: [],
    examChecklist: [
      T("Teach setup, execution, breathing, and safety for squat, bench, hinge, press, row, and weightlifting pull.", "教授深蹲、卧推、髋铰链、推、拉和举重拉的设置、执行、呼吸与安全。"),
      T("Choose spotter number and position for bench, squat, and dumbbell exercises.", "为卧推、深蹲和哑铃动作选择保护者数量与位置。"),
      T("Prioritize one correction from a described or visual technique fault.", "从描述或视觉技术错误中选出最高优先级纠正。"),
    ],
    recall: [
      { prompt: T("What are the first three checks before a loaded set?", "负重组开始前最先检查哪三项？"), answer: T("Equipment and load security, rack/safety setup, and athlete stance/grip plus the agreed movement and spotting procedure.", "设备与负荷安全、架位/安全杆设置，以及运动员站位握法和约定动作/保护流程。") },
      { prompt: T("Why does keeping the bar close help a deadlift?", "为什么杠铃贴近身体有助于硬拉？"), answer: T("It shortens the external moment arm, reducing trunk and hip torque demand for the same load.", "它缩短外部力臂，使相同负荷下躯干和髋部力矩需求降低。") },
    ],
  },
  {
    n: 17,
    title: T("Exercise Technique for Alternative Modes and Nontraditional Implement Training", "替代与非传统器械训练技术"),
    domain: T("Exercise Technique", "运动技术"),
    minutes: 110,
    source: "Essentials, 5th ed., Ch. 17 · DCO Exercise Technique B3",
    objectives: [
      T("Select and coach bodyweight, core, unstable, variable-resistance, and nontraditional-implement training.", "选择并指导自重、核心、不稳定、变阻力和非传统器械训练。"),
      T("Match novelty to a measurable adaptation rather than using complexity for its own sake.", "让新颖性服务于可测适应，而不是为复杂而复杂。"),
    ],
    sections: [
      {
        id: "bodyweight",
        title: T("Bodyweight and suspension training", "自重与悬吊训练"),
        explanation: [
          "Bodyweight resistance can be progressed through leverage, range, tempo, unilateral loading, instability, external load, or repetition density. It is not inherently low intensity; task mechanics determine relative demand.",
          "Suspension systems change body angle and stability, allowing rapid scaling. Anchor integrity, floor traction, body-line control, and clearance are primary safety concerns.",
        ],
        details: [
          "Push-up load increases as the center of mass shifts toward the hands or feet are elevated.",
          "Assistance can be changed through hand support, box height, counterbalance, or shortened range.",
          "High repetitions train local endurance only if technique and range remain consistent.",
          "Use objective progression rather than assuming a more unusual variation is better.",
        ],
        decision: T("Progress one mechanical variable while keeping the target movement and quality recognizable.", "每次推进一个机械变量，同时保持目标动作和质量清晰。"),
        examCue: T("Bodyweight does not mean fixed load; leverage and supported body mass change resistance substantially.", "自重不等于固定负荷；杠杆和被支撑体重比例会显著改变阻力。"),
      },
      {
        id: "core-balance",
        title: T("Core stability, balance, and unstable surfaces", "核心稳定、平衡与不稳定表面"),
        explanation: [
          "Core training transfers force and controls trunk position across anti-extension, anti-flexion, anti-rotation, anti-lateral-flexion, and dynamic patterns. Balance training manipulates base of support, center of mass, sensory input, and task demand.",
          "Instability increases stabilizing and attentional demand but usually reduces the external force and power that can be produced. It is useful when the goal is control or rehabilitation, not automatically when maximal strength or power is the priority.",
        ],
        details: [
          "Begin with breathing and bracing, then integrate limb motion, load, speed, and sport-relevant positions.",
          "Removing vision or narrowing the base changes sensory and mechanical challenge; provide fall protection.",
          "Stable surfaces are preferred for high-force barbell work because they permit greater output and safer load handling.",
          "The trunk should be trained to transmit and produce force, not merely to remain rigid in all movement.",
        ],
        decision: T("Use instability only when the reduced force output is acceptable for the intended adaptation.", "只有当降低力量输出不妨碍目标适应时才使用不稳定性。"),
        examCue: T("Unstable-surface training is not the best choice for maximal force or power development.", "不稳定表面训练不是发展最大力量或功率的最佳选择。"),
      },
      {
        id: "variable-resistance",
        title: T("Bands, chains, and flywheel resistance", "弹力带、链条与飞轮阻力"),
        explanation: [
          "Bands and chains can increase resistance as they stretch or lift from the floor, potentially matching an ascending strength curve and encouraging acceleration. They also change stability and bar behavior, so total load and setup must be controlled.",
          "Flywheels store kinetic energy during the concentric phase and return it during the eccentric phase. Eccentric demand depends on how the athlete brakes the rotating mass rather than a fixed external weight.",
        ],
        details: [
          "Quantify band or chain contribution at relevant positions instead of reporting only bar weight.",
          "Anchor bands securely and inspect for wear; a failed band can cause injury.",
          "Flywheel familiarization is essential because timing determines eccentric overload.",
          "Variable resistance is a tool for a specific profile, not a replacement for all constant-resistance training.",
        ],
        decision: T("Use variable resistance when its profile solves a force-velocity or range-specific problem and can be measured safely.", "当变阻力曲线能解决力-速度或特定幅度问题且可安全测量时使用。"),
        examCue: T("Report total resistance across the range; '50 kg plus bands' is incomplete without band tension.", "应报告全幅度总阻力；“50 kg 加弹力带”若无带张力信息并不完整。"),
      },
      {
        id: "implements",
        title: T("Sleds, ropes, tires, sandbags, kettlebells, and medicine balls", "雪橇、战绳、轮胎、沙袋、壶铃与药球"),
        explanation: [
          "Nontraditional implements can provide horizontal force, carrying, throwing, grip, trunk, and conditioning options. Their value comes from the force direction and task, not novelty. Technique standards must reflect the implement's moving center of mass and release path.",
          "Sled work reduces eccentric loading during forward propulsion; medicine balls permit true release and high acceleration; sandbags and water-filled loads create shifting resistance; ropes create repeated upper-body and trunk power demands.",
        ],
        details: [
          "Sled load, surface friction, harness angle, and speed determine demand, so plate mass alone is not comparable across surfaces.",
          "Medicine-ball throws need a clear impact and rebound area and a ball designed for the intended use.",
          "Tire flips require hip and leg drive with close body position; avoid curling the tire with a rounded trunk.",
          "Kettlebell swings are ballistic hinges, not slow squats or shoulder raises.",
        ],
        decision: T("Define the target—horizontal force, release power, work capacity, grip, or trunk control—then choose the simplest implement that delivers it.", "先明确目标是水平力、释放功率、工作能力、握力还是躯干控制，再选最简单可实现的器械。"),
        examCue: T("Surface and friction are part of sled load; plate mass alone does not define intensity.", "地面和摩擦属于雪橇负荷的一部分；仅看杠铃片重量不能定义强度。"),
      },
      {
        id: "unilateral",
        title: T("Unilateral training and asymmetry", "单侧训练与不对称"),
        explanation: [
          "Unilateral training increases per-limb demand, balance, frontal- and transverse-plane control, and can train around equipment or injury constraints. It may expose asymmetry, but a difference is not automatically pathological or predictive of injury.",
          "Bilateral training permits greater total external loading and remains important when the sport requires high bilateral force. Most programs use both according to the needs analysis.",
        ],
        details: [
          "Rear-foot-elevated split squats change support and hip position but are not universally superior to bilateral squats.",
          "Single-arm loading creates trunk anti-rotation and lateral-flexion demand.",
          "Compare sides with a reliable test and account for normal variability before labeling asymmetry.",
          "Use the weaker or less skilled side first when fatigue could otherwise widen the difference, while keeping total dose appropriate.",
        ],
        decision: T("Use unilateral work to target per-limb force and control; use bilateral work when total force and sport transfer justify it.", "单侧训练用于每侧力量与控制；双侧训练用于总力量和专项迁移。"),
        examCue: T("Asymmetry is information, not a diagnosis. Interpret magnitude, reliability, task, and history.", "不对称是信息，不是诊断；应结合幅度、信度、任务和历史解释。"),
      },
    ],
    terms: [
      { term: "Variable resistance", meaning: T("Resistance that changes through the movement range.", "随动作幅度变化的阻力。") },
      { term: "Eccentric overload", meaning: T("Eccentric demand exceeds the concentric load or capacity used in the same repetition.", "同一重复中离心需求超过向心负荷或能力。") },
      { term: "Anti-rotation", meaning: T("Resisting unwanted rotation of the trunk.", "抵抗躯干不必要旋转。") },
      { term: "Unilateral deficit", meaning: T("Difference between bilateral output and the sum of separate unilateral outputs.", "双侧输出与两侧单独输出之和的差异。") },
    ],
    formulas: [
      { name: "Asymmetry percentage", expression: "|right − left| ÷ larger side × 100", use: T("Describe side-to-side difference while also considering test error and task relevance.", "描述左右差异，同时考虑测试误差与任务相关性。") },
    ],
    examChecklist: [
      T("Progress a bodyweight pattern using leverage, range, tempo, and unilateral demand.", "用杠杆、幅度、节奏和单侧需求进阶自重动作。"),
      T("Explain when instability supports or conflicts with the goal.", "解释不稳定性何时支持或冲突于目标。"),
      T("Coach safe setup for bands, flywheel, sled, medicine ball, tire, and kettlebell.", "指导弹力带、飞轮、雪橇、药球、轮胎和壶铃的安全设置。"),
    ],
    recall: [
      { prompt: T("Why can unstable training reduce power development?", "为什么不稳定训练可能降低功率发展？"), answer: T("The athlete must allocate control to stabilization and usually cannot apply as much external force or velocity.", "运动员必须分配控制资源用于稳定，通常无法施加同样大的外力或速度。") },
      { prompt: T("Why is sled plate mass not a complete intensity measure?", "为什么雪橇杠铃片重量不是完整强度指标？"), answer: T("Surface friction, sled design, attachment angle, athlete speed, and technique materially change the required force.", "地面摩擦、雪橇设计、连接角度、运动员速度和技术都会显著改变所需力量。") },
    ],
  },
];

