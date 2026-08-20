export type PlanLayoutId =
  | "executive-first"
  | "investor-deck"
  | "cover-banner"
  | "minimal-clean"
  | "financial-charts";

export interface PlanLayoutMeta {
  id: PlanLayoutId;
  name: string;
  description: string;
}

export const PLAN_LAYOUTS: PlanLayoutMeta[] = [
  {
    id: "executive-first",
    name: "Executive Summary First",
    description:
      "Leads with the executive summary and viability score, then flows into the remaining sections. Friendly and modern -- good default for most audiences.",
  },
  {
    id: "investor-deck",
    name: "Investor Deck",
    description: "Investor-deck style layout.",
  },
  {
    id: "cover-banner",
    name: "Cover Banner",
    description: "Cover-banner style layout.",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Minimal, clean layout.",
  },
  {
    id: "financial-charts",
    name: "Financial Charts",
    description: "Financial-charts-forward layout.",
  },
];

export function getPlanLayoutMeta(id?: string | null): PlanLayoutMeta {
  return PLAN_LAYOUTS.find((l) => l.id === id) ?? PLAN_LAYOUTS[0];
}
