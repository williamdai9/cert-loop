export type Section = "科学基础" | "实践应用";
export type DomainId =
  | "exercise-science"
  | "sport-psychology"
  | "nutrition"
  | "program-design"
  | "exercise-technique"
  | "implementation"
  | "organization";

export type Question = {
  id: string;
  section: Section;
  domain: DomainId;
  cognition: "记忆" | "应用" | "分析";
  prompt: string;
  options: [string, string, string];
  answer: number;
  explanation: string;
  source: string;
  en?: { prompt: string; options: [string, string, string]; explanation: string };
};

export const domains = [
  { id: "exercise-science", section: "科学基础", label: "运动科学", en: "Exercise Science", weight: 60, questions: 48, color: "#496A5D" },
  { id: "sport-psychology", section: "科学基础", label: "运动心理学", en: "Sport Psychology", weight: 25, questions: 20, color: "#7B6A9B" },
  { id: "nutrition", section: "科学基础", label: "营养", en: "Nutrition", weight: 15, questions: 12, color: "#B27742" },
  { id: "program-design", section: "实践应用", label: "计划设计", en: "Program Design", weight: 40, questions: 44, color: "#496A5D" },
  { id: "exercise-technique", section: "实践应用", label: "运动技术", en: "Exercise Technique", weight: 25, questions: 28, color: "#B27742" },
  { id: "implementation", section: "实践应用", label: "计划实施", en: "Program Implementation", weight: 20, questions: 22, color: "#63809B" },
  { id: "organization", section: "实践应用", label: "组织与管理", en: "Organization & Administration", weight: 15, questions: 16, color: "#9A5D58" },
] as const;

export const chapters = [
  { n: 1, title: "身体系统的结构与功能", en: "Structure and Function of Body Systems", domain: "运动科学" },
  { n: 2, title: "抗阻运动的生物力学", en: "Biomechanics of Resistance Exercise", domain: "运动科学" },
  { n: 3, title: "运动与训练的生物能量学", en: "Bioenergetics of Exercise and Training", domain: "运动科学" },
  { n: 4, title: "抗阻运动与训练的内分泌反应", en: "Endocrine Responses", domain: "运动科学" },
  { n: 5, title: "无氧训练的适应", en: "Adaptations to Anaerobic Training", domain: "运动科学" },
  { n: 6, title: "有氧训练的适应", en: "Adaptations to Aerobic Training", domain: "运动科学" },
  { n: 7, title: "年龄差异与抗阻训练", en: "Age-Related Differences", domain: "运动科学" },
  { n: 8, title: "性别差异与抗阻训练", en: "Sex-Related Differences", domain: "运动科学" },
  { n: 9, title: "运动表现的心理学基础", en: "Psychological Foundations", domain: "运动心理学" },
  { n: 10, title: "影响健康的基础营养因素", en: "Basic Nutritional Factors", domain: "营养" },
  { n: 11, title: "最大化表现的营养策略", en: "Nutrition Strategies", domain: "营养" },
  { n: 12, title: "提升表现的物质与方法", en: "Performance-Enhancing Substances", domain: "营养" },
  { n: 13, title: "测试选择与实施原则", en: "Test Selection and Administration", domain: "计划实施" },
  { n: 14, title: "测试的实施、评分与解读", en: "Scoring and Interpretation", domain: "计划实施" },
  { n: 15, title: "运动准备、灵活性与柔韧性", en: "Performance Preparation", domain: "运动技术" },
  { n: 16, title: "自由重量与器械训练技术", en: "Free Weight and Machine Technique", domain: "运动技术" },
  { n: 17, title: "替代与非传统训练技术", en: "Alternative Training Modes", domain: "运动技术" },
  { n: 18, title: "抗阻训练计划设计", en: "Resistance Training Program Design", domain: "计划设计" },
  { n: 19, title: "增强式训练设计与技术", en: "Plyometric Training", domain: "计划设计" },
  { n: 20, title: "速度与敏捷训练设计", en: "Speed and Agility Training", domain: "计划设计" },
  { n: 21, title: "有氧耐力与代谢训练设计", en: "Aerobic and Metabolic Training", domain: "计划设计" },
  { n: 22, title: "周期化", en: "Periodization", domain: "计划设计" },
  { n: 23, title: "康复、重建与医疗问题", en: "Rehabilitation and Reconditioning", domain: "计划设计" },
  { n: 24, title: "过度训练与恢复", en: "Overtraining and Recovery", domain: "计划实施" },
  { n: 25, title: "设施设计、布局与组织", en: "Facility Design and Layout", domain: "组织与管理" },
  { n: 26, title: "设施政策、程序与法律问题", en: "Policies, Procedures and Legal Issues", domain: "组织与管理" },
];

export const basePlan = [
  { id: "w1", title: "建立坐标系", subtitle: "诊断 + 解剖与生理", chapters: "第 1–2 章", domain: "运动科学", tasks: ["完成 30 题诊断测试", "梳理肌节、运动单位与肌纤维类型", "掌握三平面、力矩、功率和杠杆", "制作 20 张解剖闪卡"] },
  { id: "w2", title: "能量与适应", subtitle: "把训练变量连到生理结果", chapters: "第 3–6 章", domain: "运动科学", tasks: ["画出三大供能系统时间轴", "记忆常见做功:休息比", "比较无氧与有氧训练适应", "完成 40 道运动科学题"] },
  { id: "w3", title: "个体差异与心理", subtitle: "年龄、性别、心理技能与转介", chapters: "第 7–9 章", domain: "运动科学 / 心理学", tasks: ["对比青少年、老年与女性训练注意事项", "掌握唤醒、焦虑、动机与注意", "建立 ABC 心理困扰识别流程", "完成科学基础小测"] },
  { id: "w4", title: "营养决策", subtitle: "摄入、时机、补剂与职业边界", chapters: "第 10–12 章", domain: "营养", tasks: ["整理宏量营养与补液公式", "比较赛前、赛中与赛后策略", "掌握 RED-S 与进食障碍转介", "完成 30 道营养题"] },
  { id: "w5", title: "测试与评估", subtitle: "选择、排序、信效度与解读", chapters: "第 13–14 章", domain: "计划实施", tasks: ["掌握测试顺序与休息规则", "区分信度、效度与最小变化", "练习单位换算与描述统计", "完成一次测试评估专题卷"] },
  { id: "w6", title: "动作教学", subtitle: "准备活动、自由重量与保护", chapters: "第 15–17 章", domain: "运动技术", tasks: ["复习动态热身与 PNF", "逐项口述深蹲、卧推、硬拉技术", "练习保护与安全站位", "观看动作并写出三条纠错提示"] },
  { id: "w7", title: "抗阻计划", subtitle: "需求分析到负荷进阶", chapters: "第 18 章", domain: "计划设计", tasks: ["完成一份项目需求分析", "记忆目标对应组次、负荷与休息", "掌握 2-for-2 加重法则", "设计一周力量训练微周期"] },
  { id: "w8", title: "爆发、速度与敏捷", subtitle: "技术、剂量和专项性", chapters: "第 19–20 章", domain: "计划设计", tasks: ["比较跳跃落地与跳深进阶", "拆解加速、最大速度与减速", "设计一节增强式训练", "完成 40 道实践应用题"] },
  { id: "w9", title: "代谢与周期化", subtitle: "有氧处方、赛季与负荷管理", chapters: "第 21–22 章", domain: "计划设计", tasks: ["练习 Karvonen 强度计算", "比较线性与非线性周期化", "绘制赛季年度计划", "完成计划设计专题卷"] },
  { id: "w10", title: "恢复、重建与风险", subtitle: "合作边界与安全管理", chapters: "第 23–26 章", domain: "实施 / 组织管理", tasks: ["区分超量恢复、过度伸展与过度训练", "梳理重返运动团队分工", "记忆设施布局与应急流程", "完成组织管理专题卷"] },
  { id: "w11", title: "第一次整合", subtitle: "按官方权重模拟并补漏洞", chapters: "全书", domain: "综合", tasks: ["完成科学基础计时模拟", "完成实践应用计时模拟", "按领域统计正确率", "重做全部错题并写一句规则"] },
  { id: "w12", title: "考前收口", subtitle: "低负荷、高准确率、稳节奏", chapters: "高频错点", domain: "综合", tasks: ["完成一次全真节奏模拟", "只复习错题与低信心题", "复盘公式和红线规则", "考前一天停止高负荷刷题"] },
];

export const quickCards = [
  { tag: "生物力学", front: "功率 Power", back: "功率 = 做功 ÷ 时间；也可表示为力 × 速度。" },
  { tag: "能量系统", front: "10 秒以内的最大爆发", back: "以磷酸原系统为主；训练设计通常匹配更长恢复。" },
  { tag: "测试顺序", front: "非疲劳测试优先", back: "静态指标 → 敏捷 → 最大力量/功率 → 冲刺 → 局部耐力 → 无氧能力 → 有氧能力。" },
  { tag: "计划设计", front: "2-for-2 法则", back: "连续两次训练，在最后一组都超过目标 2 次，下次训练增加负荷。" },
  { tag: "营养", front: "液体损失换算", back: "训练前后每减少 1 kg 体重，约代表 1 L 液体损失。" },
  { tag: "心理", front: "识别心理困扰第一步", back: "观察并分类 Affect、Behavior、Cognition；超出职责范围时转介。" },
  { tag: "运动科学", front: "早期力量快速上升", back: "未训练者最初数周主要来自神经适应，而不是肌纤维数量增加。" },
  { tag: "增强式", front: "拉伸—缩短周期", back: "离心预拉伸 → 偿还/转换期 → 向心阶段；转换越快越能保留弹性能。" },
  { tag: "组织管理", front: "标准照护义务", back: "按同等条件下合理、审慎的专业人员应有的行为标准行事。" },
  { tag: "新增测试", front: "30–15 IFT", back: "30 秒跑、15 秒走，适合间歇型团队运动，并以 VIFT 处方。" },
  { tag: "测试", front: "信度 vs 效度", back: "信度是一致性；效度是测到了声称要测的能力。" },
  { tag: "恢复", front: "功能性过度伸展", back: "短期表现下降，充分恢复后可超量反弹；与长期过度训练综合征不同。" },
];

export const questions: Question[] = [
  { id: "es01", section: "科学基础", domain: "exercise-science", cognition: "记忆", prompt: "肌肉收缩时，哪种蛋白承担主要的粗肌丝结构？", options: ["肌动蛋白 Actin", "肌球蛋白 Myosin", "原肌球蛋白 Tropomyosin"], answer: 1, explanation: "肌球蛋白构成粗肌丝；肌动蛋白构成细肌丝。", source: "第 1 章" },
  { id: "es02", section: "科学基础", domain: "exercise-science", cognition: "应用", prompt: "一名未训练运动员进行力量训练 3 周后，1RM 明显提高，最可能的首要原因是什么？", options: ["肌纤维数量增加", "神经肌肉效率提高", "Ⅰ型纤维横截面积下降"], answer: 1, explanation: "训练早期的快速力量增长主要来自运动单位募集、同步与神经驱动改善。", source: "第 5 章" },
  { id: "es03", section: "科学基础", domain: "exercise-science", cognition: "记忆", prompt: "侧平举上举阶段，肩关节主要发生哪种动作和平面组合？", options: ["外展 / 额状面", "屈曲 / 矢状面", "水平外展 / 水平面"], answer: 0, explanation: "侧平举主要是肩外展，发生在额状面。", source: "第 2 章" },
  { id: "es04", section: "科学基础", domain: "exercise-science", cognition: "应用", prompt: "同一外力作用下，力臂变长会怎样影响关节力矩？", options: ["力矩减小", "力矩不变", "力矩增大"], answer: 2, explanation: "力矩 = 力 × 垂直力臂；力不变时，力臂越长，力矩越大。", source: "第 2 章" },
  { id: "es05", section: "科学基础", domain: "exercise-science", cognition: "分析", prompt: "训练目标是反复完成约 6 秒最大冲刺。最合适的做功与恢复设计是？", options: ["6 秒做功，约 3–5 分钟恢复", "60 秒做功，30 秒恢复", "20 分钟连续低强度"], answer: 0, explanation: "短时最大输出主要依赖磷酸原系统，需要较充分恢复以维持功率。", source: "第 3 章" },
  { id: "es06", section: "科学基础", domain: "exercise-science", cognition: "记忆", prompt: "哪种感受器主要监测肌腱张力？", options: ["肌梭", "高尔基腱器官", "游离神经末梢"], answer: 1, explanation: "高尔基腱器官对肌腱张力敏感；肌梭主要感受肌长和变化速度。", source: "第 1 章" },
  { id: "sp01", section: "科学基础", domain: "sport-psychology", cognition: "记忆", prompt: "识别运动员心理困扰迹象时，合理的第一步是什么？", options: ["立即做临床诊断", "观察情感、行为与认知", "停止其全部训练"], answer: 1, explanation: "体能教练先观察 ABC（Affect, Behavior, Cognition），再判断是否需要转介。", source: "第 9 章" },
  { id: "sp02", section: "科学基础", domain: "sport-psychology", cognition: "应用", prompt: "运动员在赛前过度紧张、注意范围变窄。最合适的即时策略是？", options: ["提高训练量", "节律呼吸并使用过程提示词", "讨论长期合同"], answer: 1, explanation: "呼吸调节配合简短的任务相关自我对话，有助于降低过高唤醒并重定向注意。", source: "第 9 章" },
  { id: "sp03", section: "科学基础", domain: "sport-psychology", cognition: "记忆", prompt: "自我决定理论强调哪三项基本心理需要？", options: ["自主、胜任、关系", "力量、速度、耐力", "奖励、惩罚、比较"], answer: 0, explanation: "Autonomy、competence 与 relatedness 是自我决定理论的核心需要。", source: "第 9 章" },
  { id: "sp04", section: "科学基础", domain: "sport-psychology", cognition: "分析", prompt: "运动员连续 3 周情绪低落、睡眠改变并退出社交。体能教练最合适的做法是？", options: ["自行进行心理治疗", "保密观察，不采取行动", "表达关切并转介合格心理专业人员"], answer: 2, explanation: "持续且影响生活功能的迹象超出体能教练执业范围，应支持性沟通并转介。", source: "第 9 章" },
  { id: "sp05", section: "科学基础", domain: "sport-psychology", cognition: "应用", prompt: "学习全新举重动作时，哪种反馈安排更有利于长期学习？", options: ["每次重复后都给大量指令", "逐步降低反馈频率", "只在数周后给一次反馈"], answer: 1, explanation: "初期可多反馈，随后渐退可促进运动员独立发现和保持技能。", source: "第 9 章" },
  { id: "sp06", section: "科学基础", domain: "sport-psychology", cognition: "记忆", prompt: "将注意集中在“把地面推开”属于哪类提示？", options: ["外部注意焦点", "内部注意焦点", "结果目标"], answer: 0, explanation: "提示关注动作对环境的效果，属于外部注意焦点。", source: "第 9 章" },
  { id: "nu01", section: "科学基础", domain: "nutrition", cognition: "应用", prompt: "一名 70 kg 运动员目标蛋白质摄入为 1.6 g/kg/天，每天约需多少蛋白质？", options: ["70 g", "112 g", "160 g"], answer: 1, explanation: "70 × 1.6 = 112 g/天。", source: "第 10–11 章" },
  { id: "nu02", section: "科学基础", domain: "nutrition", cognition: "记忆", prompt: "哪种情况最明确需要转介注册营养师或医疗专业人员？", options: ["询问训练后零食选择", "希望了解一般补水原则", "出现限制饮食、闭经与反复应力性骨折"], answer: 2, explanation: "该组合提示低能量可用性/RED-S 风险，需要跨专业评估。", source: "第 11 章" },
  { id: "nu03", section: "科学基础", domain: "nutrition", cognition: "应用", prompt: "运动前后体重从 80.0 kg 降到 78.8 kg，期间未饮水。液体损失约为多少？", options: ["0.6 L", "1.2 L", "2.4 L"], answer: 1, explanation: "体重每下降约 1 kg，近似代表 1 L 液体损失。", source: "第 10 章" },
  { id: "nu04", section: "科学基础", domain: "nutrition", cognition: "分析", prompt: "一项补剂声称“临床证明”，但未披露剂量、研究设计或第三方检测。最合理的判断是？", options: ["可直接推荐", "把宣传语视为充分证据", "证据与安全性不足，先核查独立研究和第三方认证"], answer: 2, explanation: "补剂监管有限，应核查研究质量、有效剂量与 NSF Certified for Sport 等第三方检测。", source: "第 12 章" },
  { id: "nu05", section: "科学基础", domain: "nutrition", cognition: "记忆", prompt: "高强度训练时，骨骼肌最直接、最快利用的血糖来源是？", options: ["碳水化合物", "膳食纤维", "酒精"], answer: 0, explanation: "碳水化合物提供血糖与肌糖原，是高强度运动的重要燃料。", source: "第 10 章" },
  { id: "nu06", section: "科学基础", domain: "nutrition", cognition: "应用", prompt: "运动员赛前 60 分钟容易胃肠不适，最适合优先尝试哪种餐食？", options: ["高脂高纤大餐", "熟悉、低脂低纤且易消化的碳水", "首次尝试高剂量补剂"], answer: 1, explanation: "临近比赛应选择熟悉、易消化的食物，减少脂肪和纤维以降低胃肠负担。", source: "第 11 章" },
  { id: "pd01", section: "实践应用", domain: "program-design", cognition: "记忆", prompt: "设计训练计划的第一步是什么？", options: ["选择练习顺序", "进行需求分析", "决定休息时间"], answer: 1, explanation: "需求分析先评估项目需求和运动员特征，再进入变量选择。", source: "第 18 章" },
  { id: "pd02", section: "实践应用", domain: "program-design", cognition: "应用", prompt: "运动员连续两次训练都在最后一组超过目标重复次数 2 次。下一次应怎样处理？", options: ["适度增加负荷", "立即减少训练频率", "保持负荷至少一个月"], answer: 0, explanation: "这满足 2-for-2 法则，可在下次训练适度加重。", source: "第 18 章" },
  { id: "pd03", section: "实践应用", domain: "program-design", cognition: "分析", prompt: "赛季中篮球运动员每周比赛两次、疲劳上升。力量训练的首要调整是？", options: ["增加总量以补偿比赛", "保留强度、降低训练量并远离比赛安排", "完全取消所有力量刺激"], answer: 1, explanation: "赛季中通常维持关键强度和动作质量，同时降低总量并管理与比赛的间隔。", source: "第 22 章" },
  { id: "pd04", section: "实践应用", domain: "program-design", cognition: "应用", prompt: "目标是最大功率，哪种练习顺序最合理？", options: ["高技术爆发练习 → 核心力量练习 → 辅助练习", "辅助单关节 → 耐力跑 → 高翻", "静态拉伸 → 力竭组 → 跳跃"], answer: 0, explanation: "高速度、高技术和高功率动作应在疲劳较低时优先安排。", source: "第 18 章" },
  { id: "pd05", section: "实践应用", domain: "program-design", cognition: "分析", prompt: "排球运动员刚掌握基础双脚落地。下一步最合理的增强式进阶是？", options: ["立即进行高箱深跳", "低强度双脚跳并逐渐加入方向变化", "负重至力竭跳跃"], answer: 1, explanation: "增强式进阶应先保证落地能力，再逐步增加强度、方向与单侧需求。", source: "第 19 章" },
  { id: "pd06", section: "实践应用", domain: "program-design", cognition: "应用", prompt: "22 岁运动员静息心率 60 bpm，按 Karvonen 法以 70% 强度训练，目标心率约为？", options: ["139 bpm", "157 bpm", "179 bpm"], answer: 1, explanation: "HRR=(198−60)=138；138×0.70+60≈157 bpm。", source: "第 21 章" },
  { id: "et01", section: "实践应用", domain: "exercise-technique", cognition: "记忆", prompt: "杠铃卧推时，保护者最合适的基本站位是？", options: ["站在练习者头后，双手靠近杠铃", "站在练习者脚边", "坐在相邻训练凳上"], answer: 0, explanation: "卧推保护者站在头后，保持稳定站姿并准备以交替握或合适握法协助。", source: "第 16 章" },
  { id: "et02", section: "实践应用", domain: "exercise-technique", cognition: "分析", prompt: "深蹲上升时运动员膝内扣。最直接且简洁的纠错提示是？", options: ["膝盖沿脚尖方向推出", "抬高下巴", "加快离心速度"], answer: 0, explanation: "提示膝盖追踪脚尖方向，可直接针对额状面控制问题。", source: "第 16 章" },
  { id: "et03", section: "实践应用", domain: "exercise-technique", cognition: "记忆", prompt: "PNF 收缩—放松法通常在哪一步加入主动肌肉收缩？", options: ["目标肌等长或向心收缩后再拉伸", "仅被动保持，不收缩", "先完成冲刺再拉伸"], answer: 0, explanation: "PNF 利用收缩与后续拉伸提高活动范围，具体程序需控制强度与伙伴配合。", source: "第 15 章" },
  { id: "et04", section: "实践应用", domain: "exercise-technique", cognition: "应用", prompt: "教授初学者硬拉时，哪个提示最能帮助保持杠铃靠近身体？", options: ["把杠铃贴着腿向上拉", "让杠铃绕过膝盖", "脚跟离地"], answer: 0, explanation: "杠铃贴近身体可缩短外部力臂并帮助维持稳定路径。", source: "第 16 章" },
  { id: "et05", section: "实践应用", domain: "exercise-technique", cognition: "分析", prompt: "运动员落地时声音很大、髋膝屈曲不足。最佳回归练习是？", options: ["更高箱深跳", "低高度下落并练习安静、髋膝同步缓冲", "连续单腿跨栏跳"], answer: 1, explanation: "先降低任务强度，建立柔和、受控的着地机制，再逐步进阶。", source: "第 19 章" },
  { id: "et06", section: "实践应用", domain: "exercise-technique", cognition: "应用", prompt: "冲刺加速阶段，身体姿态通常应如何？", options: ["明显前倾并逐步抬高", "从第一步完全直立", "躯干后仰"], answer: 0, explanation: "加速期保持适当前倾与积极蹬地，速度提高后逐步过渡到更直立姿态。", source: "第 20 章" },
  { id: "im01", section: "实践应用", domain: "implementation", cognition: "记忆", prompt: "安排同一天测试时，一般应最先进行哪类测试？", options: ["有氧耐力", "非疲劳性测量", "无氧能力"], answer: 1, explanation: "身高、体重、柔韧性等非疲劳测量通常先做，疲劳性测试后置。", source: "第 13–14 章" },
  { id: "im02", section: "实践应用", domain: "implementation", cognition: "应用", prompt: "两次 IMTP 峰值力相差超过既定容许范围，最合理的处理是？", options: ["取较高值并结束", "安排额外试次并检查标准化流程", "删除全部结果"], answer: 1, explanation: "试次差异过大提示信度不足，应检查姿势、指令与设备并增加试次。", source: "第 14 章" },
  { id: "im03", section: "实践应用", domain: "implementation", cognition: "分析", prompt: "团队垂直跳平均值下降，但当天热身流程与以往不同。应先怎样解释？", options: ["直接判定全队过度训练", "先考虑测试实施变化对效度的影响", "立即增加训练量"], answer: 1, explanation: "程序不一致是混杂因素；先恢复标准化再判断是否存在真实表现变化。", source: "第 13–14 章" },
  { id: "im04", section: "实践应用", domain: "implementation", cognition: "记忆", prompt: "测试“测量结果是否稳定一致”的概念是？", options: ["效度 Validity", "信度 Reliability", "专项性 Specificity"], answer: 1, explanation: "信度指重复测量的一致性；效度指是否准确测量目标构念。", source: "第 13 章" },
  { id: "im05", section: "实践应用", domain: "implementation", cognition: "应用", prompt: "教练发现运动员今天热身后跳跃高度下降且主观疲劳升高。最合理的当日调整是？", options: ["忽略数据，完成原计划", "结合趋势与情境，适度降低负荷或训练量", "永久取消爆发力训练"], answer: 1, explanation: "单日数据要结合基线和情境，用于小幅、可逆的训练调整。", source: "第 14、24 章" },
  { id: "im06", section: "实践应用", domain: "implementation", cognition: "分析", prompt: "为了比较不同体重运动员的深蹲表现，最有帮助的指标是？", options: ["绝对 1RM", "相对力量（1RM/体重）", "训练年龄"], answer: 1, explanation: "相对力量将负荷按体重标准化，更适合跨体型比较。", source: "第 14 章" },
  { id: "oa01", section: "实践应用", domain: "organization", cognition: "记忆", prompt: "设备出现裂纹但仍可使用时，最合适的处理是？", options: ["贴胶带后继续使用", "立即停用、标记并记录维修", "只允许高级运动员使用"], answer: 1, explanation: "存在安全隐患的设备应立即退出使用，并按维护流程记录和处理。", source: "第 25–26 章" },
  { id: "oa02", section: "实践应用", domain: "organization", cognition: "应用", prompt: "训练中运动员突然倒地且无正常呼吸。首要行动组合是？", options: ["等待队医到场", "启动应急预案、呼叫急救并尽快取 AED/CPR", "先完成事故报告"], answer: 1, explanation: "立即启动 EAP，安排呼叫 EMS、取得 AED 并按资质实施 CPR。", source: "第 26 章" },
  { id: "oa03", section: "实践应用", domain: "organization", cognition: "记忆", prompt: "“同等条件下，合理审慎专业人员会采取的行为”描述的是？", options: ["风险自担", "标准照护义务", "知情同意"], answer: 1, explanation: "Standard of care 是判断专业行为是否合理的重要基准。", source: "第 26 章" },
  { id: "oa04", section: "实践应用", domain: "organization", cognition: "分析", prompt: "力量房拥挤、通道被杠铃片占用。主管最优先应做什么？", options: ["等训练结束再处理", "立即清理通道并执行器材归位规则", "关闭照明提醒大家"], answer: 1, explanation: "堵塞通道是即时跌倒与疏散风险，应立刻纠正并落实既定政策。", source: "第 25–26 章" },
  { id: "oa05", section: "实践应用", domain: "organization", cognition: "应用", prompt: "教练怀疑运动员有骨折。哪项最符合执业边界？", options: ["现场确诊并安排康复处方", "停止训练、按应急流程处理并转介医疗人员", "让运动员自行拉伸后继续"], answer: 1, explanation: "体能教练不做医疗诊断；应保护运动员、启动流程并转介。", source: "第 23、26 章" },
  { id: "oa06", section: "实践应用", domain: "organization", cognition: "记忆", prompt: "应急行动计划 EAP 最重要的特点之一是？", options: ["只由主管记住", "书面化、定期演练且职责明确", "发生事故后再制定"], answer: 1, explanation: "有效 EAP 应书面化、可访问、定期演练，并明确通信、急救与人员角色。", source: "第 26 章" },
];
