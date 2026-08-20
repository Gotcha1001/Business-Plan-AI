// components/plan-layouts/minimal-clean.tsx
//
// TRANSFORMED FROM: components/cv-layouts/minimal-ats.tsx
//
// "Clean single-column, no decorative cards -- optimized for readability,
// printing, and getting through a skeptical reader's first pass quickly."
// (lib/layouts.ts's PLAN_LAYOUTS description for this id.)
//
// No framer-motion, same as the source -- the point of this layout is a
// plain, fast, printable read, not animation.

"use client";

import { Mail, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { preparePlanData, money, pct } from "@/lib/plan-data";
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

export function MinimalCleanLayout({ plan, version, pdfUrl }: PlanLayoutProps) {
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
    logoUrl,
  } = preparePlanData(plan, version);

  const ruleClass = `border-b pb-1 mb-3 ${theme.web.borderSoft}`;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={businessName}
              className="w-24 h-24 rounded object-contain shrink-0 bg-muted"
            />
          ) : null}
          <div>
            <h1 className="text-2xl font-semibold">{businessName}</h1>
            {tagline && (
              <p className={`mt-1 ${theme.web.accentText}`}>{tagline}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-1 hover:opacity-80"
                >
                  <Mail className="w-3.5 h-3.5" /> {email}
                </a>
              )}
              {phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {phone}
                </span>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:opacity-80"
                >
                  <Globe className="w-3.5 h-3.5" /> {website}
                </a>
              )}
              {address && <span>{address}</span>}
            </p>
          </div>
        </div>
        <a href={pdfUrl}>
          <Button variant="outline" size="sm">
            Download PDF
          </Button>
        </a>
      </div>

      {viability && (
        <p className="text-sm text-muted-foreground mt-5">
          Viability score:{" "}
          <span className="font-medium text-foreground">
            {viability.score}/100
          </span>
        </p>
      )}

      <div className="mt-6">
        <h2
          className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
        >
          Financials
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Monthly revenue</p>
            <p>{money(calc.monthlyRevenueAtLaunch)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Gross margin</p>
            <p>{pct(calc.grossMarginPercent)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Net profit</p>
            <p>{money(calc.monthlyNetProfit)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Funding gap</p>
            <p>{money(calc.fundingGap)}</p>
          </div>
        </div>
      </div>

      {viability && viability.flags.length > 0 && (
        <div className="mt-6">
          <h2
            className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
          >
            Flags
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            {viability.flags.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {NARRATIVE_SECTIONS.filter(({ key }) => g[key]).map(({ title, key }) => (
        <div className="mt-6" key={key}>
          <h2
            className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
          >
            {title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {g[key]}
          </p>
        </div>
      ))}
    </div>
  );
}
