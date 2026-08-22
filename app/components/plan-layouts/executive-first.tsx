// // components/plan-layouts/executive-first.tsx
// //
// // TRANSFORMED FROM: components/cv-layouts/centered.tsx
// //
// // "Leads with the executive summary and viability score, then flows into
// // the remaining sections. Friendly and modern -- good default for most
// // audiences." (lib/layouts.ts's PLAN_LAYOUTS description for this id.)

// "use client";

// import { motion } from "framer-motion";
// import { Mail, Phone, MapPin, Globe } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { preparePlanData, money, pct } from "@/lib/plan-data";
// import { ViabilityBadge } from "../viability-badge";
// import type { PlanLayoutProps } from "./types";

// /** Soft theme-coloured hover fill -- pure Tailwind, no extra files needed */
// const CARD_HOVER: Record<string, string> = {
//   neutral: "hover:bg-slate-500/10 dark:hover:bg-slate-400/15",
//   "amber-classic": "hover:bg-amber-500/10 dark:hover:bg-amber-500/15",
//   "ocean-blue": "hover:bg-blue-500/10 dark:hover:bg-blue-500/15",
//   "blue-gradient": "hover:bg-blue-500/10 dark:hover:bg-blue-500/15",
//   emerald: "hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15",
//   "royal-violet": "hover:bg-violet-500/10 dark:hover:bg-violet-500/15",
//   crimson: "hover:bg-rose-500/10 dark:hover:bg-rose-500/15",
//   lava: "hover:bg-orange-500/10 dark:hover:bg-orange-500/15",
//   "midnight-gradient": "hover:bg-indigo-500/10 dark:hover:bg-indigo-500/15",
//   "teal-breeze": "hover:bg-teal-500/10 dark:hover:bg-teal-500/15",
// };

// /** Narrative sections rendered in plan order, title + which g-field feeds it. */
// const NARRATIVE_SECTIONS: {
//   title: string;
//   key: keyof ReturnType<typeof preparePlanData>["g"];
// }[] = [
//   { title: "Executive Summary", key: "executiveSummary" },
//   { title: "Company Overview", key: "companyOverview" },
//   { title: "Products & Services", key: "productsAndServices" },
//   { title: "Market Analysis", key: "marketAnalysis" },
//   { title: "Marketing & Sales Plan", key: "marketingAndSalesPlan" },
//   { title: "Operations Plan", key: "operationsPlan" },
//   { title: "Management & Organization", key: "managementAndOrganization" },
//   { title: "Funding Request", key: "fundingRequest" },
//   { title: "Financial Plan", key: "financialPlanNarrative" },
//   { title: "Appendix", key: "appendixNotes" },
// ];

// export function ExecutiveFirstLayout({
//   plan,
//   version,
//   pdfUrl,
// }: PlanLayoutProps) {
//   const {
//     g,
//     calc,
//     viability,
//     theme,
//     businessName,
//     tagline,
//     stage,
//     industry,
//     email,
//     phone,
//     website,
//     address,
//     logoUrl,
//   } = preparePlanData(plan, version);

//   const cardHover = CARD_HOVER[theme.id] ?? CARD_HOVER.neutral;
//   const cardClass = `rounded-xl border p-4 transition-colors duration-200 ${theme.web.border} ${cardHover}`;
//   const titleCardClass = `rounded-xl px-4 py-2.5 font-medium text-lg ${theme.web.button}`;

//   const kpis: { label: string; value: string }[] = [
//     {
//       label: "Monthly revenue at launch",
//       value: money(calc.monthlyRevenueAtLaunch),
//     },
//     { label: "Gross margin", value: pct(calc.grossMarginPercent) },
//     { label: "Monthly net profit", value: money(calc.monthlyNetProfit) },
//     { label: "Net margin", value: pct(calc.netMarginPercent) },
//     {
//       label: "Break-even",
//       value:
//         calc.breakEvenUnits !== null
//           ? `${calc.breakEvenUnits.toLocaleString()} units`
//           : "n/a",
//     },
//     { label: "ROI (Year 1)", value: pct(calc.roiPercentYear1) },
//     {
//       label: "Payback period",
//       value:
//         calc.paybackPeriodMonths !== null
//           ? `${calc.paybackPeriodMonths} mo`
//           : "n/a",
//     },
//     { label: "Funding gap", value: money(calc.fundingGap) },
//   ];

//   return (
//     <div className="max-w-5xl mx-auto py-10 px-4">
//       {logoUrl && (
//         <motion.div
//           initial={{ opacity: 0, y: 8 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="flex justify-center mb-4"
//         >
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img
//             src={logoUrl}
//             alt={`${businessName} logo`}
//             className="h-48 w-48 object-contain rounded-xl"
//           />
//         </motion.div>
//       )}
//       {/* -------- Header band -------- */}
//       <div className="max-w-2xl mx-auto text-center">
//         <motion.h1
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           className={`text-3xl font-semibold ${theme.web.heading}`}
//         >
//           {businessName}
//         </motion.h1>

//         {tagline && <p className={theme.web.accentText}>{tagline}</p>}

//         <div className="flex flex-wrap justify-center gap-2 mt-3">
//           {stage && (
//             <span
//               className={`text-xs px-3 py-1 rounded-full capitalize ${theme.web.pill}`}
//             >
//               {stage.replace("_", " ")}
//             </span>
//           )}
//           {industry && (
//             <span
//               className={`text-xs px-3 py-1 rounded-full ${theme.web.pill}`}
//             >
//               {industry}
//             </span>
//           )}
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 6 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.15 }}
//           className="flex flex-wrap justify-center gap-2 mt-5"
//         >
//           {email && (
//             <a
//               href={`mailto:${email}`}
//               className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:opacity-80 ${theme.web.pill}`}
//             >
//               <Mail className="w-3.5 h-3.5" />
//               {email}
//             </a>
//           )}
//           {phone && (
//             <span
//               className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${theme.web.pill}`}
//             >
//               <Phone className="w-3.5 h-3.5" />
//               {phone}
//             </span>
//           )}
//           {website && (
//             <a
//               href={website}
//               target="_blank"
//               rel="noopener noreferrer"
//               className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:opacity-80 ${theme.web.pill}`}
//             >
//               <Globe className="w-3.5 h-3.5" />
//               {website}
//             </a>
//           )}
//           {address && (
//             <span
//               className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${theme.web.pill}`}
//             >
//               <MapPin className="w-3.5 h-3.5" />
//               {address}
//             </span>
//           )}
//         </motion.div>

//         <div className="mt-6">
//           <ViabilityBadge viability={viability} showDetails={false} />
//         </div>

//         <div className="flex justify-center my-6">
//           <a href={pdfUrl}>
//             <Button className={theme.web.button}>Download PDF</Button>
//           </a>
//         </div>
//       </div>

//       {/* -------- Financial KPI grid -------- */}
//       <section className={`${cardClass} mt-4`}>
//         <h2 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
//           Financials at a glance
//         </h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {kpis.map((kpi, i) => (
//             <motion.div
//               key={kpi.label}
//               initial={{ opacity: 0, y: 6 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.4, delay: i * 0.05 }}
//             >
//               <p className="text-xs text-muted-foreground">{kpi.label}</p>
//               <p className={`text-lg font-semibold ${theme.web.heading}`}>
//                 {kpi.value}
//               </p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* -------- Viability detail (flags/suggestions) -------- */}
//       {viability &&
//         (viability.flags.length > 0 || viability.suggestions.length > 0) && (
//           <section className={`${cardClass} mt-4`}>
//             <h2 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
//               Viability notes
//             </h2>
//             <ViabilityBadge viability={viability} />
//           </section>
//         )}

//       {/* -------- Narrative sections -------- */}
//       <div className="mt-6 space-y-6">
//         {NARRATIVE_SECTIONS.filter(({ key }) => g[key]).map(
//           ({ title, key }, i) => (
//             <motion.div
//               key={key}
//               initial={{ opacity: 0, y: 8 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: i * 0.04 }}
//               className="space-y-3"
//             >
//               <div className={titleCardClass}>{title}</div>
//               <p className="text-sm leading-relaxed whitespace-pre-line">
//                 {g[key]}
//               </p>
//             </motion.div>
//           ),
//         )}
//       </div>
//     </div>
//   );
// }

// components/plan-layouts/executive-first.tsx
//
// TRANSFORMED FROM: components/cv-layouts/centered.tsx
//
// "Leads with the executive summary and viability score, then flows into
// the remaining sections. Friendly and modern -- good default for most
// audiences." (lib/layouts.ts's PLAN_LAYOUTS description for this id.)

"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { preparePlanData, pct } from "@/lib/plan-data";
import { formatMoney } from "@/lib/currency";
import { ViabilityBadge } from "../viability-badge";
import type { PlanLayoutProps } from "./types";

/** Soft theme-coloured hover fill -- pure Tailwind, no extra files needed */
const CARD_HOVER: Record<string, string> = {
  neutral: "hover:bg-slate-500/10 dark:hover:bg-slate-400/15",
  "amber-classic": "hover:bg-amber-500/10 dark:hover:bg-amber-500/15",
  "ocean-blue": "hover:bg-blue-500/10 dark:hover:bg-blue-500/15",
  "blue-gradient": "hover:bg-blue-500/10 dark:hover:bg-blue-500/15",
  emerald: "hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15",
  "royal-violet": "hover:bg-violet-500/10 dark:hover:bg-violet-500/15",
  crimson: "hover:bg-rose-500/10 dark:hover:bg-rose-500/15",
  lava: "hover:bg-orange-500/10 dark:hover:bg-orange-500/15",
  "midnight-gradient": "hover:bg-indigo-500/10 dark:hover:bg-indigo-500/15",
  "teal-breeze": "hover:bg-teal-500/10 dark:hover:bg-teal-500/15",
};

/** Narrative sections rendered in plan order, title + which g-field feeds it. */
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

export function ExecutiveFirstLayout({
  plan,
  version,
  pdfUrl,
}: PlanLayoutProps) {
  const {
    g,
    calc,
    viability,
    theme,
    currency,
    businessName,
    tagline,
    stage,
    industry,
    email,
    phone,
    website,
    address,
    logoUrl,
  } = preparePlanData(plan, version);
  const money = formatMoney(currency);

  const cardHover = CARD_HOVER[theme.id] ?? CARD_HOVER.neutral;
  const cardClass = `rounded-xl border p-4 transition-colors duration-200 ${theme.web.border} ${cardHover}`;
  const titleCardClass = `rounded-xl px-4 py-2.5 font-medium text-lg ${theme.web.button}`;

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
    { label: "Funding gap", value: money(calc.fundingGap) },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {logoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt={`${businessName} logo`}
            className="h-48 w-48 object-contain rounded-xl"
          />
        </motion.div>
      )}
      {/* -------- Header band -------- */}
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

        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {stage && (
            <span
              className={`text-xs px-3 py-1 rounded-full capitalize ${theme.web.pill}`}
            >
              {stage.replace("_", " ")}
            </span>
          )}
          {industry && (
            <span
              className={`text-xs px-3 py-1 rounded-full ${theme.web.pill}`}
            >
              {industry}
            </span>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mt-5"
        >
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
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${theme.web.pill}`}
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
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:opacity-80 ${theme.web.pill}`}
            >
              <Globe className="w-3.5 h-3.5" />
              {website}
            </a>
          )}
          {address && (
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${theme.web.pill}`}
            >
              <MapPin className="w-3.5 h-3.5" />
              {address}
            </span>
          )}
        </motion.div>

        <div className="mt-6">
          <ViabilityBadge viability={viability} showDetails={false} />
        </div>

        <div className="flex justify-center my-6">
          <a href={pdfUrl}>
            <Button className={theme.web.button}>Download PDF</Button>
          </a>
        </div>
      </div>

      {/* -------- Financial KPI grid -------- */}
      <section className={`${cardClass} mt-4`}>
        <h2 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
          Financials at a glance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      </section>

      {/* -------- Viability detail (flags/suggestions) -------- */}
      {viability &&
        (viability.flags.length > 0 || viability.suggestions.length > 0) && (
          <section className={`${cardClass} mt-4`}>
            <h2 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
              Viability notes
            </h2>
            <ViabilityBadge viability={viability} />
          </section>
        )}

      {/* -------- Narrative sections -------- */}
      <div className="mt-6 space-y-6">
        {NARRATIVE_SECTIONS.filter(({ key }) => g[key]).map(
          ({ title, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="space-y-3"
            >
              <div className={titleCardClass}>{title}</div>
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
