// The AI-generated narrative for a plan version. Distinct from the raw
// input in `businessPlans` — this is prose built FROM that input (plus
// the deterministically-computed financials/viability), never the other
// way around. `calculateFinancials`/`computeViability` numbers are stored
// separately on the version (see convex/businessPlans.ts's
// `_saveGeneratedContent`) — this type has no numeric fields of its own,
// specifically so nothing here can silently disagree with the real math.
export interface GeneratedPlanContent {
  executiveSummary: string;
  companyOverview: string;
  productsAndServices: string;
  marketAnalysis: string;
  marketingAndSalesPlan: string;
  operationsPlan: string;
  managementAndOrganization: string;
  fundingRequest: string;
  financialPlanNarrative: string; // prose explaining the numbers, not the numbers themselves
  appendixNotes: string;
}
