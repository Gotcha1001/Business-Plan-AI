import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import {
  calculateFinancials,
  computeViability,
  type CalculatedFinancials,
} from "../lib/financial-calculations";
import type { GeneratedPlanContent } from "../lib/plan-types";

type Plan = Doc<"businessPlans">;
type Viability = ReturnType<typeof computeViability>;

// ---------------------------------------------------------------------
// Prompt construction. All ten sections go in as-is; financials/viability
// are inserted as pre-computed, read-only numbers the model must narrate
// around rather than recalculate. The instructions below say that
// explicitly, and nothing in the JSON schema we ask for has room for a
// number to sneak back in — see GeneratedPlanContent, which is prose-only.
// ---------------------------------------------------------------------

const list = (items: string[]) =>
  items.length > 0 ? items.map((i) => `- ${i}`).join("\n") : "(none provided)";

const money = (n: number | null | undefined) =>
  n === null || n === undefined ? "n/a" : `$${n.toLocaleString()}`;

const pct = (n: number | null | undefined) =>
  n === null || n === undefined ? "n/a" : `${n.toFixed(1)}%`;

function buildPrompt(
  plan: Plan,
  calc: CalculatedFinancials,
  viability: Viability,
): string {
  const {
    identity,
    team,
    offerings,
    market,
    marketingSales,
    operations,
    funding,
    financials,
    kpis,
    appendix,
  } = plan;

  return `You are writing the narrative sections of a business plan. All financial
figures below are FINAL and pre-computed — do not recalculate, round
differently, or invent any number that isn't given to you here. Your job is
prose: explain, contextualize, and make the case, using these figures as
ground truth.

Respond with ONLY a JSON object matching this shape (all fields are
strings of flowing prose, no markdown headers inside the values):
{
  "executiveSummary": string,
  "companyOverview": string,
  "productsAndServices": string,
  "marketAnalysis": string,
  "marketingAndSalesPlan": string,
  "operationsPlan": string,
  "managementAndOrganization": string,
  "fundingRequest": string,
  "financialPlanNarrative": string,
  "appendixNotes": string
}

=== COMPANY IDENTITY ===
Business name: ${identity.businessName}${identity.tradingName ? ` (trading as ${identity.tradingName})` : ""}
Stage: ${identity.stage ?? "n/a"} | Legal structure: ${identity.legalStructure ?? "n/a"} | Industry: ${identity.industry ?? "n/a"}
Mission: ${identity.missionStatement ?? "n/a"}
Vision: ${identity.visionStatement ?? "n/a"}
Problem solved: ${identity.problemStatement ?? "n/a"}
Unique value proposition: ${identity.uniqueValueProposition ?? "n/a"}
Core values:\n${list(identity.coreValues)}
Goals — short-term:\n${list(identity.shortTermGoals)}
Goals — medium-term:\n${list(identity.mediumTermGoals)}
Goals — long-term:\n${list(identity.longTermGoals)}
Exit strategy: ${identity.exitStrategy ?? "n/a"}

=== TEAM ===
Owners: ${JSON.stringify(team.owners)}
Management team: ${JSON.stringify(team.managementTeam)}
Org structure: ${team.orgStructureDescription ?? "n/a"}
Planned hires: ${JSON.stringify(team.plannedHires)}
Advisors: ${JSON.stringify(team.advisors)}
Key partnerships: ${JSON.stringify(team.keyPartnerships)}
IP: ${JSON.stringify(team.intellectualProperty)}

=== OFFERINGS ===
Products/services: ${JSON.stringify(offerings.products)}
Production process: ${offerings.productionProcess ?? "n/a"}
Quality control: ${offerings.qualityControl ?? "n/a"}
Roadmap:\n${list(offerings.roadmap)}

=== MARKET ===
Target demographics: ${market.targetDemographics ?? "n/a"}
Target geography: ${market.targetGeography ?? "n/a"}
Customer needs: ${market.customerNeeds ?? "n/a"}
TAM/SAM/SOM: ${money(market.tam)} / ${money(market.sam)} / ${money(market.som)}
Market trends: ${market.marketTrends ?? "n/a"}
Competitors: ${JSON.stringify(market.competitors)}
SWOT — strengths:\n${list(market.swotStrengths)}
SWOT — weaknesses:\n${list(market.swotWeaknesses)}
SWOT — opportunities:\n${list(market.swotOpportunities)}
SWOT — threats:\n${list(market.swotThreats)}
Barriers to entry: ${market.barriersToEntry ?? "n/a"}

=== MARKETING & SALES ===
Channels:\n${list(marketingSales.channels)}
Sales strategy: ${marketingSales.salesStrategy ?? "n/a"}
CAC / LTV: ${money(marketingSales.cac)} / ${money(marketingSales.ltv)}
Branding: ${marketingSales.branding ?? "n/a"}
Retention plans: ${marketingSales.retentionPlans ?? "n/a"}

=== OPERATIONS ===
Locations:\n${list(operations.locations)}
Equipment: ${JSON.stringify(operations.equipment)}
Tech stack:\n${list(operations.techStack)}
Scalability plans: ${operations.scalabilityPlans ?? "n/a"}
Operational risks: ${JSON.stringify(operations.operationalRisks)}

=== FUNDING (inputs) ===
Funding sources: ${JSON.stringify(funding.fundingSources)}
Funding request amount: ${money(funding.fundingRequestAmount)}
Equity offered: ${funding.equityOffered ?? "n/a"}

=== FINANCIALS — PRE-COMPUTED, DO NOT RECALCULATE ===
Total startup cost: ${money(calc.totalStartupCost)}
Total funding secured: ${money(calc.totalFundingSecured)}
Funding gap: ${money(calc.fundingGap)}
Monthly revenue at launch: ${money(calc.monthlyRevenueAtLaunch)}
Gross margin: ${pct(calc.grossMarginPercent)}
Monthly operating expenses: ${money(calc.monthlyOperatingExpenses)}
Monthly EBITDA: ${money(calc.monthlyEbitda)}
Monthly net profit: ${money(calc.monthlyNetProfit)} (net margin ${pct(calc.netMarginPercent)})
Break-even: ${calc.breakEvenUnits ?? "n/a"} units / ${money(calc.breakEvenRevenue)}
Year 1 revenue: ${money(calc.year1Revenue)} | Year 1 net profit: ${money(calc.year1NetProfit)}
ROI (year 1): ${pct(calc.roiPercentYear1)} | Payback period: ${calc.paybackPeriodMonths ?? "n/a"} months
Scenario modeled: ${financials.scenario ?? "base"} | Horizon: ${financials.projectionHorizonMonths ?? 12} months

=== VIABILITY ANALYSIS — PRE-COMPUTED, DO NOT RECALCULATE ===
Score: ${viability.score}/100
Flags:\n${list(viability.flags)}
Suggestions:\n${list(viability.suggestions)}
(Address these honestly in financialPlanNarrative and executiveSummary rather than glossing over them.)

=== KPIs & TARGETS ===
${JSON.stringify(kpis)}

=== APPENDIX / FREE NOTES ===
${appendix.freeNotes ?? "n/a"}
Historical financials notes: ${appendix.historicalFinancialsNotes ?? "n/a"}
Milestones: ${JSON.stringify(appendix.milestones)}
`;
}

function parseGeneratedContent(raw: string): GeneratedPlanContent {
  // Models sometimes wrap JSON in ```json fences despite instructions —
  // strip those before parsing rather than failing the whole generation.
  const cleaned = raw.replace(/```json\s*|```/g, "").trim();
  const parsed = JSON.parse(cleaned) as Partial<GeneratedPlanContent>;

  const required: (keyof GeneratedPlanContent)[] = [
    "executiveSummary",
    "companyOverview",
    "productsAndServices",
    "marketAnalysis",
    "marketingAndSalesPlan",
    "operationsPlan",
    "managementAndOrganization",
    "fundingRequest",
    "financialPlanNarrative",
    "appendixNotes",
  ];
  for (const key of required) {
    if (typeof parsed[key] !== "string") {
      throw new Error(`AI response missing or invalid field: ${key}`);
    }
  }
  return parsed as GeneratedPlanContent;
}

export const generatePlan = action({
  args: {
    planId: v.id("businessPlans"),
    style: v.optional(v.string()),
    layout: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, { planId, style, layout }) => {
    const plan = await ctx.runQuery(internal.businessPlans._getPlanInternal, {
      planId,
    });
    if (!plan) {
      throw new Error("Plan not found");
    }

    try {
      // Deterministic math first — the model never sees raw inputs without
      // these already computed, and never gets asked to compute them itself.
      const calc = calculateFinancials(plan);
      const viability = computeViability(plan, calc);

      const prompt = buildPrompt(plan, calc, viability);

      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer":
              process.env.NEXT_PUBLIC_CONVEX_SITE_URL ?? "https://localhost",
            "X-Title": "Business Plan AI",
          },
          body: JSON.stringify({
            model: "anthropic/claude-sonnet-4",
            max_tokens: 4096,
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
          }),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`AI provider error (${response.status}): ${errText}`);
      }

      const data = (await response.json()) as {
        choices: { message: { content: string } }[];
      };
      const text = data.choices?.[0]?.message?.content?.trim() ?? "";

      const generatedContent = parseGeneratedContent(text);

      // This is the only call to _saveGeneratedContent — it has to come
      // after generatedContent/viability exist, which means inside the
      // try block, after parsing the AI response.
      await ctx.runMutation(internal.businessPlans._saveGeneratedContent, {
        planId,
        generatedContent,
        viabilityAnalysis: viability,
        style,
        layout,
      });
    } catch (err) {
      await ctx.runMutation(internal.businessPlans._saveGenerationError, {
        planId,
        error: err instanceof Error ? err.message : "Unknown generation error",
      });
      throw err;
    }

    return null;
  },
});
