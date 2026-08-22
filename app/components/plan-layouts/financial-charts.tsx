// components/plan-layouts/financial-charts.tsx
//
// TRANSFORMED FROM: components/cv-layouts/graph-stats.tsx
//
// "Revenue/profit projection line chart and break-even chart up top, plus
// the standard narrative sections -- for audiences who want to see the
// trajectory before reading the story." (lib/layouts.ts's PLAN_LAYOUTS
// description for this id.)
//
// Swaps the CV app's two derived-signal charts (skill relevance bar chart,
// experience-depth radar) for calc.projection (lib/financial-calculations.ts's
// MonthlyProjection[], already computed month-by-month) rendered as two
// line charts: revenue/profit trajectory, and a break-even view plotting
// revenue against total costs so the crossover point is visible.
//
// NOTE -- one-line fix needed before this compiles: lib/chart-theme.ts's
// getChartPalette() still types its param as `Pick<CvStyleTheme, "id">`,
// importing `CvStyleTheme` from "@/lib/styles". That type no longer exists
// there -- lib/styles.ts now exports `PlanStyleTheme`. chart-theme.ts's
// *values* (CHART_PALETTES, the id-keyed lookup) are fine as-is per the
// transform plan ("generic enough to keep as-is"); only that one import
// needs `CvStyleTheme` -> `PlanStyleTheme`.
//
// Requires: npx shadcn add chart (same as the CV app's graph-stats.tsx)

"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe, TrendingUp, Scale } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"; // npx shadcn add chart
import { Button } from "@/components/ui/button";
import { preparePlanData, pct } from "@/lib/plan-data";
import { formatMoney } from "@/lib/currency";
import { getChartPalette } from "@/lib/chart-theme";
import { ViabilityBadge } from "../viability-badge";
import type { PlanLayoutProps } from "./types";

const NARRATIVE_SECTIONS: {
  title: string;
  key: keyof ReturnType<typeof preparePlanData>["g"];
}[] = [
  { title: "Executive Summary", key: "executiveSummary" },
  { title: "Company Overview", key: "companyOverview" },
  { title: "Products & Services", key: "productsAndServices" },
  { title: "Market Analysis", key: "marketAnalysis" },
  { title: "Marketing & Sales Plan", key: "marketingAndSalesPlan" },
  { title: "Operations Plan", key: "operationsPlan" },
  { title: "Management & Organization", key: "managementAndOrganization" },
  { title: "Funding Request", key: "fundingRequest" },
  { title: "Financial Plan", key: "financialPlanNarrative" },
  { title: "Appendix", key: "appendixNotes" },
];

export function FinancialChartsLayout({
  plan,
  version,
  pdfUrl,
}: PlanLayoutProps) {
  const {
    g,
    calc,
    viability,
    theme,
    businessName,
    tagline,
    address,
    email,
    phone,
    website,
    currency,
  } = preparePlanData(plan, version);
  const money = formatMoney(currency);

  const palette = getChartPalette(theme);

  const chartConfig = {
    revenue: { label: "Revenue", color: palette.primary },
    netProfit: { label: "Net profit", color: palette.secondary },
  } satisfies ChartConfig;

  const breakEvenConfig = {
    revenue: { label: "Revenue", color: palette.primary },
    totalCost: { label: "Total cost", color: palette.secondary },
  } satisfies ChartConfig;

  const projectionData = calc.projection.map((p) => ({
    month: `M${p.month}`,
    revenue: p.revenue,
    netProfit: p.netProfit,
  }));

  const breakEvenData = calc.projection.map((p) => ({
    month: `M${p.month}`,
    revenue: p.revenue,
    totalCost: p.cogs + p.operatingExpenses,
  }));

  const cardClass = `rounded-xl border p-6 ${theme.web.border}`;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
      {/* -------- Header, same pattern as executive-first.tsx -------- */}
      <div className="max-w-2xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={`text-3xl font-semibold ${theme.web.heading}`}
        >
          {businessName}
        </motion.h1>
        {tagline && <p className={theme.web.accentText}>{tagline}</p>}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {email && (
            <a
              href={`mailto:${email}`}
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:opacity-80 ${theme.web.pill}`}
            >
              <Mail className="w-3.5 h-3.5" />
              {email}
            </a>
          )}
          {phone && (
            <span
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border ${theme.web.pill}`}
            >
              <Phone className="w-3.5 h-3.5" />
              {phone}
            </span>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-colors hover:opacity-80 ${theme.web.pill}`}
            >
              <Globe className="w-3.5 h-3.5" />
              {website}
            </a>
          )}
          {address && (
            <span
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border ${theme.web.pill}`}
            >
              <MapPin className="w-3.5 h-3.5" />
              {address}
            </span>
          )}
        </div>
        {viability && (
          <div className="mt-4">
            <ViabilityBadge viability={viability} showDetails={false} />
          </div>
        )}
        <div className="flex justify-center my-6">
          <a href={pdfUrl}>
            <Button className={theme.web.button}>Download PDF</Button>
          </a>
        </div>
      </div>

      {/* -------- Revenue / profit projection -------- */}
      {projectionData.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className={cardClass}
        >
          <h2
            className={`text-lg font-semibold mb-1 flex items-center gap-2 ${theme.web.heading}`}
          >
            <TrendingUp className="w-4 h-4" /> Revenue & profit trajectory
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Month-by-month revenue and net profit over the{" "}
            {calc.projection.length}-month projection.
          </p>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <LineChart data={projectionData} margin={{ left: 8, right: 16 }}>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: palette.text }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: palette.text }}
                tickFormatter={(v) => money(v)}
                width={70}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
                isAnimationActive
                animationDuration={1100}
                animationEasing="ease-out"
              />
              <Line
                type="monotone"
                dataKey="netProfit"
                stroke="var(--color-netProfit)"
                strokeWidth={2}
                dot={false}
                isAnimationActive
                animationDuration={1100}
                animationEasing="ease-out"
              />
            </LineChart>
          </ChartContainer>
        </motion.section>
      )}

      {/* -------- Break-even chart -------- */}
      {breakEvenData.length > 1 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cardClass}
        >
          <h2
            className={`text-lg font-semibold mb-1 flex items-center gap-2 ${theme.web.heading}`}
          >
            <Scale className="w-4 h-4" /> Break-even
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            {calc.breakEvenUnits !== null
              ? `Break-even at ${calc.breakEvenUnits.toLocaleString()} units (${money(calc.breakEvenRevenue)}) -- where the lines below cross.`
              : "Revenue does not cross total cost within this projection at current assumptions."}
          </p>
          <ChartContainer config={breakEvenConfig} className="h-64 w-full">
            <LineChart data={breakEvenData} margin={{ left: 8, right: 16 }}>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: palette.text }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: palette.text }}
                tickFormatter={(v) => money(v)}
                width={70}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
                isAnimationActive
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Line
                type="monotone"
                dataKey="totalCost"
                stroke="var(--color-totalCost)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                isAnimationActive
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </LineChart>
          </ChartContainer>
        </motion.section>
      )}

      {/* -------- KPI grid -------- */}
      <section className={cardClass}>
        <h2 className="text-lg font-semibold mb-4">Financials at a glance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Gross margin", value: pct(calc.grossMarginPercent) },
            { label: "Net margin", value: pct(calc.netMarginPercent) },
            { label: "ROI (Year 1)", value: pct(calc.roiPercentYear1) },
            {
              label: "Payback period",
              value:
                calc.paybackPeriodMonths !== null
                  ? `${calc.paybackPeriodMonths} mo`
                  : "n/a",
            },
          ].map((kpi) => (
            <div key={kpi.label}>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className={`text-lg font-semibold ${theme.web.heading}`}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* -------- Narrative sections -------- */}
      <div className="space-y-6">
        {NARRATIVE_SECTIONS.filter(({ key }) => g[key]).map(
          ({ title, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="space-y-2"
            >
              <h2 className={`text-lg font-semibold ${theme.web.heading}`}>
                {title}
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {g[key]}
              </p>
            </motion.div>
          ),
        )}
      </div>
    </div>
  );
}
