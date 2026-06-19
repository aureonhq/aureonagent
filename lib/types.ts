export interface UserProfile {
  name: string; age: number; city: string; maritalStatus: "单身" | "已婚" | "离异";
  hasChildren: boolean; childrenCount: number; supportsParents: boolean; occupation: string; selfEmployed: boolean;
}

export interface IncomeDebtInfo {
  annualIncome: number; householdIncome: number; monthlyExpenses: number;
  mortgage: number; carLoan: number; otherDebt: number; hasEmergencyFund: boolean; reserveMonths: number;
}

export interface AssetInfo {
  cash: number; stocks: number; funds: number; bonds: number; property: number;
  retirement: number; companyEquity: number; other: number;
}

export interface InsuranceInfo {
  hasLife: boolean; lifeCoverage: number; hasCritical: boolean; criticalCoverage: number;
  hasMedical: boolean; hasAccident: boolean; hasAnnuity: boolean; hasEducation: boolean;
  annualPremium: number; policyUploaded: boolean;
}

export interface GoalPreference {
  goals: string[]; riskPreference: "保守" | "平衡" | "进取";
  investmentExperience: "无经验" | "一般" | "有经验" | "专业";
  advisorConsent: "是" | "否" | "先看报告";
}

export interface ClientIntake {
  profile: UserProfile; incomeDebt: IncomeDebtInfo; assets: AssetInfo;
  insurance: InsuranceInfo; preferences: GoalPreference;
}

export interface Finding { title: string; status: string; level: "低" | "中" | "高"; advice: string; }
export interface AllocationItem { label: string; value: number; color: string; }
export interface RiskReport {
  id: string; createdAt: string; familyRiskScore: number; insuranceGapScore: number;
  wealthAllocationScore: number; cashFlowHealthScore: number; insuranceFindings: Finding[];
  wealthFindings: Finding[]; cashFlowSummary: string[]; suggestedAllocation: AllocationItem[]; actionPlan: string[];
}

export type LeadStatus = "New Lead" | "Contacted" | "In Progress" | "Converted" | "Closed";
export interface AdvisorLead {
  id: string; name: string; contact: string; email: string; city: string; needType: string;
  note: string; status: LeadStatus; createdAt: string; client: ClientIntake; report: RiskReport;
}
