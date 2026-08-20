// lib/plan-data.ts
//
// NEW FILE -- mirrors the role lib/cv-data.ts's prepareCvData() played in
// the CV app: every layout component (executive-first.tsx, ...) gets its
// data prepped exactly once here, so no layout re-derives `calc`,
// `viability`, or `theme` itself and none of them can drift from each
// other.
//
// Deliberately recomputes financials from `plan` on every render rather
// than trusting a stored snapshot: `businessPlanVersions.generatedContent`
// only ever receives the AI narrative + viabilityAnalysis (see
// convex/ai.ts's call to _saveGeneratedContent) -- no CalculatedFinancials
// snapshot is actually persisted per version, despite the schema comment
// implying one is. calculateFinancials() is a pure function of `plan`, so
// recomputing here is cheap, always-in-sync with the latest raw inputs,
// and avoids relying on a field that isn't actually being written yet.

import type { Doc } from "@/convex/_generated/dataModel";
import {
  calculateFinancials,
  type CalculatedFinancials,
} from "./financial-calculations";
import {
  PLAN_STYLES,
  DEFAULT_PLAN_STYLE_ID,
  type PlanStyleTheme,
} from "./styles";
import type { GeneratedPlanContent } from "./plan-types";

type Plan = Doc<"businessPlans">;
type PlanVersion = Doc<"businessPlanVersions">;

function getPlanTheme(styleId: string | undefined | null): PlanStyleTheme {
  return (
    PLAN_STYLES.find((s) => s.id === styleId) ??
    PLAN_STYLES.find((s) => s.id === DEFAULT_PLAN_STYLE_ID) ??
    PLAN_STYLES[0]
  );
}

/**
 * Narrows the untyped `version.generatedContent` down to GeneratedPlanContent.
 * Falls back to empty strings for any missing section so layouts never have
 * to null-check every field -- a plan stuck in "generating"/"failed" status
 * can still render a shell.
 */
function normalizeNarrative(raw: unknown): GeneratedPlanContent {
  const g = (raw ?? {}) as Partial<GeneratedPlanContent>;
  return {
    executiveSummary: g.executiveSummary ?? "",
    companyOverview: g.companyOverview ?? "",
    productsAndServices: g.productsAndServices ?? "",
    marketAnalysis: g.marketAnalysis ?? "",
    marketingAndSalesPlan: g.marketingAndSalesPlan ?? "",
    operationsPlan: g.operationsPlan ?? "",
    managementAndOrganization: g.managementAndOrganization ?? "",
    fundingRequest: g.fundingRequest ?? "",
    financialPlanNarrative: g.financialPlanNarrative ?? "",
    appendixNotes: g.appendixNotes ?? "",
  };
}

export interface PreparedPlanData {
  g: GeneratedPlanContent;
  calc: CalculatedFinancials;
  viability: PlanVersion["viabilityAnalysis"];
  theme: PlanStyleTheme;
  businessName: string;
  tagline: string | undefined;
  stage: string | undefined;
  industry: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  website: string | undefined;
  address: string | undefined;
  logoUrl: string | undefined;
  fundingRequestAmount: number | undefined;
  equityOffered: string | undefined;
  socialLinks: { label: string; url: string }[];
}

export function preparePlanData(
  plan: Plan,
  version: PlanVersion,
): PreparedPlanData {
  const calc = calculateFinancials(plan);
  const identity = plan.identity;

  return {
    g: normalizeNarrative(version.generatedContent),
    calc,
    viability: version.viabilityAnalysis,
    theme: getPlanTheme(version.style),
    businessName: identity.tradingName || identity.businessName,
    tagline: identity.uniqueValueProposition || identity.problemStatement,
    stage: identity.stage,
    industry: identity.industry,
    email: identity.email,
    phone: identity.phone,
    website: identity.website,
    address: identity.physicalAddress,
    logoUrl: identity.logoUrl,
    fundingRequestAmount: plan.funding.fundingRequestAmount,
    equityOffered: plan.funding.equityOffered,
    socialLinks: identity.socialLinks ?? [],
  };
}

/** Shared currency/percent formatters so every layout renders numbers identically. */
export function money(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "n/a";
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function pct(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "n/a";
  return `${n.toFixed(1)}%`;
}
