export type BudgetRange = "0-3000" | "3000-10000" | "10000-30000" | "30000+";

export type TaskStatus = "draft" | "published" | "matching" | "in_progress" | "delivered";

export interface TaskBreakdown {
  summary: string;
  milestones: string[];
  deliverables: string[];
  risks: string[];
  suggestedQuote: {
    min: number;
    max: number;
    basis: string;
  };
}

export interface EnterpriseTask {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills: string[];
  status: TaskStatus;
  createdAt: string;
  ai: TaskBreakdown;
}

export interface TalentProfile {
  id: string;
  name: string;
  skills: string[];
  availability: string;
  expectedIncome: number;
  experience: string;
  createdAt: string;
}

export interface MatchResult {
  id: string;
  taskId: string;
  talentId: string;
  score: number;
  reasons: string[];
  executionSteps: string[];
  createdAt: string;
}

export interface AppData {
  tasks: EnterpriseTask[];
  talents: TalentProfile[];
  matches: MatchResult[];
}
