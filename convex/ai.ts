// "use node";

// import { v } from "convex/values";
// import { action } from "./_generated/server";
// import { internal } from "./_generated/api";
// import { computeMatch, flattenCandidateText } from "../lib/keyword-match";

// const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// // Tried in order. The first is your original pick — fast and free, but its
// // NIM backing function has been going DEGRADED intermittently on OpenRouter
// // (an NVIDIA-side infra issue, not us). Each entry after it is a fallback
// // used only if the previous one is actually down, not a general A/B.
// const MODEL_CHAIN = [
//   "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
//   "meta-llama/llama-3.3-70b-instruct:free",
//   "qwen/qwen-2.5-72b-instruct",
// ];

// async function callOpenRouter(apiKey: string, prompt: string) {
//   let lastErr: Error | null = null;

//   for (const model of MODEL_CHAIN) {
//     // Up to 2 tries per model: the first failure might be a one-off network
//     // blip worth retrying on the SAME model; a provider-down error is not,
//     // so that case breaks out to the next model immediately (see below).
//     for (let attempt = 0; attempt < 2; attempt++) {
//       const response = await fetch(OPENROUTER_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${apiKey}`,
//         },
//         body: JSON.stringify({
//           model,
//           messages: [{ role: "user", content: prompt }],
//           stream: false,
//           // Reasoning models (nemotron) burn tokens on hidden reasoning
//           // before they write the final answer — without this, the default
//           // budget can be exhausted by reasoning alone, leaving `content`
//           // empty. 4096 leaves headroom for reasoning + a full CV-shaped
//           // JSON payload.
//           max_tokens: 4096,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const choice = data.choices?.[0];
//         const raw = choice?.message?.content ?? "";
//         const cleaned = raw.replace(/```json|```/g, "").trim();

//         // A 200 doesn't guarantee usable content — the model can return
//         // empty content (reasoning ate the token budget) or a
//         // finish_reason of "length" (cut off mid-JSON). Treat both as a
//         // retryable failure instead of letting JSON.parse throw straight
//         // out of this function, which used to skip the rest of the chain.
//         if (!cleaned) {
//           lastErr = new Error(
//             `OpenRouter returned empty content (${model}, finish_reason=${choice?.finish_reason ?? "unknown"})`,
//           );
//         } else {
//           try {
//             return JSON.parse(cleaned);
//           } catch (e) {
//             lastErr = new Error(
//               `OpenRouter returned unparsable JSON (${model}, finish_reason=${choice?.finish_reason ?? "unknown"}): ${cleaned.slice(0, 200)}`,
//             );
//           }
//         }

//         // Empty/truncated/unparsable content on THIS model — same "move
//         // on immediately" logic as a provider-down HTTP error below.
//         if (choice?.finish_reason === "length" || !cleaned) break;
//         if (attempt === 0) {
//           await new Promise((r) => setTimeout(r, 500));
//           continue;
//         }
//         break;
//       }

//       const text = await response.text();
//       lastErr = new Error(
//         `OpenRouter error ${response.status} (${model}): ${text}`,
//       );

//       // "DEGRADED function cannot be invoked" (NVIDIA NIM backend down),
//       // 503 (no capacity), and 429 (rate-limited) won't resolve by hitting
//       // the same model again — move straight to the next one in the chain.
//       const isProviderDown =
//         text.includes("DEGRADED") ||
//         response.status === 503 ||
//         response.status === 429;
//       if (isProviderDown) break;

//       // Otherwise, likely transient — brief backoff, retry same model once.
//       if (attempt === 0) {
//         await new Promise((r) => setTimeout(r, 500));
//         continue;
//       }
//     }
//   }

//   throw lastErr ?? new Error("All OpenRouter models failed");
// }

// export const generateCv = action({
//   args: {
//     cvId: v.id("cvs"),
//     style: v.optional(v.string()),
//     layout: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     const cv = await ctx.runQuery(internal.cvs._getCvInternal, {
//       cvId: args.cvId,
//     });
//     if (!cv) throw new Error("CV not found");

//     await ctx.runMutation(internal.cvs._setGenerating, { cvId: args.cvId });

//     const apiKey = process.env.OPENROUTER_API_KEY;
//     if (!apiKey) throw new Error("OPENROUTER_API_KEY not set in Convex env");

//     try {
//       const hasJd = !!cv.jobDescription?.trim();
//       let requiredKeywords: string[] = [];
//       let niceToHaveKeywords: string[] = [];
//       let matchNotes = "";
//       let matchAnalysisPayload:
//         | {
//             score: number;
//             requiredKeywords: string[];
//             niceToHaveKeywords: string[];
//             matchedKeywords: string[];
//             missingKeywords: string[];
//             suggestions: string[];
//           }
//         | undefined;

//       // ---- PASS 1: extract structured requirements from the JD ----
//       // Only runs when a JD is actually provided — falls back to plain
//       // targetRole tailoring otherwise, so this stays backward-compatible
//       // with existing CVs / the "neutral" flow.
//       if (hasJd) {
//         const extractPrompt = `
// You are analyzing a job description. Output ONLY valid JSON (no markdown fences, no commentary):

// {
//   "requiredKeywords": string[],   // 6-14 must-have skills/tools/qualifications, each 1-3 words
//   "niceToHaveKeywords": string[], // 3-8 bonus skills/tools mentioned as preferred, not required
//   "seniority": string,            // e.g. "mid-level", "senior", "entry-level"
//   "coreResponsibilities": string[] // 3-6 short phrases, the actual day-to-day of the role
// }

// Extract only from what's explicitly stated or clearly implied by the posting.
// Prefer specific, ATS-style keywords ("React", "stakeholder management", "AWS")
// over vague ones ("team player").

// JOB DESCRIPTION:
// ${cv.jobDescription}
//         `.trim();

//         const extracted = await callOpenRouter(apiKey, extractPrompt);
//         requiredKeywords = extracted.requiredKeywords ?? [];
//         niceToHaveKeywords = extracted.niceToHaveKeywords ?? [];

//         // ---- PASS 2 (code, not AI): deterministic coverage score ----
//         const candidateText = flattenCandidateText(cv);
//         const match = computeMatch(
//           requiredKeywords,
//           niceToHaveKeywords,
//           candidateText,
//         );

//         matchNotes = `
// JOB MATCH CONTEXT (for your reference — use to decide emphasis, do not repeat verbatim):
// Required keywords for this role: ${requiredKeywords.join(", ")}
// Nice-to-have: ${niceToHaveKeywords.join(", ")}
// Candidate currently demonstrates: ${match.matchedKeywords.join(", ") || "none detected yet"}
// Candidate is missing: ${match.missingKeywords.join(", ") || "none"}

// For any "missing" keyword: if the candidate's real experience genuinely covers
// it under different wording (e.g. they wrote "built REST endpoints" and the
// keyword is "API development"), you MAY surface the standard terminology in a
// bullet. Do NOT claim a missing keyword if there's no underlying evidence for
// it anywhere in the candidate data — that's fabrication, not reframing.
//         `.trim();

//         // Stored on the version via _saveGeneratedContent — there is no
//         // separate _saveMatchAnalysis mutation anymore.
//         matchAnalysisPayload = {
//           score: match.score,
//           requiredKeywords,
//           niceToHaveKeywords,
//           matchedKeywords: match.matchedKeywords,
//           missingKeywords: match.missingKeywords,
//           suggestions: match.missingKeywords
//             .slice(0, 5)
//             .map(
//               (kw) =>
//                 `Consider adding "${kw}" if you have relevant experience — this role lists it.`,
//             ),
//         };
//       }

//       // ---- PASS 3: tailor the CV, same shape as before, JD-aware ----
//       const targetLine = cv.isNeutral
//         ? "Produce a NEUTRAL, general-purpose CV that fairly represents their experience — do not favor any one job type."
//         : hasJd
//           ? `Tailor this CV specifically for the job description below. Re-order and re-weight bullets toward what THIS SPECIFIC posting cares about most — not just the job title in general. Do not invent facts not present in the source data — only reframe and prioritize what's given.\n\nJOB DESCRIPTION:\n${cv.jobDescription}\n\n${matchNotes}`
//           : `Tailor this CV specifically for a "${cv.targetRole}" role. Re-order and re-weight bullets toward what that role cares about most. Do not invent facts not present in the source data — only reframe and prioritize what's given.`;

//       const prompt = `
// You are a professional CV writer. Given the candidate data below, output ONLY valid JSON
// (no markdown fences, no commentary) matching this shape:

// {
//   "headline": string,
//   "summary": string,
//   "topSkills": string[],
//   "experience": [{ "company": string, "role": string, "period": string, "bullets": string[] }],
//   "education": [{ "institution": string, "qualification": string, "period": string, "description": string | null }],
//   "testimonialHighlights": [{ "author": string, "text": string }],
//   "achievementHighlights": [{ "title": string, "description": string }],
//   "closingNote": string
// }

// SUMMARY REQUIREMENTS:
// Write "summary" as a polished, third-person professional biography of 5-7 sentences
// (roughly 100-150 words).

// EDUCATION REQUIREMENTS:
// For each education entry, set "description" to the source entry's "description" field
// copied VERBATIM when present.

// ${targetLine}

// If achievements are provided, select and order the ones most relevant to the target role in
// "achievementHighlights" — do not invent achievements not present in the source data.

// CANDIDATE DATA:
// ${JSON.stringify(
//   {
//     personalInfo: cv.personalInfo,
//     education: cv.education,
//     experience: cv.experience,
//     testimonials: cv.testimonials,
//     references: cv.references,
//     achievements: cv.achievements,
//     interests: cv.interests,
//     links: cv.links,
//   },
//   null,
//   2,
// )}
//       `.trim();

//       const parsed = await callOpenRouter(apiKey, prompt);

//       await ctx.runMutation(internal.cvs._saveGeneratedContent, {
//         cvId: args.cvId,
//         generatedContent: parsed,
//         style: args.style ?? "neutral",
//         layout: args.layout ?? "centered",
//         label: cv.isNeutral
//           ? "Neutral"
//           : cv.targetRole
//             ? String(cv.targetRole)
//             : undefined,
//         matchAnalysis: matchAnalysisPayload,
//       });
//     } catch (err: unknown) {
//       const message =
//         err instanceof Error ? err.message : "Unknown generation error";
//       await ctx.runMutation(internal.cvs._saveGenerationError, {
//         cvId: args.cvId,
//         error: message,
//       });
//       throw err;
//     }
//   },
// });

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
  args: { planId: v.id("businessPlans") },
  returns: v.null(),
  handler: async (ctx, { planId }) => {
    const plan = await ctx.runQuery(internal.businessPlans._getPlanInternal, {
      planId,
    });
    if (!plan) {
      throw new Error("Plan not found");
    }

    await ctx.runMutation(internal.businessPlans._setGenerating, { planId });

    try {
      // Deterministic math first — the model never sees raw inputs without
      // these already computed, and never gets asked to compute them itself.
      const calc = calculateFinancials(plan);
      const viability = computeViability(plan, calc);

      const prompt = buildPrompt(plan, calc, viability);

      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`AI provider error (${response.status}): ${errText}`);
      }

      const data = (await response.json()) as {
        content: { type: string; text?: string }[];
      };
      const text = data.content
        .map((block) => (block.type === "text" ? (block.text ?? "") : ""))
        .join("\n")
        .trim();

      const generatedContent = parseGeneratedContent(text);

      await ctx.runMutation(internal.businessPlans._saveGeneratedContent, {
        planId,
        generatedContent,
        viabilityAnalysis: viability,
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
