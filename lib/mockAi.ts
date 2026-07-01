import { EnterpriseTask, MatchResult, TalentProfile, TaskBreakdown } from "./types";

const skillHints: Record<string, string[]> = {
  "产品": ["需求澄清", "用户流程", "验收标准"],
  "设计": ["信息架构", "视觉规范", "交互稿"],
  "前端": ["页面开发", "组件实现", "响应式适配"],
  "后端": ["数据模型", "接口设计", "权限与日志"],
  "运营": ["渠道策略", "内容排期", "数据复盘"],
  "数据分析": ["指标定义", "数据清洗", "洞察报告"],
  "文案": ["卖点提炼", "内容结构", "转化优化"],
  "AI": ["提示词方案", "自动化流程", "效果评估"]
};

export function normalizeSkills(input: string): string[] {
  return input
    .split(/[,，、\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function generateTaskBreakdown(title: string, description: string, budget: number, skills: string[]): TaskBreakdown {
  const matchedHints = skills.flatMap((skill) => skillHints[skill] ?? [`${skill}执行`]);
  const uniqueHints = Array.from(new Set(matchedHints)).slice(0, 6);
  const complexity = description.length > 120 || skills.length >= 4 ? 1.18 : 1;
  const min = Math.max(800, Math.round((budget * 0.72 * complexity) / 100) * 100);
  const max = Math.max(min + 500, Math.round((budget * 1.08 * complexity) / 100) * 100);

  return {
    summary: `AI 判断这是一个以“${title || "未命名任务"}”为目标的结果型任务，适合拆成需求确认、执行交付和验收优化三个阶段。`,
    milestones: [
      "确认业务目标、目标用户、参考案例和验收口径",
      ...uniqueHints.slice(0, 3).map((hint) => `完成${hint}`),
      "整理最终交付物并根据反馈完成一轮修订"
    ],
    deliverables: [
      "任务执行计划与时间表",
      "核心交付文件或可演示版本",
      "验收清单、修改记录和后续建议"
    ],
    risks: [
      "需求边界不清可能导致返工",
      "预算和截止时间需要与交付范围保持一致",
      "关键资料延迟会影响最终交付质量"
    ],
    suggestedQuote: {
      min,
      max,
      basis: "基于预算、技能数量、描述复杂度和一轮修改成本估算"
    }
  };
}

export function createMatches(task: EnterpriseTask, talents: TalentProfile[]): MatchResult[] {
  return talents
    .map((talent) => {
      const shared = talent.skills.filter((skill) => task.skills.includes(skill));
      const skillScore = shared.length / Math.max(task.skills.length, 1);
      const incomeFit = talent.expectedIncome <= task.budget ? 1 : Math.max(0.35, task.budget / talent.expectedIncome);
      const timeFit = talent.availability.includes("全职") || talent.availability.includes("20") ? 1 : 0.78;
      const score = Math.round((skillScore * 65 + incomeFit * 22 + timeFit * 13) * 100) / 100;

      return {
        id: `${task.id}-${talent.id}`,
        taskId: task.id,
        talentId: talent.id,
        score,
        reasons: [
          shared.length ? `技能重合：${shared.join("、")}` : "技能重合较少，需要人工复核",
          talent.expectedIncome <= task.budget ? "期望收入在预算范围内" : "期望收入高于预算，需调整范围或报价",
          `可工作时间：${talent.availability}`,
          talent.experience ? `经验摘要：${talent.experience.slice(0, 42)}${talent.experience.length > 42 ? "..." : ""}` : "暂未填写过往经验"
        ],
        executionSteps: [
          "平台向候选人发送任务摘要和验收标准",
          "候选人确认可交付范围、排期和报价",
          "企业选择执行人并锁定里程碑",
          "按阶段提交成果，AI 辅助检查遗漏项"
        ],
        createdAt: new Date().toISOString()
      };
    })
    .filter((match) => match.score >= 35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
