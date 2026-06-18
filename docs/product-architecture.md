# Aureon Agent Product Architecture

## Positioning

Aureon Agent is an AI-native startup operating system. It helps an individual founder or small team move from a raw idea to first revenue through AI-assisted project selection, business model design, MVP planning, website generation, acquisition planning, business-plan export, and broker marketplace matching.

It is not a forum, news site, or course platform. The product surface is a workbench.

## Core User Journey

1. User enters city, budget, skills, industry experience, team status, and available time.
2. AI recommends 3-5 startup directions with fit, market size, competition, capital needs, and risks.
3. User selects one project.
4. AI generates a Business Model Canvas.
5. AI generates a week-one, month-one, and month-three MVP plan focused on first revenue.
6. AI generates website structure, page design, feature requirements, and starter code requirements.
7. AI generates channel playbooks for Xiaohongshu, Douyin, WeChat, Bilibili, SEO, and Google.
8. AI exports business-plan content for PPT, PDF, investor version, and service-provider brief.
9. AI matches service providers in the broker marketplace and tracks commissionable orders.

## Product Modules

- Founder Intake: structured onboarding and constraints capture.
- Idea Fit Engine: ranking and explanation layer for startup directions.
- Startup Workspace: selected project, versions, assumptions, and tasks.
- Business Canvas: customer, product, pricing, channels, partners, costs, metrics.
- MVP Planner: weekly and monthly execution plan.
- Site Builder: Next.js landing page and SaaS dashboard generation.
- Acquisition Planner: channel strategy and experiment backlog.
- Deck Builder: PPT/PDF/investor version generation.
- Broker Marketplace: provider discovery, matching, escrow-ready order flow, commission tracking.
- Billing: Free, Pro subscription, and marketplace commission.

## AI Agent System

- Founder Advisor Agent: project fit, business model, sequencing.
- Market Research Agent: market size, competitors, trends, risks.
- Acquisition Agent: channel playbooks, ad copy, content calendar.
- Product Manager Agent: MVP scope, user stories, acceptance criteria.
- Finance Agent: budget, cash flow, pricing, runway.
- Fundraising Agent: deck narrative, investor version, financial story.

## Technical Architecture

- Frontend: Next.js App Router, React, TypeScript, TailwindCSS.
- Backend: Supabase APIs, PostgreSQL, Row Level Security, storage buckets.
- AI: OpenAI API and Anthropic API behind an internal agent orchestration layer.
- Auth: Clerk organizations and user sessions.
- Payments: Stripe subscriptions, invoices, marketplace commission payments.
- Deployment: Vercel preview and production environments.

## Permission Model

- User owns profiles, projects, generated plans, documents, and orders.
- Team members can be invited to a project workspace.
- Providers can access only assigned marketplace briefs and order metadata.
- Admins can manage provider approvals, commissions, and disputed orders.

## MVP Scope

- Single-page interactive workbench.
- Mocked AI plan generation based on user inputs.
- Project selection and canvas view.
- MVP route, website plan, acquisition plan, deck outline.
- Broker marketplace cards and matching CTA.
- Documentation for database and product architecture.

## Next Production Steps

- Replace mock plan generation with API routes and persisted generations.
- Add Clerk auth and Supabase RLS.
- Add Stripe Pro subscription and provider commission objects.
- Add document generation workers for PPT/PDF.
- Add prompt/version storage and evaluation tests.
