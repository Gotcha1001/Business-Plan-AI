// convex/businessPlans.ts
//
// TRANSFORMED FROM: convex/cvs.ts
// Same shape: upsert the raw-input draft, an action (ai.ts) generates a
// version, versions are append-only and one is "active" (used for the
// public share link + PDF export).

import { v } from "convex/values";
import {
  mutation,
  query,
  internalMutation,
  internalQuery,
  QueryCtx,
  MutationCtx,
} from "./_generated/server";
import { customAlphabet } from "nanoid";
import { viabilityAnalysisValidator } from "./schema";
import { Id } from "./_generated/dataModel";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

async function requireUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();
  if (!user) throw new Error("User record not found — call createOrGet first");
  return user;
}

// Shared so every place that inserts a businessPlanVersions row numbers it
// the same way — max existing versionNumber + 1, not row count (row count
// breaks once any version has been deleted).
async function nextVersionNumber(
  ctx: MutationCtx,
  planId: Id<"businessPlans">,
) {
  const last = await ctx.db
    .query("businessPlanVersions")
    .withIndex("by_plan", (q) => q.eq("planId", planId))
    .order("desc")
    .first();
  return (last?.versionNumber ?? 0) + 1;
}

// Input fields for the plan itself — the 10 sections from schema.ts.
// NOTE: style/layout are NOT here — those are per-version (see
// businessPlanVersions), chosen at generation/restyle time.
const planFields = {
  title: v.string(),
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
    industryCode: v.optional(v.string()),
    missionStatement: v.optional(v.string()),
    visionStatement: v.optional(v.string()),
    coreValues: v.array(v.string()),
    problemStatement: v.optional(v.string()),
    uniqueValueProposition: v.optional(v.string()),
    shortTermGoals: v.array(v.string()),
    mediumTermGoals: v.array(v.string()),
    longTermGoals: v.array(v.string()),
    exitStrategy: v.optional(v.string()),
  }),
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
      v.object({ type: v.string(), description: v.string() }),
    ),
  }),
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
  market: v.object({
    targetDemographics: v.optional(v.string()),
    targetGeography: v.optional(v.string()),
    customerNeeds: v.optional(v.string()),
    tam: v.optional(v.number()),
    sam: v.optional(v.number()),
    som: v.optional(v.number()),
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
  marketingSales: v.object({
    channels: v.array(v.string()),
    salesStrategy: v.optional(v.string()),
    cac: v.optional(v.number()),
    ltv: v.optional(v.number()),
    branding: v.optional(v.string()),
    salesTargets: v.optional(v.string()),
    distributionChannels: v.array(v.string()),
    retentionPlans: v.optional(v.string()),
    marketingBudgetAllocation: v.array(
      v.object({ channel: v.string(), percentOfBudget: v.number() }),
    ),
  }),
  operations: v.object({
    locations: v.array(v.string()),
    facilitiesNotes: v.optional(v.string()),
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
  funding: v.object({
    fundingSources: v.array(
      v.object({
        source: v.string(),
        amount: v.number(),
        terms: v.optional(v.string()),
      }),
    ),
    fundingRequestAmount: v.optional(v.number()),
    equityOffered: v.optional(v.string()),
    debtTerms: v.optional(v.string()),
    collateral: v.optional(v.string()),
    startupCosts: v.array(
      v.object({ category: v.string(), amount: v.number() }),
    ),
  }),
  financials: v.object({
    monthlySalesVolume: v.optional(v.number()),
    avgSellingPrice: v.optional(v.number()),
    revenueStreams: v.array(
      v.object({ name: v.string(), percentOfRevenue: v.number() }),
    ),
    monthlyGrowthRatePercent: v.optional(v.number()),
    seasonalityNotes: v.optional(v.string()),
    churnRatePercent: v.optional(v.number()),
    materialCostPerUnit: v.optional(v.number()),
    directLaborPerUnit: v.optional(v.number()),
    shippingCostPerUnit: v.optional(v.number()),
    otherVariableCostPerUnit: v.optional(v.number()),
    operatingExpenses: v.array(
      v.object({
        category: v.string(),
        monthlyAmount: v.number(),
        isFixed: v.boolean(),
      }),
    ),
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
    projectionHorizonMonths: v.optional(v.number()),
    scenario: v.optional(
      v.union(
        v.literal("base"),
        v.literal("optimistic"),
        v.literal("pessimistic"),
      ),
    ),
  }),
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
};

// Create new draft, or update an existing one if planId is passed.
// Does NOT trigger AI generation — that's a separate action call (ai.ts).
//
// preserveStatus: pass true when this call is just saving section data in
// place (e.g. autosave from the wizard) and should NOT knock the plan back
// to "draft". Same rationale as the CV app's upsertCv.
export const upsertPlan = mutation({
  args: {
    planId: v.optional(v.id("businessPlans")),
    preserveStatus: v.optional(v.boolean()),
    ...planFields,
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const { planId, preserveStatus, ...fields } = args;
    if (planId) {
      const existing = await ctx.db.get(planId);
      if (!existing || existing.userId !== user._id)
        throw new Error("Not found");
      await ctx.db.patch(planId, {
        ...fields,
        updatedAt: Date.now(),
        ...(preserveStatus ? {} : { status: "draft" }),
      });
      return planId;
    }
    return await ctx.db.insert("businessPlans", {
      ...fields,
      userId: user._id,
      shareId: nanoid(),
      status: "draft",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const deletePlan = mutation({
  args: { planId: v.id("businessPlans") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.userId !== user._id) throw new Error("Not found");

    const versions = await ctx.db
      .query("businessPlanVersions")
      .withIndex("by_plan", (q) => q.eq("planId", args.planId))
      .collect();
    for (const version of versions) {
      await ctx.db.delete(version._id);
    }
    await ctx.db.delete(args.planId);
  },
});

export const listMyPlans = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return [];
    return await ctx.db
      .query("businessPlans")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getPlan = query({
  args: { planId: v.id("businessPlans") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.userId !== user._id) return null;
    return plan;
  },
});

// Convenience for the editor/preview UI: the plan plus its currently active
// version's content, joined into one object.
export const getPlanWithActiveVersion = query({
  args: { planId: v.id("businessPlans") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.userId !== user._id) return null;
    const activeVersion = plan.activeVersionId
      ? await ctx.db.get(plan.activeVersionId)
      : null;
    return { plan, activeVersion };
  },
});

// PUBLIC — no auth check. This is what the /plan/[shareId] page reads.
export const getByShareId = query({
  args: { shareId: v.string() },
  handler: async (ctx, args) => {
    const plan = await ctx.db
      .query("businessPlans")
      .withIndex("by_share_id", (q) => q.eq("shareId", args.shareId))
      .first();
    if (!plan || plan.status !== "ready" || !plan.activeVersionId) return null;

    const activeVersion = await ctx.db.get(plan.activeVersionId);
    if (!activeVersion) return null;

    return { plan, activeVersion };
  },
});

// --- internal helpers used only by convex/ai.ts ---
export const _getPlanInternal = internalQuery({
  args: { planId: v.id("businessPlans") },
  handler: async (ctx, args) => await ctx.db.get(args.planId),
});

export const _setGenerating = internalMutation({
  args: { planId: v.id("businessPlans") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.planId, { status: "generating" });
  },
});

// Appends a new version (AI regeneration OR a style/layout-only change use
// this same path). Never overwrites a prior version; the new one becomes
// active.
export const _saveGeneratedContent = internalMutation({
  args: {
    planId: v.id("businessPlans"),
    generatedContent: v.any(),
    style: v.optional(v.string()),
    layout: v.optional(v.string()),
    label: v.optional(v.string()),
    viabilityAnalysis: v.optional(viabilityAnalysisValidator),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) throw new Error("Business plan not found");

    const versionNumber = await nextVersionNumber(ctx, args.planId);

    const versionId = await ctx.db.insert("businessPlanVersions", {
      planId: args.planId,
      userId: plan.userId,
      versionNumber,
      label: args.label ?? args.style ?? `Version ${versionNumber}`,
      style: args.style,
      layout: args.layout,
      generatedContent: args.generatedContent,
      viabilityAnalysis: args.viabilityAnalysis,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.planId, {
      activeVersionId: versionId,
      status: "ready",
      updatedAt: Date.now(),
    });

    return versionId;
  },
});

export const _saveGenerationError = internalMutation({
  args: { planId: v.id("businessPlans"), error: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.planId, {
      status: "failed",
      generationError: args.error,
    });
  },
});

// Light payload for the version history gallery — no generatedContent, so
// the list stays fast even with many versions.
export const listPlanVersions = query({
  args: { planId: v.id("businessPlans") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.userId !== user._id) throw new Error("Not found");

    const versions = await ctx.db
      .query("businessPlanVersions")
      .withIndex("by_plan", (q) => q.eq("planId", args.planId))
      .order("desc")
      .collect();

    return versions.map((version) => ({
      _id: version._id,
      versionNumber: version.versionNumber,
      label: version.label,
      style: version.style,
      layout: version.layout,
      viabilityScore: version.viabilityAnalysis?.score,
      isActive: version._id === plan.activeVersionId,
      createdAt: version.createdAt,
    }));
  },
});

export const getPlanVersionContent = query({
  args: { versionId: v.id("businessPlanVersions") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const version = await ctx.db.get(args.versionId);
    if (!version || version.userId !== user._id) throw new Error("Not found");
    return version;
  },
});

// Point the share link at a different existing version.
export const setActiveVersion = mutation({
  args: {
    planId: v.id("businessPlans"),
    versionId: v.id("businessPlanVersions"),
  },
  handler: async (ctx, { planId, versionId }) => {
    const user = await requireUser(ctx);
    const plan = await ctx.db.get(planId);
    if (!plan || plan.userId !== user._id) throw new Error("Not found");

    const version = await ctx.db.get(versionId);
    if (!version || version.planId !== planId) throw new Error("Not found");

    await ctx.db.patch(planId, {
      activeVersionId: versionId,
      updatedAt: Date.now(),
    });
  },
});

// Permanent delete. If the deleted version was the active one, fall back
// to the newest remaining version (or clear activeVersionId if none left).
export const deleteVersion = mutation({
  args: { versionId: v.id("businessPlanVersions") },
  handler: async (ctx, { versionId }) => {
    const user = await requireUser(ctx);
    const version = await ctx.db.get(versionId);
    if (!version || version.userId !== user._id) throw new Error("Not found");

    const plan = await ctx.db.get(version.planId);
    if (!plan || plan.userId !== user._id) throw new Error("Not found");

    await ctx.db.delete(versionId);

    if (plan.activeVersionId === versionId) {
      const fallback = await ctx.db
        .query("businessPlanVersions")
        .withIndex("by_plan", (q) => q.eq("planId", version.planId))
        .order("desc")
        .first();
      await ctx.db.patch(version.planId, {
        activeVersionId: fallback?._id,
        updatedAt: Date.now(),
      });
    }
  },
});

export const updateVersionContent = mutation({
  args: {
    versionId: v.id("businessPlanVersions"),
    generatedContent: v.any(),
    label: v.optional(v.string()),
    style: v.optional(v.string()),
    layout: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const version = await ctx.db.get(args.versionId);
    if (!version || version.userId !== user._id) throw new Error("Not found");
    await ctx.db.patch(args.versionId, {
      generatedContent: args.generatedContent,
      ...(args.label !== undefined ? { label: args.label } : {}),
      ...(args.style !== undefined ? { style: args.style } : {}),
      ...(args.layout !== undefined ? { layout: args.layout } : {}),
      editedAt: Date.now(),
    });
  },
});
