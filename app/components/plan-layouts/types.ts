// components/plan-layouts/types.ts
//
// TRANSFORMED FROM: components/cv-layouts/types.ts
//
// Every web layout component (executive-first.tsx, investor-deck.tsx, ...)
// takes exactly this prop shape. plan-preview.tsx does the data prep once
// (via lib/plan-data.ts) and hands it down -- no layout re-derives `calc`
// / `viability` / theme itself, so they can't drift.
//
// `plan` is the raw captured business plan (identity, funding, financials
// inputs, etc). `version` is the specific generation being shown
// (generatedContent narrative, style, layout, viabilityAnalysis) -- a plan
// can have many versions.

import type { Doc } from "@/convex/_generated/dataModel";

export interface PlanLayoutProps {
  plan: Doc<"businessPlans">;
  version: Doc<"businessPlanVersions">;
  pdfUrl: string;
}
