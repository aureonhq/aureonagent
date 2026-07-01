-- AI Workforce MVP database design
-- SQLite-first schema. The same entities can be mapped to Supabase/PostgreSQL later.

create table enterprise_tasks (
  id text primary key,
  title text not null,
  description text not null,
  budget integer not null,
  deadline text not null,
  skills_json text not null default '[]',
  status text not null default 'published',
  created_at text not null,
  updated_at text not null
);

create table ai_task_breakdowns (
  id text primary key,
  task_id text not null references enterprise_tasks(id) on delete cascade,
  summary text not null,
  milestones_json text not null default '[]',
  deliverables_json text not null default '[]',
  risks_json text not null default '[]',
  suggested_quote_min integer not null,
  suggested_quote_max integer not null,
  quote_basis text not null,
  model_name text not null default 'mock-ai-v1',
  created_at text not null
);

create table talent_profiles (
  id text primary key,
  name text not null,
  skills_json text not null default '[]',
  availability text not null,
  expected_income integer not null,
  experience text not null,
  created_at text not null,
  updated_at text not null
);

create table task_matches (
  id text primary key,
  task_id text not null references enterprise_tasks(id) on delete cascade,
  talent_id text not null references talent_profiles(id) on delete cascade,
  score real not null,
  reasons_json text not null default '[]',
  execution_steps_json text not null default '[]',
  status text not null default 'recommended',
  created_at text not null
);

create table admin_events (
  id text primary key,
  actor_type text not null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata_json text not null default '{}',
  created_at text not null
);

create index idx_enterprise_tasks_status on enterprise_tasks(status);
create index idx_enterprise_tasks_deadline on enterprise_tasks(deadline);
create index idx_task_matches_task_id on task_matches(task_id);
create index idx_task_matches_talent_id on task_matches(talent_id);
create index idx_task_matches_score on task_matches(score);
