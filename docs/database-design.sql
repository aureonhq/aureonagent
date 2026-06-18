-- Aureon Agent Supabase/PostgreSQL schema draft

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  display_name text,
  city text,
  created_at timestamptz not null default now()
);

create table public.founder_intakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  city text not null,
  budget_cny integer not null,
  skill text not null,
  industry_experience text not null,
  team_status text not null,
  available_time text not null,
  created_at timestamptz not null default now()
);

create table public.startup_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  intake_id uuid references public.founder_intakes(id) on delete set null,
  title text not null,
  status text not null default 'draft',
  selected_idea jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.startup_projects(id) on delete cascade,
  agent_type text not null,
  model_provider text not null,
  model_name text not null,
  prompt_version text not null,
  input jsonb not null,
  output jsonb not null,
  created_at timestamptz not null default now()
);

create table public.business_canvases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid unique not null references public.startup_projects(id) on delete cascade,
  customers text not null,
  product text not null,
  pricing text not null,
  channels text not null,
  expansion text not null,
  partners text not null,
  costs text not null,
  metrics text not null,
  updated_at timestamptz not null default now()
);

create table public.mvp_plans (
  id uuid primary key default gen_random_uuid(),
  project_id uuid unique not null references public.startup_projects(id) on delete cascade,
  week_one jsonb not null default '[]'::jsonb,
  month_one jsonb not null default '[]'::jsonb,
  month_three jsonb not null default '[]'::jsonb,
  revenue_goal text not null,
  updated_at timestamptz not null default now()
);

create table public.website_specs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid unique not null references public.startup_projects(id) on delete cascade,
  structure jsonb not null default '[]'::jsonb,
  pages jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  generated_code_url text,
  updated_at timestamptz not null default now()
);

create table public.acquisition_plans (
  id uuid primary key default gen_random_uuid(),
  project_id uuid unique not null references public.startup_projects(id) on delete cascade,
  channels jsonb not null default '{}'::jsonb,
  experiment_backlog jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.business_plan_exports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.startup_projects(id) on delete cascade,
  export_type text not null,
  file_url text,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.service_providers (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  category text not null,
  city text,
  description text not null,
  price_min_cny integer,
  price_max_cny integer,
  commission_rate numeric(5, 2) not null default 10.00,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.marketplace_matches (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.startup_projects(id) on delete cascade,
  provider_id uuid not null references public.service_providers(id) on delete cascade,
  match_score numeric(5, 2) not null,
  reason text not null,
  status text not null default 'recommended',
  created_at timestamptz not null default now()
);

create table public.marketplace_orders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.startup_projects(id) on delete cascade,
  provider_id uuid not null references public.service_providers(id) on delete restrict,
  stripe_payment_intent_id text,
  amount_cny integer not null,
  commission_cny integer not null,
  status text not null default 'created',
  created_at timestamptz not null default now()
);

create index idx_projects_user_id on public.startup_projects(user_id);
create index idx_generations_project_id on public.ai_generations(project_id);
create index idx_matches_project_id on public.marketplace_matches(project_id);
create index idx_orders_project_id on public.marketplace_orders(project_id);
