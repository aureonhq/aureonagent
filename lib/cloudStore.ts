import { EnterpriseTask, MatchResult, TalentProfile } from "./types";
import { supabase } from "./supabaseClient";

export async function loadCloudData() {
  if (!supabase) return null;

  const [{ data: tasks, error: tasksError }, { data: talents, error: talentsError }, { data: matches, error: matchesError }] = await Promise.all([
    supabase.from("enterprise_tasks").select("*, ai_task_breakdowns(*)").order("created_at", { ascending: false }),
    supabase.from("talent_profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("task_matches").select("*").order("score", { ascending: false }),
  ]);

  if (tasksError || talentsError || matchesError) {
    throw new Error(tasksError?.message || talentsError?.message || matchesError?.message || "Unable to load cloud data");
  }

  return {
    tasks: (tasks ?? []).map(mapTask),
    talents: (talents ?? []).map(mapTalent),
    matches: (matches ?? []).map(mapMatch)
  };
}

export async function saveCloudTask(task: EnterpriseTask) {
  if (!supabase) return;
  const { error: taskError } = await supabase.from("enterprise_tasks").upsert({
    id: task.id,
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

function mapTask(row: any): EnterpriseTask {
  const breakdown = Array.isArray(row.ai_task_breakdowns) ? row.ai_task_breakdowns[0] : row.ai_task_breakdowns;
  return {
    id: row.id,
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
