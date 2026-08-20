// lib/financial-calculations.ts
//
// NEW FILE — has no CV-app equivalent. This is the deterministic (code, not
// AI) number-crunching layer. The AI never computes money — it only writes
// narrative around numbers this file produces. That keeps every dollar
// figure in the generated plan reproducible and auditable, and lets
// _computeViability() (below) flag unrealistic assumptions with certainty
// instead of an LLM's arithmetic guesswork.
//
// Mirrors the role lib/keyword-match.ts played in the CV app (deterministic
// score computed in code, handed to the AI as read-only context).

import type { Doc } from "../convex/_generated/dataModel";

type Plan = Doc<"businessPlans">;

export interface MonthlyProjection {
  month: number;
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  ebitda: number;
  loanInterest: number;
  netProfit: number;
  cashBalance: number;
}

export interface CalculatedFinancials {
  totalStartupCost: number;
  totalFundingSecured: number;
  fundingGap: number;

  monthlyRevenueAtLaunch: number;
  monthlyCogs: number;
  monthlyGrossProfit: number;
  grossMarginPercent: number;

  monthlyOperatingExpenses: number;
  monthlyFixedExpenses: number;
  monthlyVariableExpenses: number;

  monthlyEbitda: number;
  monthlyNetProfit: number;
  netMarginPercent: number;

  breakEvenUnits: number | null;
  breakEvenRevenue: number | null;
  contributionMarginPerUnit: number | null;

  roiPercentYear1: number | null;
  paybackPeriodMonths: number | null;

  year1Revenue: number;
  year1NetProfit: number;
  projection: MonthlyProjection[]; // length = projectionHorizonMonths (default 12)
}

const sum = (nums: (number | undefined)[]) =>
  nums.reduce<number>((acc, n) => acc + (n ?? 0), 0);

/** Straight-line monthly interest+principal for a simple amortizing loan. */
function monthlyLoanPayment(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
) {
  if (termMonths <= 0) return { payment: 0, interestMonth1: 0 };
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return { payment: principal / termMonths, interestMonth1: 0 };
  const payment = (principal * r) / (1 - Math.pow(1 + r, -termMonths));
  return { payment, interestMonth1: principal * r };
}

export function calculateFinancials(plan: Plan): CalculatedFinancials {
  const f = plan.financials;
  const horizon = f.projectionHorizonMonths ?? 12;

  // ---- Startup costs & funding ----
  const totalStartupCost = sum(plan.funding.startupCosts.map((c) => c.amount));
  const totalFundingSecured = sum(
    plan.funding.fundingSources.map((s) => s.amount),
  );
  const fundingGap = totalStartupCost - totalFundingSecured;

  // ---- Revenue (month 1 baseline) ----
  const units = f.monthlySalesVolume ?? 0;
  const price = f.avgSellingPrice ?? 0;
  const monthlyRevenueAtLaunch = units * price;

  // ---- COGS ----
  const variableCostPerUnit = sum([
    f.materialCostPerUnit,
    f.directLaborPerUnit,
    f.shippingCostPerUnit,
    f.otherVariableCostPerUnit,
  ]);
  const monthlyCogs = variableCostPerUnit * units;
  const monthlyGrossProfit = monthlyRevenueAtLaunch - monthlyCogs;
  const grossMarginPercent =
    monthlyRevenueAtLaunch > 0
      ? (monthlyGrossProfit / monthlyRevenueAtLaunch) * 100
      : 0;

  // ---- Operating expenses ----
  const monthlyFixedExpenses = sum(
    f.operatingExpenses.filter((e) => e.isFixed).map((e) => e.monthlyAmount),
  );
  const monthlyVariableExpenses = sum(
    f.operatingExpenses.filter((e) => !e.isFixed).map((e) => e.monthlyAmount),
  );
  const monthlyOperatingExpenses =
    monthlyFixedExpenses + monthlyVariableExpenses;

  const monthlyEbitda = monthlyGrossProfit - monthlyOperatingExpenses;

  // ---- Loan interest (month 1, summed across all loans) ----
  const loanDetails = plan.financials.loans.map((l) =>
    monthlyLoanPayment(l.principal, l.annualInterestRatePercent, l.termMonths),
  );
  const monthlyLoanInterest = sum(loanDetails.map((l) => l.interestMonth1));
  const monthlyLoanPaymentTotal = sum(loanDetails.map((l) => l.payment));

  const taxRate = (f.taxRatePercent ?? 0) / 100;
  const preTax = monthlyEbitda - monthlyLoanInterest;
  const monthlyNetProfit = preTax - Math.max(preTax, 0) * taxRate;
  const netMarginPercent =
    monthlyRevenueAtLaunch > 0
      ? (monthlyNetProfit / monthlyRevenueAtLaunch) * 100
      : 0;

  // ---- Break-even (units & revenue) ----
  const contributionMarginPerUnit =
    price > 0 ? price - variableCostPerUnit : null;
  const breakEvenUnits =
    contributionMarginPerUnit && contributionMarginPerUnit > 0
      ? Math.ceil(monthlyFixedExpenses / contributionMarginPerUnit)
      : null;
  const breakEvenRevenue =
    breakEvenUnits !== null ? breakEvenUnits * price : null;

  // ---- Monthly projection with compounding growth + amortizing loans ----
  const growthRate = (f.monthlyGrowthRatePercent ?? 0) / 100;
  const inflationRate = (f.inflationRatePercent ?? 0) / 100;
  let cashBalance = f.openingCashBalance ?? 0;
  const projection: MonthlyProjection[] = [];

  for (let m = 1; m <= horizon; m++) {
    const growthFactor = Math.pow(1 + growthRate, m - 1);
    const revenue = monthlyRevenueAtLaunch * growthFactor;
    const cogs = monthlyCogs * growthFactor;
    const grossProfit = revenue - cogs;
    const inflationFactor = Math.pow(1 + inflationRate, m - 1);
    const opex = monthlyOperatingExpenses * inflationFactor;
    const ebitda = grossProfit - opex;
    const loanInterest = monthlyLoanInterest; // simplified: flat across horizon
    const preTaxM = ebitda - loanInterest;
    const netProfit = preTaxM - Math.max(preTaxM, 0) * taxRate;

    cashBalance += netProfit - monthlyLoanPaymentTotal + loanInterest; // add back interest since it's inside netProfit already, subtract full debt service
    projection.push({
      month: m,
      revenue,
      cogs,
      grossProfit,
      operatingExpenses: opex,
      ebitda,
      loanInterest,
      netProfit,
      cashBalance,
    });
  }

  const year1 = projection.slice(0, 12);
  const year1Revenue = sum(year1.map((p) => p.revenue));
  const year1NetProfit = sum(year1.map((p) => p.netProfit));

  // ---- ROI & payback ----
  const totalInvested = totalStartupCost || totalFundingSecured;
  const roiPercentYear1 =
    totalInvested > 0 ? (year1NetProfit / totalInvested) * 100 : null;

  let paybackPeriodMonths: number | null = null;
  if (totalInvested > 0) {
    let cumulative = 0;
    for (const p of projection) {
      cumulative += p.netProfit;
      if (cumulative >= totalInvested) {
        paybackPeriodMonths = p.month;
        break;
      }
    }
  }

  return {
    totalStartupCost,
    totalFundingSecured,
    fundingGap,
    monthlyRevenueAtLaunch,
    monthlyCogs,
    monthlyGrossProfit,
    grossMarginPercent,
    monthlyOperatingExpenses,
    monthlyFixedExpenses,
    monthlyVariableExpenses,
    monthlyEbitda,
    monthlyNetProfit,
    netMarginPercent,
    breakEvenUnits,
    breakEvenRevenue,
    contributionMarginPerUnit,
    roiPercentYear1,
    paybackPeriodMonths,
    year1Revenue,
    year1NetProfit,
    projection,
  };
}

// ---------------------------------------------------------------------
// Deterministic viability score — the business-plan equivalent of
// computeMatch() in lib/keyword-match.ts. Flags/suggestions are handed to
// the AI as read-only context (see convex/ai.ts) and also stored verbatim
// on the version for the UI's "viability score" badge.
// ---------------------------------------------------------------------
export function computeViability(plan: Plan, calc: CalculatedFinancials) {
  const flags: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  if (calc.fundingGap > 0) {
    score -= 20;
    flags.push(
      `Funding gap of ${calc.fundingGap.toLocaleString()} — startup costs exceed secured funding.`,
    );
    suggestions.push(
      "Close the funding gap by raising the funding request, cutting startup costs, or adding a funding source.",
    );
  }

  if (calc.grossMarginPercent < 20 && calc.monthlyRevenueAtLaunch > 0) {
    score -= 15;
    flags.push(
      `Gross margin of ${calc.grossMarginPercent.toFixed(1)}% is thin.`,
    );
    suggestions.push(
      "Consider raising average price or reducing per-unit costs to widen gross margin.",
    );
  }

  if (calc.monthlyNetProfit < 0) {
    score -= 20;
    flags.push("Projected month-1 net profit is negative.");
    suggestions.push(
      "Revisit fixed costs or sales-volume assumptions — the plan is not yet profitable at launch.",
    );
  }

  if (calc.breakEvenUnits === null) {
    score -= 10;
    flags.push(
      "Break-even point could not be calculated — check pricing vs. variable cost inputs.",
    );
  }

  if (
    plan.financials.monthlyGrowthRatePercent !== undefined &&
    plan.financials.monthlyGrowthRatePercent > 20
  ) {
    score -= 10;
    flags.push(
      `Assumed monthly growth of ${plan.financials.monthlyGrowthRatePercent}% is aggressive — most early-stage businesses see single digits.`,
    );
    suggestions.push(
      "Consider modeling a more conservative growth scenario alongside this one.",
    );
  }

  if (plan.market.tam === undefined || plan.market.som === undefined) {
    score -= 5;
    flags.push(
      "Market size (TAM/SOM) not provided — investors will expect this.",
    );
  }

  score = Math.max(0, Math.min(100, score));
  return { score, flags, suggestions };
}
