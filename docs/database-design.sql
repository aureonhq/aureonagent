-- AI Workforce MVP database design for Supabase/PostgreSQL.
-- Run this file in the Supabase SQL editor.

create table if not exists public.enterprise_tasks (
  id text primary key,
  company_name text not null default '',
  company_contact text not null default '',
  title text not null,
  description text not null,
  budget integer not null,
  deadline text not null,
  skills_json jsonb not null default '[]'::jsonb,
  status text not null default 'published',
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.ai_task_breakdowns (
  id text primary key,
  task_id text not null references public.enterprise_tasks(id) on delete cascade,
  summary text not null,
  milestones_json jsonb not null default '[]'::jsonb,
  deliverables_json jsonb not null default '[]'::jsonb,
  risks_json jsonb not null default '[]'::jsonb,
  suggested_quote_min integer not null,
  suggested_quote_max integer not null,
  quote_basis text not null,
  model_name text not null default 'mock-ai-v1',
  created_at timestamptz not null
);

create table if not exists public.talent_profiles (
  id text primary key,
  name text not null,
  contact text not null default '',
  skills_json jsonb not null default '[]'::jsonb,
  availability text not null,
  expected_income integer not null,
  experience text not null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.task_matches (
  id text primary key,
  task_id text not null references public.enterprise_tasks(id) on delete cascade,
  talent_id text not null references public.talent_profiles(id) on delete cascade,
  score real not null,
  reasons_json jsonb not null default '[]'::jsonb,
  execution_steps_json jsonb not null default '[]'::jsonb,
  status text not null default 'recommended',
  created_at timestamptz not null
);

create table if not exists public.task_applications (
  id text primary key,
  task_id text not null references public.enterprise_tasks(id) on delete cascade,
  talent_id text not null references public.talent_profiles(id) on delete cascade,
  status text not null default 'applied',
  created_at timestamptz not null
);

create table if not exists public.platform_orders (
  id text primary key,
  task_id text not null references public.enterprise_tasks(id) on delete cascade,
  talent_id text not null references public.talent_profiles(id) on delete cascade,
  source text not null,
  amount integer not null,
  commission_rate numeric(5, 2) not null default 10.00,
  commission_amount integer not null,
  talent_payout integer not null,
  status text not null default 'pending_payment',
  created_at timestamptz not null
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_events (
  id text primary key,
  actor_type text not null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null
);

create index if not exists idx_enterprise_tasks_status on public.enterprise_tasks(status);
create index if not exists idx_enterprise_tasks_deadline on public.enterprise_tasks(deadline);
create index if not exists idx_task_matches_task_id on public.task_matches(task_id);
create index if not exists idx_task_matches_talent_id on public.task_matches(talent_id);
create index if not exists idx_task_matches_score on public.task_matches(score);
create index if not exists idx_task_applications_task_id on public.task_applications(task_id);
create index if not exists idx_task_applications_talent_id on public.task_applications(talent_id);
create index if not exists idx_platform_orders_task_id on public.platform_orders(task_id);
create index if not exists idx_platform_orders_talent_id on public.platform_orders(talent_id);
create index if not exists idx_platform_orders_status on public.platform_orders(status);

alter table public.enterprise_tasks add column if not exists company_name text not null default '';
alter table public.enterprise_tasks add column if not exists company_contact text not null default '';
alter table public.talent_profiles add column if not exists contact text not null default '';
alter table public.task_matches add column if not exists status text not null default 'recommended';

alter table public.enterprise_tasks enable row level security;
alter table public.ai_task_breakdowns enable row level security;
alter table public.talent_profiles enable row level security;
alter table public.task_matches enable row level security;
alter table public.task_applications enable row level security;
alter table public.platform_orders enable row level security;
alter table public.admin_users enable row level security;
alter table public.admin_events enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

drop policy if exists "authenticated users can read tasks" on public.enterprise_tasks;
drop policy if exists "authenticated users can write tasks" on public.enterprise_tasks;
drop policy if exists "authenticated users can update tasks" on public.enterprise_tasks;
drop policy if exists "authenticated users can read breakdowns" on public.ai_task_breakdowns;
drop policy if exists "authenticated users can write breakdowns" on public.ai_task_breakdowns;
drop policy if exists "authenticated users can update breakdowns" on public.ai_task_breakdowns;
drop policy if exists "authenticated users can read talents" on public.talent_profiles;
drop policy if exists "authenticated users can write talents" on public.talent_profiles;
drop policy if exists "authenticated users can update talents" on public.talent_profiles;
drop policy if exists "authenticated users can read matches" on public.task_matches;
drop policy if exists "authenticated users can write matches" on public.task_matches;
drop policy if exists "authenticated users can update matches" on public.task_matches;
drop policy if exists "authenticated users can read applications" on public.task_applications;
drop policy if exists "authenticated users can write applications" on public.task_applications;
drop policy if exists "authenticated users can update applications" on public.task_applications;
drop policy if exists "authenticated users can read orders" on public.platform_orders;
drop policy if exists "authenticated users can write orders" on public.platform_orders;
drop policy if exists "authenticated users can update orders" on public.platform_orders;
drop policy if exists "admins can delete tasks" on public.enterprise_tasks;
drop policy if exists "admins can delete breakdowns" on public.ai_task_breakdowns;
drop policy if exists "admins can delete talents" on public.talent_profiles;
drop policy if exists "admins can delete matches" on public.task_matches;
drop policy if exists "admins can delete applications" on public.task_applications;
drop policy if exists "admins can delete orders" on public.platform_orders;
drop policy if exists "admins can read admin users" on public.admin_users;
drop policy if exists "users can read own admin row" on public.admin_users;
drop policy if exists "authenticated users can read events" on public.admin_events;
drop policy if exists "authenticated users can write events" on public.admin_events;

create policy "authenticated users can read tasks" on public.enterprise_tasks for select to authenticated using (true);
create policy "authenticated users can write tasks" on public.enterprise_tasks for insert to authenticated with check (true);
create policy "authenticated users can update tasks" on public.enterprise_tasks for update to authenticated using (true) with check (true);

create policy "authenticated users can read breakdowns" on public.ai_task_breakdowns for select to authenticated using (true);
create policy "authenticated users can write breakdowns" on public.ai_task_breakdowns for insert to authenticated with check (true);
create policy "authenticated users can update breakdowns" on public.ai_task_breakdowns for update to authenticated using (true) with check (true);

create policy "authenticated users can read talents" on public.talent_profiles for select to authenticated using (true);
create policy "authenticated users can write talents" on public.talent_profiles for insert to authenticated with check (true);
create policy "authenticated users can update talents" on public.talent_profiles for update to authenticated using (true) with check (true);

create policy "authenticated users can read matches" on public.task_matches for select to authenticated using (true);
create policy "authenticated users can write matches" on public.task_matches for insert to authenticated with check (true);
create policy "authenticated users can update matches" on public.task_matches for update to authenticated using (true) with check (true);

create policy "authenticated users can read applications" on public.task_applications for select to authenticated using (true);
create policy "authenticated users can write applications" on public.task_applications for insert to authenticated with check (true);
create policy "authenticated users can update applications" on public.task_applications for update to authenticated using (true) with check (true);

create policy "authenticated users can read orders" on public.platform_orders for select to authenticated using (true);
create policy "authenticated users can write orders" on public.platform_orders for insert to authenticated with check (true);
create policy "authenticated users can update orders" on public.platform_orders for update to authenticated using (true) with check (true);

create policy "admins can delete tasks" on public.enterprise_tasks for delete to authenticated using (public.is_admin());
create policy "admins can delete breakdowns" on public.ai_task_breakdowns for delete to authenticated using (public.is_admin());
create policy "admins can delete talents" on public.talent_profiles for delete to authenticated using (public.is_admin());
create policy "admins can delete matches" on public.task_matches for delete to authenticated using (public.is_admin());
create policy "admins can delete applications" on public.task_applications for delete to authenticated using (public.is_admin());
create policy "admins can delete orders" on public.platform_orders for delete to authenticated using (public.is_admin());

create policy "users can read own admin row" on public.admin_users for select to authenticated using (user_id = auth.uid());

create policy "authenticated users can read events" on public.admin_events for select to authenticated using (true);
create policy "authenticated users can write events" on public.admin_events for insert to authenticated with check (true);
