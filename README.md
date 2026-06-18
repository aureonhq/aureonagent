# Aureon Agent

Aureon Agent is an AI-native startup operating system MVP for moving from founder profile to startup direction, business model, MVP route, website plan, acquisition plan, business-plan outline, and broker marketplace matching.

## Run Locally

```bash
pnpm install
pnpm dev
```

The current MVP uses local mock generation in `lib/founder-engine.ts`. Production integration should move generation into API routes backed by Supabase, OpenAI/Anthropic, Clerk, and Stripe.

## Included

- Interactive Next.js MVP workbench
- Dark mode
- Business Model Canvas
- MVP and first-revenue plan
- Website plan and acquisition plan
- Broker marketplace prototype
- Product architecture document
- Supabase/PostgreSQL schema draft
