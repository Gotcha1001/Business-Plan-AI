// components/plan-layouts/investor-deck.tsx
//
// Fills the TODO in components/plan-preview.tsx's LAYOUT_COMPONENTS map --
// "investor-deck": InvestorDeckLayout was commented out because this file
// didn't exist yet.
//
// Deliberately not another executive-first.tsx. lib/layouts.ts's blurb for
// this id is "Investor-deck style layout" -- read as: the pitch-deck
// reading pattern, one idea per slide, cover slide up front, the ask
// stated plainly before any narrative. So instead of one continuous page
// (executive-first) or a chart-forward single page (financial-charts),
// this renders a vertical sequence of full-width "slide" cards: cover,
// the ask, traction, then one slide per narrative section. Same data
// source (lib/plan-data.ts's preparePlanData()) and same
// motion/theme conventions as the other two layouts -- only the framing
// changes.

"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { preparePlanData, money, pct } from "@/lib/plan-data";
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

/** Slide chrome shared by every non-cover slide -- numbered kicker + title. */
function SlideHeader({
  index,
  total,
  title,
  accentClass,
}: {
  index: number;
  total: number;
  title: string;
  accentClass: string;
}) {
  return (
    <div className="flex items-baseline gap-3 mb-5">
      <span
        className={`text-xs font-semibold tracking-widest uppercase ${accentClass}`}
      >
        {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}

export function InvestorDeckLayout({ plan, version, pdfUrl }: PlanLayoutProps) {
  const {
    g,
    calc,
    viability,
    theme,
    businessName,
    tagline,
    stage,
    industry,
    email,
    phone,
    website,
    address,
    fundingRequestAmount,
    equityOffered,
  } = preparePlanData(plan, version);

  const narrativeSlides = NARRATIVE_SECTIONS.filter(({ key }) => g[key]);
  // Cover isn't numbered (it's the title slide), so numbering starts at
  // "The Ask" and counts every slide after it.
  const totalNumberedSlides = 2 + narrativeSlides.length;

  const slideClass = `rounded-2xl border p-6 md:p-8 ${theme.web.border}`;

  const kpis: { label: string; value: string }[] = [
    {
      label: "Monthly revenue at launch",
      value: money(calc.monthlyRevenueAtLaunch),
    },
    { label: "Gross margin", value: pct(calc.grossMarginPercent) },
    { label: "Monthly net profit", value: money(calc.monthlyNetProfit) },
    { label: "Net margin", value: pct(calc.netMarginPercent) },
    {
      label: "Break-even",
      value:
        calc.breakEvenUnits !== null
          ? `${calc.breakEvenUnits.toLocaleString()} units`
          : "n/a",
    },
    { label: "ROI (Year 1)", value: pct(calc.roiPercentYear1) },
    {
      label: "Payback period",
      value:
        calc.paybackPeriodMonths !== null
          ? `${calc.paybackPeriodMonths} mo`
          : "n/a",
    },
    { label: "Break-even revenue", value: money(calc.breakEvenRevenue) },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      {/* -------- Cover slide: full-bleed, theme-colored title slide -------- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className={`rounded-2xl px-6 py-16 md:py-20 text-center ${theme.web.button}`}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-4">
          Investor Deck
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-white">
          {businessName}
        </h1>
        {tagline && (
          <p className="text-white/85 mt-3 max-w-xl mx-auto">{tagline}</p>
        )}

        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {stage && (
            <span className="text-xs px-3 py-1 rounded-full capitalize border border-white/40 text-white">
              {stage.replace("_", " ")}
            </span>
          )}
          {industry && (
            <span className="text-xs px-3 py-1 rounded-full border border-white/40 text-white">
              {industry}
            </span>
          )}
        </div>

        {viability && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/40 px-3 py-1.5 text-sm font-medium text-white">
            Viability score: {viability.score}/100
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 mt-6 text-white/85 text-sm">
          {email && (
            <span className="inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {email}
            </span>
          )}
          {phone && (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> {phone}
            </span>
          )}
          {website && (
            <span className="inline-flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> {website}
            </span>
          )}
          {address && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {address}
            </span>
          )}
        </div>

        <div className="mt-8">
          <a href={pdfUrl}>
            <Button variant="secondary">Download PDF</Button>
          </a>
        </div>
      </motion.div>

      {/* -------- Slide: The Ask -------- */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className={slideClass}
      >
        <SlideHeader
          index={1}
          total={totalNumberedSlides}
          title="The Ask"
          accentClass={theme.web.accentText}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Funding requested
            </p>
            <p className={`text-2xl font-semibold mt-1 ${theme.web.heading}`}>
              {fundingRequestAmount !== undefined
                ? money(fundingRequestAmount)
                : "n/a"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Equity offered
            </p>
            <p className={`text-2xl font-semibold mt-1 ${theme.web.heading}`}>
              {equityOffered || "n/a"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Funding gap
            </p>
            <p className={`text-2xl font-semibold mt-1 ${theme.web.heading}`}>
              {money(calc.fundingGap)}
            </p>
          </div>
        </div>
        {g.fundingRequest && (
          <p className="text-sm leading-relaxed whitespace-pre-line mt-6 pt-6 border-t border-muted">
            {g.fundingRequest}
          </p>
        )}
      </motion.section>

      {/* -------- Slide: Traction & Financials -------- */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className={slideClass}
      >
        <SlideHeader
          index={2}
          total={totalNumberedSlides}
          title="Traction & Financials"
          accentClass={theme.web.accentText}
        />
        {viability && (
          <div className="mb-5">
            <ViabilityBadge viability={viability} />
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className={`text-lg font-semibold ${theme.web.heading}`}>
                {kpi.value}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* -------- Slides: one per narrative section -------- */}
      {narrativeSlides.map(({ title, key }, i) => (
        <motion.section
          key={key}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className={slideClass}
        >
          <SlideHeader
            index={i + 3}
            total={totalNumberedSlides}
            title={title}
            accentClass={theme.web.accentText}
          />
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {g[key]}
          </p>
        </motion.section>
      ))}
    </div>
  );
}
