// components/plan-layouts/cover-banner.tsx
//
// TRANSFORMED FROM: components/cv-layouts/split-banner.tsx
//
// "Bold full-width cover page with business name/logo, then a flowing
// single-column body with left-accent section blocks." (lib/layouts.ts's
// PLAN_LAYOUTS description for this id.)

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

export function CoverBannerLayout({ plan, version, pdfUrl }: PlanLayoutProps) {
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
    socialLinks,
  } = preparePlanData(plan, version);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* -------- Full-width banner -------- */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`rounded-2xl px-8 py-10 text-center text-white ${theme.web.button}`}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-white/30 bg-white/10"
          />
        ) : null}
        <h1 className="text-3xl font-bold">{businessName}</h1>
        {tagline && <p className="opacity-90 mt-1">{tagline}</p>}
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm opacity-90">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 hover:opacity-70"
            >
              <Mail className="w-3.5 h-3.5" /> {email}
            </a>
          )}
          {phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> {phone}
            </span>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:opacity-70"
            >
              <Globe className="w-3.5 h-3.5" /> {website}
            </a>
          )}
          {address && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {address}
            </span>
          )}
        </div>
        {viability && (
          <div className="mt-4 inline-block bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium">
            Viability score: {viability.score}/100
          </div>
        )}
        <div className="mt-5">
          <a href={pdfUrl}>
            <Button variant="secondary" size="sm">
              Download PDF
            </Button>
          </a>
        </div>
      </motion.div>

      {/* -------- Flowing single column -------- */}
      <div className="mt-8 space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Monthly revenue",
              value: money(calc.monthlyRevenueAtLaunch),
            },
            { label: "Gross margin", value: pct(calc.grossMarginPercent) },
            {
              label: "Monthly net profit",
              value: money(calc.monthlyNetProfit),
            },
            { label: "Funding gap", value: money(calc.fundingGap) },
          ].map((kpi) => (
            <div key={kpi.label} className="text-center">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className={`text-lg font-semibold ${theme.web.heading}`}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        {viability &&
          (viability.flags.length > 0 || viability.suggestions.length > 0) && (
            <div className="max-w-2xl mx-auto">
              <ViabilityBadge viability={viability} showDetails />
            </div>
          )}

        {NARRATIVE_SECTIONS.filter(({ key }) => g[key]).map(
          ({ title, key }, i) => (
            <motion.section
              key={key}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`border-l-4 pl-4 py-1 ${theme.web.border}`}
            >
              <h2 className={`text-lg font-semibold mb-2 ${theme.web.heading}`}>
                {title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {g[key]}
              </p>
            </motion.section>
          ),
        )}

        {socialLinks.length > 0 && (
          <section className="grid sm:grid-cols-3 gap-6 pt-4 border-t">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Links
              </h3>
              <div className="space-y-1">
                {socialLinks.map((l, i) => (
                  <a
                    key={i}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-sm ${theme.web.link}`}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
