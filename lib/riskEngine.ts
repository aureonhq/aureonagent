import { AllocationItem, ClientIntake, Finding, RiskReport } from "./types";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const totalAssets = (d: ClientIntake) => Object.values(d.assets).reduce((a, b) => a + b, 0);
const totalDebt = (d: ClientIntake) => d.incomeDebt.mortgage + d.incomeDebt.carLoan + d.incomeDebt.otherDebt;

export function calculateFamilyRiskScore(d: ClientIntake) {
  let score = 86;
  if (d.profile.hasChildren) score -= 8;
  if (d.profile.supportsParents) score -= 6;
  if (d.profile.selfEmployed) score -= 7;
  if (totalDebt(d) > d.incomeDebt.householdIncome * 3) score -= 18;
  if (!d.insurance.hasLife && totalDebt(d) > 0) score -= 15;
  return clamp(score);
}

export function calculateInsuranceGapScore(d: ClientIntake) {
  let score = 100;
  if (d.profile.hasChildren && d.insurance.lifeCoverage < d.incomeDebt.householdIncome * 5) score -= 30;
  if (!d.insurance.hasMedical) score -= 22;
  if (!d.insurance.hasCritical) score -= 18;
  if (!d.insurance.hasAccident) score -= 10;
  if (d.insurance.annualPremium > d.incomeDebt.annualIncome * .15) score -= 12;
  return clamp(score);
}

export function calculateWealthAllocationScore(d: ClientIntake) {
  const total = totalAssets(d) || 1;
  let score = 92;
  if (d.assets.property / total > .8) score -= 35;
  if (d.assets.cash / total < .05) score -= 15;
  if ((d.assets.bonds + d.assets.retirement) / total < .1) score -= 12;
  if ((d.assets.stocks + d.assets.funds) / total < .1) score -= 10;
  return clamp(score);
}

export function calculateCashFlowHealthScore(d: ClientIntake) {
  let score = 100;
  if (d.incomeDebt.reserveMonths < 6) score -= (6 - d.incomeDebt.reserveMonths) * 8;
  if (d.incomeDebt.monthlyExpenses * 12 > d.incomeDebt.householdIncome * .65) score -= 20;
  if (d.insurance.annualPremium > d.incomeDebt.annualIncome * .15) score -= 15;
  if (totalDebt(d) > d.incomeDebt.householdIncome * 4) score -= 20;
  return clamp(score);
}

export function generateInsuranceRecommendations(d: ClientIntake): Finding[] {
  const target = d.incomeDebt.householdIncome * (d.profile.hasChildren ? 8 : 5);
  return [
    { title: "寿险保障", status: d.insurance.hasLife ? `保额 ¥${d.insurance.lifeCoverage.toLocaleString()}` : "尚未配置", level: d.insurance.lifeCoverage >= target ? "低" : "高", advice: `建议家庭主要收入者总保额达到约 ¥${target.toLocaleString()}，并结合负债期限复核。` },
    { title: "重疾保障", status: d.insurance.hasCritical ? `保额 ¥${d.insurance.criticalCoverage.toLocaleString()}` : "尚未配置", level: d.insurance.hasCritical ? "中" : "高", advice: "优先覆盖收入中断和康复期支出，避免与现有医疗保障重复。" },
    { title: "医疗与意外", status: d.insurance.hasMedical && d.insurance.hasAccident ? "基础保障齐全" : "存在缺口", level: d.insurance.hasMedical && d.insurance.hasAccident ? "低" : "高", advice: "补齐基础医疗和意外保障，再评估储蓄型产品。" },
    { title: "保费压力", status: `年保费占个人收入 ${Math.round(d.insurance.annualPremium / Math.max(d.incomeDebt.annualIncome, 1) * 100)}%`, level: d.insurance.annualPremium > d.incomeDebt.annualIncome * .15 ? "高" : "低", advice: "建议年保费控制在可持续现金流范围内，重点保障家庭责任。" }
  ];
}

export function generateWealthRecommendations(d: ClientIntake): Finding[] {
  const total = totalAssets(d) || 1, pct = (v: number) => `${Math.round(v / total * 100)}%`;
  return [
    { title: "流动性资产", status: `现金占比 ${pct(d.assets.cash)}`, level: d.incomeDebt.reserveMonths < 6 ? "高" : "低", advice: "先建立 6-12 个月家庭支出的高流动性储备。" },
    { title: "房产集中度", status: `房产占比 ${pct(d.assets.property)}`, level: d.assets.property / total > .8 ? "高" : "低", advice: "逐步增加流动性与多元资产，降低单一市场和变现风险。" },
    { title: "增长与稳健资产", status: `权益 ${pct(d.assets.stocks + d.assets.funds)} · 固收 ${pct(d.assets.bonds)}`, level: "中", advice: "结合目标期限、风险承受能力和退休账户制定再平衡计划。" }
  ];
}

export function generateActionPlan(d: ClientIntake) {
  const actions: string[] = [];
  if (d.incomeDebt.reserveMonths < 6) actions.push("建立至少 6 个月家庭固定支出的紧急备用金");
  if (d.profile.hasChildren && d.insurance.lifeCoverage < d.incomeDebt.householdIncome * 5) actions.push("将寿险保障补充至家庭年收入的 5-10 倍");
  if (!d.insurance.hasMedical || !d.insurance.hasCritical) actions.push("复核并补齐医疗险与重疾险基础保障");
  if (d.assets.property / Math.max(totalAssets(d), 1) > .8) actions.push("降低房产集中度，逐步增加流动性和全球分散资产");
  actions.push("每 12 个月或家庭发生重大变化时重新进行风险评估");
  if (d.preferences.advisorConsent !== "否") actions.push("与持牌顾问核验保障方案和长期资产配置计划");
  return actions.slice(0, 7);
}

const allocations: Record<string, AllocationItem[]> = {
  保守: [["现金",20,"#c8a65a"],["债券/固收",40,"#153d4a"],["ETF/股票",25,"#367b89"],["保险/年金",10,"#8aa8a3"],["其他",5,"#d7ddd9"]].map(([label,value,color]) => ({label:String(label),value:Number(value),color:String(color)})),
  平衡: [["现金",15,"#c8a65a"],["债券/固收",25,"#153d4a"],["ETF/股票",45,"#367b89"],["保险/年金",10,"#8aa8a3"],["其他",5,"#d7ddd9"]].map(([label,value,color]) => ({label:String(label),value:Number(value),color:String(color)})),
  进取: [["现金",10,"#c8a65a"],["债券/固收",15,"#153d4a"],["ETF/股票",60,"#367b89"],["保险/年金",10,"#8aa8a3"],["其他",5,"#d7ddd9"]].map(([label,value,color]) => ({label:String(label),value:Number(value),color:String(color)}))
};

export function generateFullReport(d: ClientIntake): RiskReport {
  return { id: crypto.randomUUID(), createdAt: new Date().toISOString(), familyRiskScore: calculateFamilyRiskScore(d), insuranceGapScore: calculateInsuranceGapScore(d), wealthAllocationScore: calculateWealthAllocationScore(d), cashFlowHealthScore: calculateCashFlowHealthScore(d), insuranceFindings: generateInsuranceRecommendations(d), wealthFindings: generateWealthRecommendations(d), cashFlowSummary: [`每月固定支出 ¥${d.incomeDebt.monthlyExpenses.toLocaleString()}`, `总负债 ¥${totalDebt(d).toLocaleString()}`, `紧急储备可覆盖 ${d.incomeDebt.reserveMonths} 个月`, `收入中断后预计可维持约 ${d.incomeDebt.reserveMonths} 个月`], suggestedAllocation: allocations[d.preferences.riskPreference], actionPlan: generateActionPlan(d) };
}
