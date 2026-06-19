# Aureon Insurance & Wealth AI

AI-powered insurance and wealth broker MVP built with Next.js, React, TypeScript, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

The MVP stores intake data, reports, and advisor leads in `localStorage`. The deterministic rule engine is in `lib/riskEngine.ts`; `lib/aiReportService.ts` is the integration point for a future server-side OpenAI API route.

## Included

- Product landing page
- Five-step family and financial intake
- Rule-generated risk and wealth report
- Advisor matching and lead capture
- Advisor dashboard with filtering and status management
