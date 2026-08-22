// convex/schema.ts
//
// TRANSFORMED FROM: CV Maker's `cvs` / `cvVersions` tables.
// Same append-only-versions pattern: `businessPlans` holds the raw inputs
// (everything the wizard collects), `businessPlanVersions` holds every
// AI-generated narrative + calculated-financials snapshot. Nothing is
// overwritten — restyling or regenerating just appends a new version.

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Deterministic (code-computed, not AI) health check on a specific
// generated version — mirrors the old matchAnalysisValidator, but scores
// financial viability instead of job-keyword match.
export const viabilityAnalysisValidator = v.object({
  score: v.number(), // 0-100, code-computed from margins/break-even/funding gap
  flags: v.array(v.string()), // e.g. "Gross margin below 20% is thin for retail"
  suggestions: v.array(v.string()), // e.g. "Consider raising average price by 8% to hit target margin"
});

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("user")),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // One row per business plan "project". Styling/layout/generated
  // narrative + calculated financials live in businessPlanVersions, not here.
  businessPlans: defineTable({
    userId: v.id("users"),
    title: v.string(), // internal label, e.g. "Coffee Shop — v2"

    shareId: v.string(), // public slug: /plan/[shareId]
    activeVersionId: v.optional(v.id("businessPlanVersions")),
    status: v.union(
      v.literal("draft"),
      v.literal("generating"),
      v.literal("ready"),
      v.literal("failed"),
    ),
    generationError: v.optional(v.string()),

    // ---- 1. Basic Company / Identity Information ----
    identity: v.object({
      businessName: v.string(),
      tradingName: v.optional(v.string()),
      legalStructure: v.optional(
        v.union(
          v.literal("sole_proprietorship"),
          v.literal("partnership"),
          v.literal("llc"),
          v.literal("corporation"),
          v.literal("nonprofit"),
          v.literal("other"),
        ),
      ),
      registrationDate: v.optional(v.string()),
      registrationNumber: v.optional(v.string()),
      physicalAddress: v.optional(v.string()),
      mailingAddress: v.optional(v.string()),
      website: v.optional(v.string()),
      phone: v.optional(v.string()),
      email: v.optional(v.string()),
      socialLinks: v.array(v.object({ label: v.string(), url: v.string() })),
      logoUrl: v.optional(v.string()),
      foundingYear: v.optional(v.number()),
      stage: v.optional(
        v.union(
          v.literal("idea"),
          v.literal("pre_revenue"),
          v.literal("startup"),
          v.literal("growth"),
          v.literal("established"),
        ),
      ),
      industry: v.optional(v.string()),
      industryCode: v.optional(v.string()), // NAICS or equivalent
      missionStatement: v.optional(v.string()),
      visionStatement: v.optional(v.string()),
      coreValues: v.array(v.string()),
      problemStatement: v.optional(v.string()),
      uniqueValueProposition: v.optional(v.string()),
      shortTermGoals: v.array(v.string()), // ~1 year
      mediumTermGoals: v.array(v.string()), // ~3 years
      longTermGoals: v.array(v.string()), // 5+ years
      exitStrategy: v.optional(v.string()),
    }),
    currency: v.optional(v.string()),

    // ---- 2. Ownership, Team & Organization ----
    team: v.object({
      owners: v.array(
        v.object({
          name: v.string(),
          ownershipPercent: v.optional(v.number()),
          role: v.optional(v.string()),
          bio: v.optional(v.string()),
        }),
      ),
      managementTeam: v.array(
        v.object({
          name: v.string(),
          title: v.string(),
          responsibilities: v.optional(v.string()),
          experience: v.optional(v.string()),
        }),
      ),
      orgStructureDescription: v.optional(v.string()),
      plannedHires: v.array(
        v.object({
          role: v.string(),
          count: v.number(),
          timeline: v.optional(v.string()),
          annualSalary: v.optional(v.number()),
        }),
      ),
      advisors: v.array(
        v.object({ name: v.string(), role: v.optional(v.string()) }),
      ),
      keyPartnerships: v.array(
        v.object({ name: v.string(), description: v.optional(v.string()) }),
      ),
      licensesAndPermits: v.array(v.string()),
      intellectualProperty: v.array(
        v.object({
          type: v.string(), // patent / trademark / copyright / trade secret
          description: v.string(),
        }),
      ),
    }),

    // ---- 3. Products & Services ----
    offerings: v.object({
      products: v.array(
        v.object({
          name: v.string(),
          description: v.string(),
          features: v.optional(v.string()),
          price: v.optional(v.number()),
          pricingNotes: v.optional(v.string()),
          developmentStage: v.optional(v.string()),
        }),
      ),
      productionProcess: v.optional(v.string()),
      inventoryRequirements: v.optional(v.string()),
      qualityControl: v.optional(v.string()),
      roadmap: v.array(v.string()),
    }),

    // ---- 4. Market Analysis ----
    market: v.object({
      targetDemographics: v.optional(v.string()),
      targetGeography: v.optional(v.string()),
      customerNeeds: v.optional(v.string()),
      tam: v.optional(v.number()), // Total Addressable Market ($)
      sam: v.optional(v.number()), // Serviceable Addressable Market ($)
      som: v.optional(v.number()), // Serviceable Obtainable Market ($)
      marketSizeSource: v.optional(v.string()),
      marketTrends: v.optional(v.string()),
      competitors: v.array(
        v.object({
          name: v.string(),
          strengths: v.optional(v.string()),
          weaknesses: v.optional(v.string()),
          marketSharePercent: v.optional(v.number()),
          pricing: v.optional(v.string()),
          differentiation: v.optional(v.string()),
        }),
      ),
      swotStrengths: v.array(v.string()),
      swotWeaknesses: v.array(v.string()),
      swotOpportunities: v.array(v.string()),
      swotThreats: v.array(v.string()),
      barriersToEntry: v.optional(v.string()),
      regulatoryNotes: v.optional(v.string()),
      seasonalFactors: v.optional(v.string()),
    }),

    // ---- 5. Marketing & Sales Strategy ----
    marketingSales: v.object({
      channels: v.array(v.string()),
      salesStrategy: v.optional(v.string()),
      cac: v.optional(v.number()), // customer acquisition cost
      ltv: v.optional(v.number()), // lifetime value
      branding: v.optional(v.string()),
      salesTargets: v.optional(v.string()),
      distributionChannels: v.array(v.string()),
      retentionPlans: v.optional(v.string()),
      marketingBudgetAllocation: v.array(
        v.object({ channel: v.string(), percentOfBudget: v.number() }),
      ),
    }),

    // ---- 6. Operations Plan ----
    operations: v.object({
      locations: v.array(v.string()),
      facilitiesNotes: v.optional(v.string()), // rent/lease terms, ownership, build-out
      equipment: v.array(
        v.object({
          item: v.string(),
          cost: v.optional(v.number()),
          ownedOrLeased: v.optional(v.string()),
        }),
      ),
      suppliers: v.array(v.string()),
      productionCapacityNotes: v.optional(v.string()),
      logisticsNotes: v.optional(v.string()),
      techStack: v.array(v.string()),
      hoursOfOperation: v.optional(v.string()),
      scalabilityPlans: v.optional(v.string()),
      operationalRisks: v.array(
        v.object({ risk: v.string(), mitigation: v.optional(v.string()) }),
      ),
    }),

    // ---- 7. Startup Capital & Funding ----
    funding: v.object({
      fundingSources: v.array(
        v.object({
          source: v.string(), // personal / loan / investor / grant / crowdfunding
          amount: v.number(),
          terms: v.optional(v.string()),
        }),
      ),
      fundingRequestAmount: v.optional(v.number()),
      equityOffered: v.optional(v.string()),
      debtTerms: v.optional(v.string()),
      collateral: v.optional(v.string()),
      // One-time startup costs by category — the AI/code totals these.
      startupCosts: v.array(
        v.object({ category: v.string(), amount: v.number() }),
      ),
    }),

    // ---- 8. Financial Inputs & Projections (core for AI calculations) ----
    financials: v.object({
      // Revenue assumptions
      monthlySalesVolume: v.optional(v.number()), // units or customers/month
      avgSellingPrice: v.optional(v.number()),
      revenueStreams: v.array(
        v.object({ name: v.string(), percentOfRevenue: v.number() }),
      ),
      monthlyGrowthRatePercent: v.optional(v.number()),
      seasonalityNotes: v.optional(v.string()),
      churnRatePercent: v.optional(v.number()),

      // COGS / direct costs
      materialCostPerUnit: v.optional(v.number()),
      directLaborPerUnit: v.optional(v.number()),
      shippingCostPerUnit: v.optional(v.number()),
      otherVariableCostPerUnit: v.optional(v.number()),

      // Operating expenses (monthly, fixed + variable)
      operatingExpenses: v.array(
        v.object({
          category: v.string(), // rent, salaries, marketing, insurance, etc.
          monthlyAmount: v.number(),
          isFixed: v.boolean(),
        }),
      ),

      // Other financial data
      openingCashBalance: v.optional(v.number()),
      loans: v.array(
        v.object({
          principal: v.number(),
          annualInterestRatePercent: v.number(),
          termMonths: v.number(),
        }),
      ),
      taxRatePercent: v.optional(v.number()),
      inflationRatePercent: v.optional(v.number()),

      projectionHorizonMonths: v.optional(v.number()), // default 12
      scenario: v.optional(
        v.union(
          v.literal("base"),
          v.literal("optimistic"),
          v.literal("pessimistic"),
        ),
      ),
    }),

    // ---- 9. KPIs & Assumptions ----
    kpis: v.object({
      grossMarginTargetPercent: v.optional(v.number()),
      netMarginTargetPercent: v.optional(v.number()),
      roiTargetPercent: v.optional(v.number()),
      paybackPeriodTargetMonths: v.optional(v.number()),
      assumptions: v.array(v.string()),
      riskFactors: v.array(
        v.object({ risk: v.string(), mitigation: v.optional(v.string()) }),
      ),
    }),

    // ---- 10. Supporting / Appendix Data ----
    appendix: v.object({
      historicalFinancialsNotes: v.optional(v.string()),
      marketResearchSources: v.array(v.string()),
      attachments: v.array(v.object({ label: v.string(), url: v.string() })),
      milestones: v.array(
        v.object({
          title: v.string(),
          date: v.optional(v.string()),
          owner: v.optional(v.string()),
        }),
      ),
      freeNotes: v.optional(v.string()),
    }),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_share_id", ["shareId"]),

  // Append-only. Every regeneration AND every style/layout change on the
  // same plan creates a new row here — never overwritten.
  businessPlanVersions: defineTable({
    planId: v.id("businessPlans"),
    userId: v.id("users"), // denormalized so ownership checks don't need a join back
    versionNumber: v.number(),
    label: v.string(), // e.g. "Investor draft", or auto "Version 3"

    style: v.optional(v.string()),
    layout: v.optional(v.string()), // one of lib/layouts.ts PlanLayoutId

    generatedContent: v.any(), // narrative sections + calculatedFinancials snapshot
    viabilityAnalysis: v.optional(viabilityAnalysisValidator),

    createdAt: v.number(),
    editedAt: v.optional(v.number()),
  })
    .index("by_plan", ["planId"])
    .index("by_plan_and_version", ["planId", "versionNumber"]),
});
