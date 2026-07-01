# AI Workforce Product Architecture

AI Workforce is an AI labor network, not a recruiting board or a freelance marketplace. Companies submit outcome-based work goals. The platform turns those goals into executable work units, estimates price, recommends qualified human contributors, and provides a delivery plan.

## Core flow

1. Enterprise creates a task with title, description, budget, deadline, and required skills.
2. Mock AI generates task summary, milestones, deliverables, risks, and suggested quote.
3. Individual contributors create skill, availability, income expectation, and experience profiles.
4. Matching engine ranks contributors by skill overlap, budget fit, and available work time.
5. Admin dashboard shows tasks, workforce profiles, and match records.

## Current MVP boundary

- Web-only Next.js app.
- Demo persistence uses browser `localStorage`.
- AI behavior is deterministic mock logic in `lib/mockAi.ts`.
- Database migration target is documented in `docs/database-design.sql`.
