import { EnterpriseTask, MatchResult, TalentProfile, TaskApplication, PlatformOrder } from "./types";
import { supabase } from "./supabaseClient";

export type AdminEntityKind = "task" | "talent" | "match" | "application" | "order";

const adminTables: Record<AdminEntityKind, string> = {
  task: "enterprise_tasks",
  talent: "talent_profiles",
  match: "task_matches",
  application: "task_applications",
  order: "platform_orders"
};

export async function loadCloudData() {
  if (!supabase) return null;

  const [{ data: tasks, error: tasksError }, { data: talents, error: talentsError }, { data: matches, error: matchesError }, { data: applications, error: applicationsError }, { data: orders, error: ordersError }] = await Promise.all([
    supabase.from("enterprise_tasks").select("*, ai_task_breakdowns(*)").order("created_at", { ascending: false }),
    supabase.from("talent_profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("task_matches").select("*").order("score", { ascending: false }),
    supabase.from("task_applications").select("*").order("created_at", { ascending: false }),
    supabase.from("platform_orders").select("*").order("created_at", { ascending: false }),
  ]);

  if (tasksError || talentsError || matchesError || applicationsError || ordersError) {
    throw new Error(tasksError?.message || talentsError?.message || matchesError?.message || applicationsError?.message || ordersError?.message || "Unable to load cloud data");
  }

  return {
    tasks: (tasks ?? []).map(mapTask),
    talents: (talents ?? []).map(mapTalent),
    matches: (matches ?? []).map(mapMatch),
    applications: (applications ?? []).map(mapApplication),
    orders: (orders ?? []).map(mapOrder)
  };
}

export async function saveCloudTask(task: EnterpriseTask) {
  if (!supabase) return;
  const { error: taskError } = await supabase.from("enterprise_tasks").upsert({
    id: task.id,
    company_name: task.companyName,
    company_contact: task.companyContact,
    title: task.title,
    description: task.description,
    budget: task.budget,
    deadline: task.deadline,
    skills_json: task.skills,
    status: task.status,
    created_at: task.createdAt,
    updated_at: new Date().toISOString()
  });

  if (taskError) throw new Error(taskError.message);

  const { error: breakdownError } = await supabase.from("ai_task_breakdowns").upsert({
    id: `${task.id}-breakdown`,
    task_id: task.id,
    summary: task.ai.summary,
    milestones_json: task.ai.milestones,
    deliverables_json: task.ai.deliverables,
    risks_json: task.ai.risks,
    suggested_quote_min: task.ai.suggestedQuote.min,
    suggested_quote_max: task.ai.suggestedQuote.max,
    quote_basis: task.ai.suggestedQuote.basis,
    model_name: "mock-ai-v1",
    created_at: task.createdAt
  });

  if (breakdownError) throw new Error(breakdownError.message);
}

export async function saveCloudTalent(talent: TalentProfile) {
  if (!supabase) return;
  const { error } = await supabase.from("talent_profiles").upsert({
    id: talent.id,
    name: talent.name,
    skills_json: talent.skills,
    availability: talent.availability,
    contact: talent.contact,
    expected_income: talent.expectedIncome,
    experience: talent.experience,
    created_at: talent.createdAt,
    updated_at: new Date().toISOString()
  });
  if (error) throw new Error(error.message);
}

export async function saveCloudMatches(matches: MatchResult[]) {
  if (!supabase || matches.length === 0) return;
  const { error } = await supabase.from("task_matches").upsert(matches.map((match) => ({
    id: match.id,
    task_id: match.taskId,
    talent_id: match.talentId,
    score: match.score,
    reasons_json: match.reasons,
    execution_steps_json: match.executionSteps,
    status: match.status,
    created_at: match.createdAt
  })));
  if (error) throw new Error(error.message);
}

export async function updateCloudMatchStatus(matchId: string, status: MatchResult["status"]) {
  if (!supabase) return;
  const { error } = await supabase.from("task_matches").update({ status }).eq("id", matchId);
  if (error) throw new Error(error.message);
}

export async function saveCloudApplication(application: TaskApplication) {
  if (!supabase) return;
  const { error } = await supabase.from("task_applications").upsert({
    id: application.id,
    task_id: application.taskId,
    talent_id: application.talentId,
    status: application.status,
    created_at: application.createdAt
  });
  if (error) throw new Error(error.message);
}

export async function saveCloudOrder(order: PlatformOrder) {
  if (!supabase) return;
  const { error } = await supabase.from("platform_orders").upsert({
    id: order.id,
    task_id: order.taskId,
    talent_id: order.talentId,
    source: order.source,
    amount: order.amount,
    commission_rate: order.commissionRate,
    commission_amount: order.commissionAmount,
    talent_payout: order.talentPayout,
    status: order.status,
    created_at: order.createdAt
  });
  if (error) throw new Error(error.message);
}

export async function updateCloudOrderStatus(orderId: string, status: PlatformOrder["status"]) {
  if (!supabase) return;
  const { error } = await supabase.from("platform_orders").update({ status }).eq("id", orderId);
  if (error) throw new Error(error.message);
}

export async function isCurrentUserAdmin() {
  if (!supabase) return false;
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return false;
  const { data, error } = await supabase.from("admin_users").select("user_id").eq("user_id", userData.user.id).maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data);
}

export async function deleteCloudEntity(kind: AdminEntityKind, id: string) {
  if (!supabase) return;
  const { error } = await supabase.from(adminTables[kind]).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

function mapTask(row: any): EnterpriseTask {
  const breakdown = Array.isArray(row.ai_task_breakdowns) ? row.ai_task_breakdowns[0] : row.ai_task_breakdowns;
  return {
    id: row.id,
    companyName: row.company_name ?? "未命名企业",
    companyContact: row.company_contact ?? "",
    title: row.title,
    description: row.description,
    budget: row.budget,
    deadline: row.deadline,
    skills: row.skills_json ?? [],
    status: row.status,
    createdAt: row.created_at,
    ai: breakdown ? {
      summary: breakdown.summary,
      milestones: breakdown.milestones_json ?? [],
      deliverables: breakdown.deliverables_json ?? [],
      risks: breakdown.risks_json ?? [],
      suggestedQuote: {
        min: breakdown.suggested_quote_min,
        max: breakdown.suggested_quote_max,
        basis: breakdown.quote_basis
      }
    } : {
      summary: "AI 拆解记录加载中。若需要完整拆解，请重新发布任务或刷新云端视图。",
      milestones: [],
      deliverables: [],
      risks: [],
      suggestedQuote: { min: Math.round(row.budget * 0.7), max: Math.round(row.budget * 1.1), basis: "按任务预算估算" }
    }
  };
}
function mapTalent(row: any): TalentProfile {
  return {
    id: row.id,
    name: row.name,
    contact: row.contact ?? "",
    skills: row.skills_json ?? [],
    availability: row.availability,
    expectedIncome: row.expected_income,
    experience: row.experience,
    createdAt: row.created_at
  };
}

function mapMatch(row: any): MatchResult {
  return {
    id: row.id,
    taskId: row.task_id,
    talentId: row.talent_id,
    score: row.score,
    status: row.status ?? "recommended",
    reasons: row.reasons_json ?? [],
    executionSteps: row.execution_steps_json ?? [],
    createdAt: row.created_at
  };
}

function mapApplication(row: any): TaskApplication {
  return {
    id: row.id,
    taskId: row.task_id,
    talentId: row.talent_id,
    status: (row.status ?? "applied") as TaskApplication["status"],
    createdAt: row.created_at
  };
}

function mapOrder(row: any): PlatformOrder {
  return {
    id: row.id,
    taskId: row.task_id,
    talentId: row.talent_id,
    source: row.source,
    amount: row.amount,
    commissionRate: row.commission_rate,
    commissionAmount: row.commission_amount,
    talentPayout: row.talent_payout,
    status: row.status,
    createdAt: row.created_at
  };
}

