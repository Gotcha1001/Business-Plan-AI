// "use client";

// import { Suspense, useEffect, useState } from "react";
// import {
//   useForm,
//   useFieldArray,
//   type Control,
//   type UseFormRegister,
// } from "react-hook-form";
// import { useMutation, useAction, useQuery } from "convex/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { api } from "@/convex/_generated/api";
// import type { Id } from "@/convex/_generated/dataModel";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { MediaUpload } from "@/app/components/media-upload";
// import { toast } from "sonner";
// import { Plus, Trash2, Loader2 } from "lucide-react";

// // -----------------------------------------------------------------------
// // Shared layout classes — same look as the CV app's section cards.
// // -----------------------------------------------------------------------
// const SECTION_CLASS =
//   "space-y-3 rounded-2xl border border-zinc-900/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5";
// const ROW_CLASS =
//   "grid gap-3 rounded-xl border border-zinc-900/10 dark:border-white/10 p-4 relative";

// // -----------------------------------------------------------------------
// // Form shape. Numbers are kept as `string` here (raw input value) and
// // parsed on submit — avoids NaN/controlled-input churn on every keystroke.
// // -----------------------------------------------------------------------
// type Row = Record<string, string | boolean>;

// type FormValues = {
//   title: string;

//   identity: {
//     businessName: string;
//     tradingName: string;
//     legalStructure: string; // "" | union values
//     registrationDate: string;
//     registrationNumber: string;
//     physicalAddress: string;
//     mailingAddress: string;
//     website: string;
//     phone: string;
//     email: string;
//     socialLinks: Row[]; // { label, url }
//     logoUrl: string;
//     foundingYear: string;
//     stage: string;
//     industry: string;
//     industryCode: string;
//     missionStatement: string;
//     visionStatement: string;
//     coreValues: string; // newline-separated
//     problemStatement: string;
//     uniqueValueProposition: string;
//     shortTermGoals: string;
//     mediumTermGoals: string;
//     longTermGoals: string;
//     exitStrategy: string;
//   };

//   team: {
//     owners: Row[]; // name, ownershipPercent, role, bio
//     managementTeam: Row[]; // name, title, responsibilities, experience
//     orgStructureDescription: string;
//     plannedHires: Row[]; // role, count, timeline, annualSalary
//     advisors: Row[]; // name, role
//     keyPartnerships: Row[]; // name, description
//     licensesAndPermits: string;
//     intellectualProperty: Row[]; // type, description
//   };

//   offerings: {
//     products: Row[]; // name, description, features, price, pricingNotes, developmentStage
//     productionProcess: string;
//     inventoryRequirements: string;
//     qualityControl: string;
//     roadmap: string;
//   };

//   market: {
//     targetDemographics: string;
//     targetGeography: string;
//     customerNeeds: string;
//     tam: string;
//     sam: string;
//     som: string;
//     marketSizeSource: string;
//     marketTrends: string;
//     competitors: Row[]; // name, strengths, weaknesses, marketSharePercent, pricing, differentiation
//     swotStrengths: string;
//     swotWeaknesses: string;
//     swotOpportunities: string;
//     swotThreats: string;
//     barriersToEntry: string;
//     regulatoryNotes: string;
//     seasonalFactors: string;
//   };

//   marketingSales: {
//     channels: string;
//     salesStrategy: string;
//     cac: string;
//     ltv: string;
//     branding: string;
//     salesTargets: string;
//     distributionChannels: string;
//     retentionPlans: string;
//     marketingBudgetAllocation: Row[]; // channel, percentOfBudget
//   };

//   operations: {
//     locations: string;
//     facilitiesNotes: string;
//     equipment: Row[]; // item, cost, ownedOrLeased
//     suppliers: string;
//     productionCapacityNotes: string;
//     logisticsNotes: string;
//     techStack: string;
//     hoursOfOperation: string;
//     scalabilityPlans: string;
//     operationalRisks: Row[]; // risk, mitigation
//   };

//   funding: {
//     fundingSources: Row[]; // source, amount, terms
//     fundingRequestAmount: string;
//     equityOffered: string;
//     debtTerms: string;
//     collateral: string;
//     startupCosts: Row[]; // category, amount
//   };

//   financials: {
//     monthlySalesVolume: string;
//     avgSellingPrice: string;
//     revenueStreams: Row[]; // name, percentOfRevenue
//     monthlyGrowthRatePercent: string;
//     seasonalityNotes: string;
//     churnRatePercent: string;
//     materialCostPerUnit: string;
//     directLaborPerUnit: string;
//     shippingCostPerUnit: string;
//     otherVariableCostPerUnit: string;
//     operatingExpenses: Row[]; // category, monthlyAmount, isFixed(bool)
//     openingCashBalance: string;
//     loans: Row[]; // principal, annualInterestRatePercent, termMonths
//     taxRatePercent: string;
//     inflationRatePercent: string;
//     projectionHorizonMonths: string;
//     scenario: string; // "" | base | optimistic | pessimistic
//   };

//   kpis: {
//     grossMarginTargetPercent: string;
//     netMarginTargetPercent: string;
//     roiTargetPercent: string;
//     paybackPeriodTargetMonths: string;
//     assumptions: string;
//     riskFactors: Row[]; // risk, mitigation
//   };

//   appendix: {
//     historicalFinancialsNotes: string;
//     marketResearchSources: string;
//     attachments: Row[]; // label, url
//     milestones: Row[]; // title, date, owner
//     freeNotes: string;
//   };
// };

// const EMPTY_DEFAULTS: FormValues = {
//   title: "",
//   identity: {
//     businessName: "",
//     tradingName: "",
//     legalStructure: "",
//     registrationDate: "",
//     registrationNumber: "",
//     physicalAddress: "",
//     mailingAddress: "",
//     website: "",
//     phone: "",
//     email: "",
//     socialLinks: [],
//     logoUrl: "",
//     foundingYear: "",
//     stage: "",
//     industry: "",
//     industryCode: "",
//     missionStatement: "",
//     visionStatement: "",
//     coreValues: "",
//     problemStatement: "",
//     uniqueValueProposition: "",
//     shortTermGoals: "",
//     mediumTermGoals: "",
//     longTermGoals: "",
//     exitStrategy: "",
//   },
//   team: {
//     owners: [],
//     managementTeam: [],
//     orgStructureDescription: "",
//     plannedHires: [],
//     advisors: [],
//     keyPartnerships: [],
//     licensesAndPermits: "",
//     intellectualProperty: [],
//   },
//   offerings: {
//     products: [],
//     productionProcess: "",
//     inventoryRequirements: "",
//     qualityControl: "",
//     roadmap: "",
//   },
//   market: {
//     targetDemographics: "",
//     targetGeography: "",
//     customerNeeds: "",
//     tam: "",
//     sam: "",
//     som: "",
//     marketSizeSource: "",
//     marketTrends: "",
//     competitors: [],
//     swotStrengths: "",
//     swotWeaknesses: "",
//     swotOpportunities: "",
//     swotThreats: "",
//     barriersToEntry: "",
//     regulatoryNotes: "",
//     seasonalFactors: "",
//   },
//   marketingSales: {
//     channels: "",
//     salesStrategy: "",
//     cac: "",
//     ltv: "",
//     branding: "",
//     salesTargets: "",
//     distributionChannels: "",
//     retentionPlans: "",
//     marketingBudgetAllocation: [],
//   },
//   operations: {
//     locations: "",
//     facilitiesNotes: "",
//     equipment: [],
//     suppliers: "",
//     productionCapacityNotes: "",
//     logisticsNotes: "",
//     techStack: "",
//     hoursOfOperation: "",
//     scalabilityPlans: "",
//     operationalRisks: [],
//   },
//   funding: {
//     fundingSources: [],
//     fundingRequestAmount: "",
//     equityOffered: "",
//     debtTerms: "",
//     collateral: "",
//     startupCosts: [],
//   },
//   financials: {
//     monthlySalesVolume: "",
//     avgSellingPrice: "",
//     revenueStreams: [],
//     monthlyGrowthRatePercent: "",
//     seasonalityNotes: "",
//     churnRatePercent: "",
//     materialCostPerUnit: "",
//     directLaborPerUnit: "",
//     shippingCostPerUnit: "",
//     otherVariableCostPerUnit: "",
//     operatingExpenses: [],
//     openingCashBalance: "",
//     loans: [],
//     taxRatePercent: "",
//     inflationRatePercent: "12",
//     projectionHorizonMonths: "12",
//     scenario: "base",
//   },
//   kpis: {
//     grossMarginTargetPercent: "",
//     netMarginTargetPercent: "",
//     roiTargetPercent: "",
//     paybackPeriodTargetMonths: "",
//     assumptions: "",
//     riskFactors: [],
//   },
//   appendix: {
//     historicalFinancialsNotes: "",
//     marketResearchSources: "",
//     attachments: [],
//     milestones: [],
//     freeNotes: "",
//   },
// };

// // -----------------------------------------------------------------------
// // Generic repeating-row config. One config replaces ~15 lines of
// // hand-written JSX per array field in the old CV form.
// // -----------------------------------------------------------------------
// type FieldType = "text" | "number" | "textarea" | "checkbox";
// type RowFieldConfig = {
//   name: string;
//   label: string;
//   type: FieldType;
//   placeholder?: string;
// };

// function RepeatingSection({
//   control,
//   register,
//   name,
//   title,
//   fields,
//   addLabel = "Add row",
// }: {
//   control: Control<FormValues>;
//   register: UseFormRegister<FormValues>;
//   name: string; // dot-path into FormValues, e.g. "team.owners"
//   title: string;
//   fields: RowFieldConfig[];
//   addLabel?: string;
// }) {
//   // useFieldArray's generic typing gets awkward with a fully dynamic
//   // dot-path across a large union type — cast at the boundary rather
//   // than duplicating this component 20 times with exact types.
//   const {
//     fields: rows,
//     append,
//     remove,
//   } = useFieldArray({
//     control,
//     name: name as any,
//   });
//   const emptyRow = () =>
//     Object.fromEntries(
//       fields.map((f) => [f.name, f.type === "checkbox" ? false : ""]),
//     );

//   return (
//     <div className="space-y-3">
//       <div className="flex items-center justify-between">
//         <Label className="text-sm font-medium">{title}</Label>
//         <Button
//           type="button"
//           variant="outline"
//           size="sm"
//           onClick={() => append(emptyRow())}
//         >
//           <Plus className="mr-1 h-3.5 w-3.5" />
//           {addLabel}
//         </Button>
//       </div>
//       {rows.length === 0 && (
//         <p className="text-sm text-zinc-500">
//           Nothing added yet — click &quot;{addLabel}&quot; to start.
//         </p>
//       )}
//       {rows.map((row, index) => (
//         <div key={row.id} className={ROW_CLASS}>
//           <button
//             type="button"
//             onClick={() => remove(index)}
//             className="absolute right-3 top-3 text-zinc-400 hover:text-red-500"
//             aria-label="Remove row"
//           >
//             <Trash2 className="h-4 w-4" />
//           </button>
//           <div className="grid gap-3 pr-8 sm:grid-cols-2">
//             {fields.map((f) => {
//               const path = `${name}.${index}.${f.name}` as any;
//               if (f.type === "checkbox") {
//                 return (
//                   <label
//                     key={f.name}
//                     className="flex items-center gap-2 text-sm"
//                   >
//                     <Checkbox {...register(path)} />
//                     {f.label}
//                   </label>
//                 );
//               }
//               if (f.type === "textarea") {
//                 return (
//                   <div key={f.name} className="sm:col-span-2 space-y-1">
//                     <Label className="text-xs text-zinc-500">{f.label}</Label>
//                     <Textarea
//                       {...register(path)}
//                       placeholder={f.placeholder}
//                       rows={2}
//                     />
//                   </div>
//                 );
//               }
//               return (
//                 <div key={f.name} className="space-y-1">
//                   <Label className="text-xs text-zinc-500">{f.label}</Label>
//                   <Input
//                     type={f.type === "number" ? "number" : "text"}
//                     step={f.type === "number" ? "any" : undefined}
//                     {...register(path)}
//                     placeholder={f.placeholder}
//                   />
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // Plain string[] fields stored as newline-separated text in the form,
// // split/joined at the load/submit boundary.
// function StringListField({
//   register,
//   name,
//   label,
//   placeholder,
// }: {
//   register: UseFormRegister<FormValues>;
//   name: any;
//   label: string;
//   placeholder?: string;
// }) {
//   return (
//     <div className="space-y-1">
//       <Label className="text-xs text-zinc-500">{label} (one per line)</Label>
//       <Textarea {...register(name)} placeholder={placeholder} rows={3} />
//     </div>
//   );
// }

// // -----------------------------------------------------------------------
// // Convert loaded plan doc -> form values (strings for all numbers,
// // newline-joined for string arrays, safe fallbacks for every field).
// // -----------------------------------------------------------------------
// function planToFormValues(plan: any): FormValues {
//   const n = (v: number | undefined) =>
//     v === undefined || v === null ? "" : String(v);
//   const lines = (arr: string[] | undefined) => (arr ?? []).join("\n");
//   const rows = (arr: any[] | undefined, mapRow: (r: any) => Row) =>
//     (arr ?? []).map(mapRow);

//   return {
//     title: plan.title ?? "",
//     identity: {
//       businessName: plan.identity?.businessName ?? "",
//       tradingName: plan.identity?.tradingName ?? "",
//       legalStructure: plan.identity?.legalStructure ?? "",
//       registrationDate: plan.identity?.registrationDate ?? "",
//       registrationNumber: plan.identity?.registrationNumber ?? "",
//       physicalAddress: plan.identity?.physicalAddress ?? "",
//       mailingAddress: plan.identity?.mailingAddress ?? "",
//       website: plan.identity?.website ?? "",
//       phone: plan.identity?.phone ?? "",
//       email: plan.identity?.email ?? "",
//       socialLinks: rows(plan.identity?.socialLinks, (s) => ({
//         label: s.label ?? "",
//         url: s.url ?? "",
//       })),
//       logoUrl: plan.identity?.logoUrl ?? "",
//       foundingYear: n(plan.identity?.foundingYear),
//       stage: plan.identity?.stage ?? "",
//       industry: plan.identity?.industry ?? "",
//       industryCode: plan.identity?.industryCode ?? "",
//       missionStatement: plan.identity?.missionStatement ?? "",
//       visionStatement: plan.identity?.visionStatement ?? "",
//       coreValues: lines(plan.identity?.coreValues),
//       problemStatement: plan.identity?.problemStatement ?? "",
//       uniqueValueProposition: plan.identity?.uniqueValueProposition ?? "",
//       shortTermGoals: lines(plan.identity?.shortTermGoals),
//       mediumTermGoals: lines(plan.identity?.mediumTermGoals),
//       longTermGoals: lines(plan.identity?.longTermGoals),
//       exitStrategy: plan.identity?.exitStrategy ?? "",
//     },
//     team: {
//       owners: rows(plan.team?.owners, (o) => ({
//         name: o.name ?? "",
//         ownershipPercent: n(o.ownershipPercent),
//         role: o.role ?? "",
//         bio: o.bio ?? "",
//       })),
//       managementTeam: rows(plan.team?.managementTeam, (m) => ({
//         name: m.name ?? "",
//         title: m.title ?? "",
//         responsibilities: m.responsibilities ?? "",
//         experience: m.experience ?? "",
//       })),
//       orgStructureDescription: plan.team?.orgStructureDescription ?? "",
//       plannedHires: rows(plan.team?.plannedHires, (h) => ({
//         role: h.role ?? "",
//         count: n(h.count),
//         timeline: h.timeline ?? "",
//         annualSalary: n(h.annualSalary),
//       })),
//       advisors: rows(plan.team?.advisors, (a) => ({
//         name: a.name ?? "",
//         role: a.role ?? "",
//       })),
//       keyPartnerships: rows(plan.team?.keyPartnerships, (p) => ({
//         name: p.name ?? "",
//         description: p.description ?? "",
//       })),
//       licensesAndPermits: lines(plan.team?.licensesAndPermits),
//       intellectualProperty: rows(plan.team?.intellectualProperty, (ip) => ({
//         type: ip.type ?? "",
//         description: ip.description ?? "",
//       })),
//     },
//     offerings: {
//       products: rows(plan.offerings?.products, (p) => ({
//         name: p.name ?? "",
//         description: p.description ?? "",
//         features: p.features ?? "",
//         price: n(p.price),
//         pricingNotes: p.pricingNotes ?? "",
//         developmentStage: p.developmentStage ?? "",
//       })),
//       productionProcess: plan.offerings?.productionProcess ?? "",
//       inventoryRequirements: plan.offerings?.inventoryRequirements ?? "",
//       qualityControl: plan.offerings?.qualityControl ?? "",
//       roadmap: lines(plan.offerings?.roadmap),
//     },
//     market: {
//       targetDemographics: plan.market?.targetDemographics ?? "",
//       targetGeography: plan.market?.targetGeography ?? "",
//       customerNeeds: plan.market?.customerNeeds ?? "",
//       tam: n(plan.market?.tam),
//       sam: n(plan.market?.sam),
//       som: n(plan.market?.som),
//       marketSizeSource: plan.market?.marketSizeSource ?? "",
//       marketTrends: plan.market?.marketTrends ?? "",
//       competitors: rows(plan.market?.competitors, (c) => ({
//         name: c.name ?? "",
//         strengths: c.strengths ?? "",
//         weaknesses: c.weaknesses ?? "",
//         marketSharePercent: n(c.marketSharePercent),
//         pricing: c.pricing ?? "",
//         differentiation: c.differentiation ?? "",
//       })),
//       swotStrengths: lines(plan.market?.swotStrengths),
//       swotWeaknesses: lines(plan.market?.swotWeaknesses),
//       swotOpportunities: lines(plan.market?.swotOpportunities),
//       swotThreats: lines(plan.market?.swotThreats),
//       barriersToEntry: plan.market?.barriersToEntry ?? "",
//       regulatoryNotes: plan.market?.regulatoryNotes ?? "",
//       seasonalFactors: plan.market?.seasonalFactors ?? "",
//     },
//     marketingSales: {
//       channels: lines(plan.marketingSales?.channels),
//       salesStrategy: plan.marketingSales?.salesStrategy ?? "",
//       cac: n(plan.marketingSales?.cac),
//       ltv: n(plan.marketingSales?.ltv),
//       branding: plan.marketingSales?.branding ?? "",
//       salesTargets: plan.marketingSales?.salesTargets ?? "",
//       distributionChannels: lines(plan.marketingSales?.distributionChannels),
//       retentionPlans: plan.marketingSales?.retentionPlans ?? "",
//       marketingBudgetAllocation: rows(
//         plan.marketingSales?.marketingBudgetAllocation,
//         (b) => ({
//           channel: b.channel ?? "",
//           percentOfBudget: n(b.percentOfBudget),
//         }),
//       ),
//     },
//     operations: {
//       locations: lines(plan.operations?.locations),
//       facilitiesNotes: plan.operations?.facilitiesNotes ?? "",
//       equipment: rows(plan.operations?.equipment, (e) => ({
//         item: e.item ?? "",
//         cost: n(e.cost),
//         ownedOrLeased: e.ownedOrLeased ?? "",
//       })),
//       suppliers: lines(plan.operations?.suppliers),
//       productionCapacityNotes: plan.operations?.productionCapacityNotes ?? "",
//       logisticsNotes: plan.operations?.logisticsNotes ?? "",
//       techStack: lines(plan.operations?.techStack),
//       hoursOfOperation: plan.operations?.hoursOfOperation ?? "",
//       scalabilityPlans: plan.operations?.scalabilityPlans ?? "",
//       operationalRisks: rows(plan.operations?.operationalRisks, (r) => ({
//         risk: r.risk ?? "",
//         mitigation: r.mitigation ?? "",
//       })),
//     },
//     funding: {
//       fundingSources: rows(plan.funding?.fundingSources, (s) => ({
//         source: s.source ?? "",
//         amount: n(s.amount),
//         terms: s.terms ?? "",
//       })),
//       fundingRequestAmount: n(plan.funding?.fundingRequestAmount),
//       equityOffered: plan.funding?.equityOffered ?? "",
//       debtTerms: plan.funding?.debtTerms ?? "",
//       collateral: plan.funding?.collateral ?? "",
//       startupCosts: rows(plan.funding?.startupCosts, (c) => ({
//         category: c.category ?? "",
//         amount: n(c.amount),
//       })),
//     },
//     financials: {
//       monthlySalesVolume: n(plan.financials?.monthlySalesVolume),
//       avgSellingPrice: n(plan.financials?.avgSellingPrice),
//       revenueStreams: rows(plan.financials?.revenueStreams, (r) => ({
//         name: r.name ?? "",
//         percentOfRevenue: n(r.percentOfRevenue),
//       })),
//       monthlyGrowthRatePercent: n(plan.financials?.monthlyGrowthRatePercent),
//       seasonalityNotes: plan.financials?.seasonalityNotes ?? "",
//       churnRatePercent: n(plan.financials?.churnRatePercent),
//       materialCostPerUnit: n(plan.financials?.materialCostPerUnit),
//       directLaborPerUnit: n(plan.financials?.directLaborPerUnit),
//       shippingCostPerUnit: n(plan.financials?.shippingCostPerUnit),
//       otherVariableCostPerUnit: n(plan.financials?.otherVariableCostPerUnit),
//       operatingExpenses: rows(plan.financials?.operatingExpenses, (e) => ({
//         category: e.category ?? "",
//         monthlyAmount: n(e.monthlyAmount),
//         isFixed: !!e.isFixed,
//       })),
//       openingCashBalance: n(plan.financials?.openingCashBalance),
//       loans: rows(plan.financials?.loans, (l) => ({
//         principal: n(l.principal),
//         annualInterestRatePercent: n(l.annualInterestRatePercent),
//         termMonths: n(l.termMonths),
//       })),
//       taxRatePercent: n(plan.financials?.taxRatePercent),
//       inflationRatePercent: n(plan.financials?.inflationRatePercent) || "12",
//       projectionHorizonMonths:
//         n(plan.financials?.projectionHorizonMonths) || "12",
//       scenario: plan.financials?.scenario ?? "base",
//     },
//     kpis: {
//       grossMarginTargetPercent: n(plan.kpis?.grossMarginTargetPercent),
//       netMarginTargetPercent: n(plan.kpis?.netMarginTargetPercent),
//       roiTargetPercent: n(plan.kpis?.roiTargetPercent),
//       paybackPeriodTargetMonths: n(plan.kpis?.paybackPeriodTargetMonths),
//       assumptions: lines(plan.kpis?.assumptions),
//       riskFactors: rows(plan.kpis?.riskFactors, (r) => ({
//         risk: r.risk ?? "",
//         mitigation: r.mitigation ?? "",
//       })),
//     },
//     appendix: {
//       historicalFinancialsNotes: plan.appendix?.historicalFinancialsNotes ?? "",
//       marketResearchSources: lines(plan.appendix?.marketResearchSources),
//       attachments: rows(plan.appendix?.attachments, (a) => ({
//         label: a.label ?? "",
//         url: a.url ?? "",
//       })),
//       milestones: rows(plan.appendix?.milestones, (m) => ({
//         title: m.title ?? "",
//         date: m.date ?? "",
//         owner: m.owner ?? "",
//       })),
//       freeNotes: plan.appendix?.freeNotes ?? "",
//     },
//   };
// }

// // -----------------------------------------------------------------------
// // Convert form values -> upsertPlan args (parse numbers, split lines,
// // drop empty optional strings so the mutation stores clean data).
// // -----------------------------------------------------------------------
// function toNum(v: string): number | undefined {
//   if (v === undefined || v === null || v.trim() === "") return undefined;
//   const parsed = Number(v);
//   return Number.isNaN(parsed) ? undefined : parsed;
// }
// function toNumRequired(v: string): number {
//   return toNum(v) ?? 0;
// }
// function toLines(v: string): string[] {
//   return v
//     .split("\n")
//     .map((s) => s.trim())
//     .filter(Boolean);
// }
// function opt(v: string): string | undefined {
//   return v.trim() === "" ? undefined : v;
// }

// function formValuesToPlanFields(values: FormValues) {
//   return {
//     title: values.title || values.identity.businessName || "Untitled Plan",
//     identity: {
//       businessName: values.identity.businessName,
//       tradingName: opt(values.identity.tradingName),
//       legalStructure: opt(values.identity.legalStructure) as any,
//       registrationDate: opt(values.identity.registrationDate),
//       registrationNumber: opt(values.identity.registrationNumber),
//       physicalAddress: opt(values.identity.physicalAddress),
//       mailingAddress: opt(values.identity.mailingAddress),
//       website: opt(values.identity.website),
//       phone: opt(values.identity.phone),
//       email: opt(values.identity.email),
//       socialLinks: values.identity.socialLinks.map((s) => ({
//         label: String(s.label ?? ""),
//         url: String(s.url ?? ""),
//       })),
//       logoUrl: opt(values.identity.logoUrl),
//       foundingYear: toNum(values.identity.foundingYear),
//       stage: opt(values.identity.stage) as any,
//       industry: opt(values.identity.industry),
//       industryCode: opt(values.identity.industryCode),
//       missionStatement: opt(values.identity.missionStatement),
//       visionStatement: opt(values.identity.visionStatement),
//       coreValues: toLines(values.identity.coreValues),
//       problemStatement: opt(values.identity.problemStatement),
//       uniqueValueProposition: opt(values.identity.uniqueValueProposition),
//       shortTermGoals: toLines(values.identity.shortTermGoals),
//       mediumTermGoals: toLines(values.identity.mediumTermGoals),
//       longTermGoals: toLines(values.identity.longTermGoals),
//       exitStrategy: opt(values.identity.exitStrategy),
//     },
//     team: {
//       owners: values.team.owners.map((o) => ({
//         name: String(o.name ?? ""),
//         ownershipPercent: toNum(String(o.ownershipPercent ?? "")),
//         role: opt(String(o.role ?? "")),
//         bio: opt(String(o.bio ?? "")),
//       })),
//       managementTeam: values.team.managementTeam.map((m) => ({
//         name: String(m.name ?? ""),
//         title: String(m.title ?? ""),
//         responsibilities: opt(String(m.responsibilities ?? "")),
//         experience: opt(String(m.experience ?? "")),
//       })),
//       orgStructureDescription: opt(values.team.orgStructureDescription),
//       plannedHires: values.team.plannedHires.map((h) => ({
//         role: String(h.role ?? ""),
//         count: toNumRequired(String(h.count ?? "")),
//         timeline: opt(String(h.timeline ?? "")),
//         annualSalary: toNum(String(h.annualSalary ?? "")),
//       })),
//       advisors: values.team.advisors.map((a) => ({
//         name: String(a.name ?? ""),
//         role: opt(String(a.role ?? "")),
//       })),
//       keyPartnerships: values.team.keyPartnerships.map((p) => ({
//         name: String(p.name ?? ""),
//         description: opt(String(p.description ?? "")),
//       })),
//       licensesAndPermits: toLines(values.team.licensesAndPermits),
//       intellectualProperty: values.team.intellectualProperty.map((ip) => ({
//         type: String(ip.type ?? ""),
//         description: String(ip.description ?? ""),
//       })),
//     },
//     offerings: {
//       products: values.offerings.products.map((p) => ({
//         name: String(p.name ?? ""),
//         description: String(p.description ?? ""),
//         features: opt(String(p.features ?? "")),
//         price: toNum(String(p.price ?? "")),
//         pricingNotes: opt(String(p.pricingNotes ?? "")),
//         developmentStage: opt(String(p.developmentStage ?? "")),
//       })),
//       productionProcess: opt(values.offerings.productionProcess),
//       inventoryRequirements: opt(values.offerings.inventoryRequirements),
//       qualityControl: opt(values.offerings.qualityControl),
//       roadmap: toLines(values.offerings.roadmap),
//     },
//     market: {
//       targetDemographics: opt(values.market.targetDemographics),
//       targetGeography: opt(values.market.targetGeography),
//       customerNeeds: opt(values.market.customerNeeds),
//       tam: toNum(values.market.tam),
//       sam: toNum(values.market.sam),
//       som: toNum(values.market.som),
//       marketSizeSource: opt(values.market.marketSizeSource),
//       marketTrends: opt(values.market.marketTrends),
//       competitors: values.market.competitors.map((c) => ({
//         name: String(c.name ?? ""),
//         strengths: opt(String(c.strengths ?? "")),
//         weaknesses: opt(String(c.weaknesses ?? "")),
//         marketSharePercent: toNum(String(c.marketSharePercent ?? "")),
//         pricing: opt(String(c.pricing ?? "")),
//         differentiation: opt(String(c.differentiation ?? "")),
//       })),
//       swotStrengths: toLines(values.market.swotStrengths),
//       swotWeaknesses: toLines(values.market.swotWeaknesses),
//       swotOpportunities: toLines(values.market.swotOpportunities),
//       swotThreats: toLines(values.market.swotThreats),
//       barriersToEntry: opt(values.market.barriersToEntry),
//       regulatoryNotes: opt(values.market.regulatoryNotes),
//       seasonalFactors: opt(values.market.seasonalFactors),
//     },
//     marketingSales: {
//       channels: toLines(values.marketingSales.channels),
//       salesStrategy: opt(values.marketingSales.salesStrategy),
//       cac: toNum(values.marketingSales.cac),
//       ltv: toNum(values.marketingSales.ltv),
//       branding: opt(values.marketingSales.branding),
//       salesTargets: opt(values.marketingSales.salesTargets),
//       distributionChannels: toLines(values.marketingSales.distributionChannels),
//       retentionPlans: opt(values.marketingSales.retentionPlans),
//       marketingBudgetAllocation:
//         values.marketingSales.marketingBudgetAllocation.map((b) => ({
//           channel: String(b.channel ?? ""),
//           percentOfBudget: toNumRequired(String(b.percentOfBudget ?? "")),
//         })),
//     },
//     operations: {
//       locations: toLines(values.operations.locations),
//       facilitiesNotes: opt(values.operations.facilitiesNotes),
//       equipment: values.operations.equipment.map((e) => ({
//         item: String(e.item ?? ""),
//         cost: toNum(String(e.cost ?? "")),
//         ownedOrLeased: opt(String(e.ownedOrLeased ?? "")),
//       })),
//       suppliers: toLines(values.operations.suppliers),
//       productionCapacityNotes: opt(values.operations.productionCapacityNotes),
//       logisticsNotes: opt(values.operations.logisticsNotes),
//       techStack: toLines(values.operations.techStack),
//       hoursOfOperation: opt(values.operations.hoursOfOperation),
//       scalabilityPlans: opt(values.operations.scalabilityPlans),
//       operationalRisks: values.operations.operationalRisks.map((r) => ({
//         risk: String(r.risk ?? ""),
//         mitigation: opt(String(r.mitigation ?? "")),
//       })),
//     },
//     funding: {
//       fundingSources: values.funding.fundingSources.map((s) => ({
//         source: String(s.source ?? ""),
//         amount: toNumRequired(String(s.amount ?? "")),
//         terms: opt(String(s.terms ?? "")),
//       })),
//       fundingRequestAmount: toNum(values.funding.fundingRequestAmount),
//       equityOffered: opt(values.funding.equityOffered),
//       debtTerms: opt(values.funding.debtTerms),
//       collateral: opt(values.funding.collateral),
//       startupCosts: values.funding.startupCosts.map((c) => ({
//         category: String(c.category ?? ""),
//         amount: toNumRequired(String(c.amount ?? "")),
//       })),
//     },
//     financials: {
//       monthlySalesVolume: toNum(values.financials.monthlySalesVolume),
//       avgSellingPrice: toNum(values.financials.avgSellingPrice),
//       revenueStreams: values.financials.revenueStreams.map((r) => ({
//         name: String(r.name ?? ""),
//         percentOfRevenue: toNumRequired(String(r.percentOfRevenue ?? "")),
//       })),
//       monthlyGrowthRatePercent: toNum(
//         values.financials.monthlyGrowthRatePercent,
//       ),
//       seasonalityNotes: opt(values.financials.seasonalityNotes),
//       churnRatePercent: toNum(values.financials.churnRatePercent),
//       materialCostPerUnit: toNum(values.financials.materialCostPerUnit),
//       directLaborPerUnit: toNum(values.financials.directLaborPerUnit),
//       shippingCostPerUnit: toNum(values.financials.shippingCostPerUnit),
//       otherVariableCostPerUnit: toNum(
//         values.financials.otherVariableCostPerUnit,
//       ),
//       operatingExpenses: values.financials.operatingExpenses.map((e) => ({
//         category: String(e.category ?? ""),
//         monthlyAmount: toNumRequired(String(e.monthlyAmount ?? "")),
//         isFixed: !!e.isFixed,
//       })),
//       openingCashBalance: toNum(values.financials.openingCashBalance),
//       loans: values.financials.loans.map((l) => ({
//         principal: toNumRequired(String(l.principal ?? "")),
//         annualInterestRatePercent: toNumRequired(
//           String(l.annualInterestRatePercent ?? ""),
//         ),
//         termMonths: toNumRequired(String(l.termMonths ?? "")),
//       })),
//       taxRatePercent: toNum(values.financials.taxRatePercent),
//       inflationRatePercent: toNum(values.financials.inflationRatePercent),
//       projectionHorizonMonths: toNum(values.financials.projectionHorizonMonths),
//       scenario: (opt(values.financials.scenario) as any) ?? "base",
//     },
//     kpis: {
//       grossMarginTargetPercent: toNum(values.kpis.grossMarginTargetPercent),
//       netMarginTargetPercent: toNum(values.kpis.netMarginTargetPercent),
//       roiTargetPercent: toNum(values.kpis.roiTargetPercent),
//       paybackPeriodTargetMonths: toNum(values.kpis.paybackPeriodTargetMonths),
//       assumptions: toLines(values.kpis.assumptions),
//       riskFactors: values.kpis.riskFactors.map((r) => ({
//         risk: String(r.risk ?? ""),
//         mitigation: opt(String(r.mitigation ?? "")),
//       })),
//     },
//     appendix: {
//       historicalFinancialsNotes: opt(values.appendix.historicalFinancialsNotes),
//       marketResearchSources: toLines(values.appendix.marketResearchSources),
//       attachments: values.appendix.attachments.map((a) => ({
//         label: String(a.label ?? ""),
//         url: String(a.url ?? ""),
//       })),
//       milestones: values.appendix.milestones.map((m) => ({
//         title: String(m.title ?? ""),
//         date: opt(String(m.date ?? "")),
//         owner: opt(String(m.owner ?? "")),
//       })),
//       freeNotes: opt(values.appendix.freeNotes),
//     },
//   };
// }

// // -----------------------------------------------------------------------
// // Main form
// // -----------------------------------------------------------------------
// function CreateBusinessPlanForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const rawPlanId = searchParams.get("planId");
//   const planId =
//     rawPlanId && rawPlanId.length > 0
//       ? (rawPlanId as Id<"businessPlans">)
//       : null;
//   const isEditing = !!planId;

//   const existingPlan = useQuery(
//     api.businessPlans.getPlan,
//     planId ? { planId } : "skip",
//   );
//   const upsertPlan = useMutation(api.businessPlans.upsertPlan);
//   // convex/ai.ts needs a `generatePlan` action mirroring the CV app's
//   // `generateCv` — see the "What's next" notes for what it should do.
//   const generatePlan = useAction((api as any).ai.generatePlan);

//   const [submitting, setSubmitting] = useState<"draft" | "generate" | null>(
//     null,
//   );
//   const { control, register, handleSubmit, reset } = useForm<FormValues>({
//     defaultValues: EMPTY_DEFAULTS,
//   });

//   useEffect(() => {
//     if (!existingPlan) return;
//     reset(planToFormValues(existingPlan));
//   }, [existingPlan, reset]);

//   async function persist(values: FormValues, preserveStatus: boolean) {
//     const fields = formValuesToPlanFields(values);
//     const savedId = await upsertPlan({
//       planId: planId ?? undefined,
//       preserveStatus,
//       ...fields,
//     } as any);
//     return savedId as Id<"businessPlans">;
//   }

//   async function onSaveDraft(values: FormValues) {
//     setSubmitting("draft");
//     try {
//       const savedId = await persist(values, true);
//       toast.success("Draft saved");
//       if (!isEditing) router.replace(`/dashboard/create?planId=${savedId}`);
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : "Failed to save draft");
//     } finally {
//       setSubmitting(null);
//     }
//   }

//   async function onGenerate(values: FormValues) {
//     setSubmitting("generate");
//     try {
//       const savedId = await persist(values, false);
//       await generatePlan({ planId: savedId });
//       toast.success("Generating your business plan…");
//       router.push(`/dashboard/plans/${savedId}/history`);
//     } catch (err) {
//       toast.error(
//         err instanceof Error ? err.message : "Failed to generate plan",
//       );
//     } finally {
//       setSubmitting(null);
//     }
//   }

//   return (
//     <form className="mx-auto max-w-4xl space-y-6 pb-24">
//       <div className={SECTION_CLASS}>
//         <Label className="text-xs text-zinc-500">
//           Plan title (internal label)
//         </Label>
//         <Input {...register("title")} placeholder="e.g. Coffee Shop — v2" />
//       </div>

//       <Tabs defaultValue="identity" className="w-full">
//         <TabsList className="grid grid-cols-5 gap-1 sm:grid-cols-10">
//           <TabsTrigger value="identity">Identity</TabsTrigger>
//           <TabsTrigger value="team">Team</TabsTrigger>
//           <TabsTrigger value="offerings">Offerings</TabsTrigger>
//           <TabsTrigger value="market">Market</TabsTrigger>
//           <TabsTrigger value="marketingSales">Marketing</TabsTrigger>
//           <TabsTrigger value="operations">Ops</TabsTrigger>
//           <TabsTrigger value="funding">Funding</TabsTrigger>
//           <TabsTrigger value="financials">Financials</TabsTrigger>
//           <TabsTrigger value="kpis">KPIs</TabsTrigger>
//           <TabsTrigger value="appendix">Appendix</TabsTrigger>
//         </TabsList>

//         {/* 1. Identity ---------------------------------------------------- */}
//         <TabsContent value="identity" className={SECTION_CLASS}>
//           <div className="grid gap-3 sm:grid-cols-2">
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Business name *</Label>
//               <Input {...register("identity.businessName")} required />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Trading name / DBA
//               </Label>
//               <Input {...register("identity.tradingName")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Legal structure</Label>
//               <select
//                 {...register("identity.legalStructure")}
//                 className="w-full rounded-md border border-zinc-900/10 bg-transparent p-2 text-sm dark:border-white/10"
//               >
//                 <option value="">—</option>
//                 <option value="sole_proprietorship">Sole proprietorship</option>
//                 <option value="partnership">Partnership</option>
//                 <option value="llc">LLC</option>
//                 <option value="corporation">Corporation</option>
//                 <option value="nonprofit">Nonprofit</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Stage</Label>
//               <select
//                 {...register("identity.stage")}
//                 className="w-full rounded-md border border-zinc-900/10 bg-transparent p-2 text-sm dark:border-white/10"
//               >
//                 <option value="">—</option>
//                 <option value="idea">Idea</option>
//                 <option value="pre_revenue">Pre-revenue</option>
//                 <option value="startup">Startup</option>
//                 <option value="growth">Growth</option>
//                 <option value="established">Established</option>
//               </select>
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Registration date</Label>
//               <Input type="date" {...register("identity.registrationDate")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Registration number
//               </Label>
//               <Input {...register("identity.registrationNumber")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Physical address</Label>
//               <Input {...register("identity.physicalAddress")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Mailing address</Label>
//               <Input {...register("identity.mailingAddress")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Website</Label>
//               <Input {...register("identity.website")} placeholder="https://" />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Phone</Label>
//               <Input {...register("identity.phone")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Email</Label>
//               <Input type="email" {...register("identity.email")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Founding year</Label>
//               <Input type="number" {...register("identity.foundingYear")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Industry</Label>
//               <Input {...register("identity.industry")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 NAICS / industry code
//               </Label>
//               <Input {...register("identity.industryCode")} />
//             </div>
//           </div>

//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">Logo</Label>
//             {/* Reuses the CV app's Cloudinary uploader for logoUrl */}
//             <MediaUpload
//               value={undefined}
//               onChange={(url: string) => {
//                 const input = document.querySelector<HTMLInputElement>(
//                   'input[name="identity.logoUrl"]',
//                 );
//                 if (input) input.value = url;
//               }}
//               kind="image"
//             />
//             <input type="hidden" {...register("identity.logoUrl")} />
//           </div>

//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">Mission statement</Label>
//             <Textarea {...register("identity.missionStatement")} rows={2} />
//           </div>
//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">Vision statement</Label>
//             <Textarea {...register("identity.visionStatement")} rows={2} />
//           </div>
//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">
//               Problem the business solves
//             </Label>
//             <Textarea {...register("identity.problemStatement")} rows={2} />
//           </div>
//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">
//               Unique value proposition
//             </Label>
//             <Textarea
//               {...register("identity.uniqueValueProposition")}
//               rows={2}
//             />
//           </div>

//           <StringListField
//             register={register}
//             name="identity.coreValues"
//             label="Core values"
//           />
//           <StringListField
//             register={register}
//             name="identity.shortTermGoals"
//             label="Short-term goals (~1yr)"
//           />
//           <StringListField
//             register={register}
//             name="identity.mediumTermGoals"
//             label="Medium-term goals (~3yr)"
//           />
//           <StringListField
//             register={register}
//             name="identity.longTermGoals"
//             label="Long-term goals (5yr+)"
//           />

//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">Exit strategy</Label>
//             <Textarea {...register("identity.exitStrategy")} rows={2} />
//           </div>

//           <RepeatingSection
//             control={control}
//             register={register}
//             name="identity.socialLinks"
//             title="Social / brand links"
//             addLabel="Add link"
//             fields={[
//               { name: "label", label: "Label", type: "text" },
//               { name: "url", label: "URL", type: "text" },
//             ]}
//           />
//         </TabsContent>

//         {/* 2. Team --------------------------------------------------------- */}
//         <TabsContent value="team" className={SECTION_CLASS}>
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="team.owners"
//             title="Owners / founders"
//             addLabel="Add owner"
//             fields={[
//               { name: "name", label: "Name", type: "text" },
//               {
//                 name: "ownershipPercent",
//                 label: "Ownership %",
//                 type: "number",
//               },
//               { name: "role", label: "Role", type: "text" },
//               { name: "bio", label: "Bio / experience", type: "textarea" },
//             ]}
//           />
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="team.managementTeam"
//             title="Management team"
//             addLabel="Add member"
//             fields={[
//               { name: "name", label: "Name", type: "text" },
//               { name: "title", label: "Title", type: "text" },
//               {
//                 name: "responsibilities",
//                 label: "Responsibilities",
//                 type: "textarea",
//               },
//               {
//                 name: "experience",
//                 label: "Relevant experience",
//                 type: "textarea",
//               },
//             ]}
//           />
//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">
//               Org structure description
//             </Label>
//             <Textarea {...register("team.orgStructureDescription")} rows={2} />
//           </div>
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="team.plannedHires"
//             title="Planned hires"
//             addLabel="Add role"
//             fields={[
//               { name: "role", label: "Role", type: "text" },
//               { name: "count", label: "Count", type: "number" },
//               { name: "timeline", label: "Timeline", type: "text" },
//               { name: "annualSalary", label: "Annual salary", type: "number" },
//             ]}
//           />
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="team.advisors"
//             title="Advisors / board members"
//             addLabel="Add advisor"
//             fields={[
//               { name: "name", label: "Name", type: "text" },
//               { name: "role", label: "Role", type: "text" },
//             ]}
//           />
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="team.keyPartnerships"
//             title="Key partnerships / suppliers"
//             addLabel="Add partnership"
//             fields={[
//               { name: "name", label: "Name", type: "text" },
//               { name: "description", label: "Description", type: "textarea" },
//             ]}
//           />
//           <StringListField
//             register={register}
//             name="team.licensesAndPermits"
//             label="Licenses & permits"
//           />
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="team.intellectualProperty"
//             title="Intellectual property"
//             addLabel="Add IP"
//             fields={[
//               {
//                 name: "type",
//                 label: "Type (patent/trademark/...)",
//                 type: "text",
//               },
//               { name: "description", label: "Description", type: "textarea" },
//             ]}
//           />
//         </TabsContent>

//         {/* 3. Offerings ------------------------------------------------------ */}
//         <TabsContent value="offerings" className={SECTION_CLASS}>
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="offerings.products"
//             title="Products / services"
//             addLabel="Add product"
//             fields={[
//               { name: "name", label: "Name", type: "text" },
//               { name: "description", label: "Description", type: "textarea" },
//               { name: "features", label: "Features / USPs", type: "textarea" },
//               { name: "price", label: "Price", type: "number" },
//               {
//                 name: "pricingNotes",
//                 label: "Pricing notes (tiers/discounts)",
//                 type: "textarea",
//               },
//               {
//                 name: "developmentStage",
//                 label: "Development stage",
//                 type: "text",
//               },
//             ]}
//           />
//           <div className="grid gap-3 sm:grid-cols-2">
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Production / delivery process
//               </Label>
//               <Textarea {...register("offerings.productionProcess")} rows={2} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Inventory requirements
//               </Label>
//               <Textarea
//                 {...register("offerings.inventoryRequirements")}
//                 rows={2}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Quality control / standards
//               </Label>
//               <Textarea {...register("offerings.qualityControl")} rows={2} />
//             </div>
//           </div>
//           <StringListField
//             register={register}
//             name="offerings.roadmap"
//             label="Future roadmap / planned expansions"
//           />
//         </TabsContent>

//         {/* 4. Market ----------------------------------------------------- */}
//         <TabsContent value="market" className={SECTION_CLASS}>
//           <div className="grid gap-3 sm:grid-cols-2">
//             <div className="space-y-1 sm:col-span-2">
//               <Label className="text-xs text-zinc-500">
//                 Target demographics / psychographics
//               </Label>
//               <Textarea {...register("market.targetDemographics")} rows={2} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Target geography</Label>
//               <Input {...register("market.targetGeography")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Market size source
//               </Label>
//               <Input {...register("market.marketSizeSource")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">TAM ($)</Label>
//               <Input type="number" {...register("market.tam")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">SAM ($)</Label>
//               <Input type="number" {...register("market.sam")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">SOM ($)</Label>
//               <Input type="number" {...register("market.som")} />
//             </div>
//           </div>
//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">
//               Customer needs / pain points
//             </Label>
//             <Textarea {...register("market.customerNeeds")} rows={2} />
//           </div>
//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">
//               Market trends & growth rates
//             </Label>
//             <Textarea {...register("market.marketTrends")} rows={2} />
//           </div>
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="market.competitors"
//             title="Competitors"
//             addLabel="Add competitor"
//             fields={[
//               { name: "name", label: "Name", type: "text" },
//               { name: "strengths", label: "Strengths", type: "textarea" },
//               { name: "weaknesses", label: "Weaknesses", type: "textarea" },
//               {
//                 name: "marketSharePercent",
//                 label: "Market share %",
//                 type: "number",
//               },
//               { name: "pricing", label: "Pricing", type: "text" },
//               {
//                 name: "differentiation",
//                 label: "Differentiation",
//                 type: "textarea",
//               },
//             ]}
//           />
//           <div className="grid gap-3 sm:grid-cols-2">
//             <StringListField
//               register={register}
//               name="market.swotStrengths"
//               label="SWOT — Strengths"
//             />
//             <StringListField
//               register={register}
//               name="market.swotWeaknesses"
//               label="SWOT — Weaknesses"
//             />
//             <StringListField
//               register={register}
//               name="market.swotOpportunities"
//               label="SWOT — Opportunities"
//             />
//             <StringListField
//               register={register}
//               name="market.swotThreats"
//               label="SWOT — Threats"
//             />
//           </div>
//           <div className="grid gap-3 sm:grid-cols-3">
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Barriers to entry</Label>
//               <Textarea {...register("market.barriersToEntry")} rows={2} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Regulatory notes</Label>
//               <Textarea {...register("market.regulatoryNotes")} rows={2} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Seasonal factors</Label>
//               <Textarea {...register("market.seasonalFactors")} rows={2} />
//             </div>
//           </div>
//         </TabsContent>

//         {/* 5. Marketing & Sales -------------------------------------------- */}
//         <TabsContent value="marketingSales" className={SECTION_CLASS}>
//           <div className="grid gap-3 sm:grid-cols-2">
//             <StringListField
//               register={register}
//               name="marketingSales.channels"
//               label="Marketing channels"
//             />
//             <StringListField
//               register={register}
//               name="marketingSales.distributionChannels"
//               label="Distribution channels / outlets"
//             />
//           </div>
//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">
//               Sales strategy / process
//             </Label>
//             <Textarea {...register("marketingSales.salesStrategy")} rows={2} />
//           </div>
//           <div className="grid gap-3 sm:grid-cols-2">
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Customer acquisition cost (CAC)
//               </Label>
//               <Input type="number" {...register("marketingSales.cac")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Customer lifetime value (LTV)
//               </Label>
//               <Input type="number" {...register("marketingSales.ltv")} />
//             </div>
//           </div>
//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">
//               Branding & positioning
//             </Label>
//             <Textarea {...register("marketingSales.branding")} rows={2} />
//           </div>
//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">
//               Sales targets / conversion rates
//             </Label>
//             <Textarea {...register("marketingSales.salesTargets")} rows={2} />
//           </div>
//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">
//               Customer retention / loyalty plans
//             </Label>
//             <Textarea {...register("marketingSales.retentionPlans")} rows={2} />
//           </div>
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="marketingSales.marketingBudgetAllocation"
//             title="Marketing budget allocation"
//             addLabel="Add channel"
//             fields={[
//               { name: "channel", label: "Channel", type: "text" },
//               { name: "percentOfBudget", label: "% of budget", type: "number" },
//             ]}
//           />
//         </TabsContent>

//         {/* 6. Operations --------------------------------------------------- */}
//         <TabsContent value="operations" className={SECTION_CLASS}>
//           <div className="grid gap-3 sm:grid-cols-2">
//             <StringListField
//               register={register}
//               name="operations.locations"
//               label="Locations (current & planned)"
//             />
//             <StringListField
//               register={register}
//               name="operations.suppliers"
//               label="Suppliers"
//             />
//             <StringListField
//               register={register}
//               name="operations.techStack"
//               label="Technology stack / software"
//             />
//           </div>
//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">
//               Facilities notes (rent/lease terms, build-out)
//             </Label>
//             <Textarea {...register("operations.facilitiesNotes")} rows={2} />
//           </div>
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="operations.equipment"
//             title="Equipment / technology needed"
//             addLabel="Add item"
//             fields={[
//               { name: "item", label: "Item", type: "text" },
//               { name: "cost", label: "Cost", type: "number" },
//               { name: "ownedOrLeased", label: "Owned or leased", type: "text" },
//             ]}
//           />
//           <div className="grid gap-3 sm:grid-cols-2">
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Production / service capacity notes
//               </Label>
//               <Textarea
//                 {...register("operations.productionCapacityNotes")}
//                 rows={2}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Logistics / shipping notes
//               </Label>
//               <Textarea {...register("operations.logisticsNotes")} rows={2} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Hours of operation
//               </Label>
//               <Input {...register("operations.hoursOfOperation")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Scalability plans</Label>
//               <Textarea {...register("operations.scalabilityPlans")} rows={2} />
//             </div>
//           </div>
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="operations.operationalRisks"
//             title="Operational risks & contingencies"
//             addLabel="Add risk"
//             fields={[
//               { name: "risk", label: "Risk", type: "text" },
//               { name: "mitigation", label: "Mitigation", type: "textarea" },
//             ]}
//           />
//         </TabsContent>

//         {/* 7. Funding ------------------------------------------------------ */}
//         <TabsContent value="funding" className={SECTION_CLASS}>
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="funding.fundingSources"
//             title="Funding sources"
//             addLabel="Add source"
//             fields={[
//               {
//                 name: "source",
//                 label: "Source (personal/loan/investor/grant/crowdfunding)",
//                 type: "text",
//               },
//               { name: "amount", label: "Amount", type: "number" },
//               { name: "terms", label: "Terms", type: "textarea" },
//             ]}
//           />
//           <div className="grid gap-3 sm:grid-cols-2">
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Funding request amount
//               </Label>
//               <Input
//                 type="number"
//                 {...register("funding.fundingRequestAmount")}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Equity offered</Label>
//               <Input {...register("funding.equityOffered")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Debt terms</Label>
//               <Input {...register("funding.debtTerms")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Collateral available
//               </Label>
//               <Input {...register("funding.collateral")} />
//             </div>
//           </div>
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="funding.startupCosts"
//             title="Startup costs by category"
//             addLabel="Add cost"
//             fields={[
//               { name: "category", label: "Category", type: "text" },
//               { name: "amount", label: "Amount", type: "number" },
//             ]}
//           />
//         </TabsContent>

//         {/* 8. Financials ----------------------------------------------------- */}
//         <TabsContent value="financials" className={SECTION_CLASS}>
//           <p className="text-sm text-zinc-500">
//             These feed <code>calculateFinancials()</code> directly — the AI
//             never computes these numbers.
//           </p>
//           <div className="grid gap-3 sm:grid-cols-3">
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Monthly sales volume (units)
//               </Label>
//               <Input
//                 type="number"
//                 {...register("financials.monthlySalesVolume")}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Average selling price
//               </Label>
//               <Input
//                 type="number"
//                 {...register("financials.avgSellingPrice")}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Monthly growth rate %
//               </Label>
//               <Input
//                 type="number"
//                 {...register("financials.monthlyGrowthRatePercent")}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Churn rate %</Label>
//               <Input
//                 type="number"
//                 {...register("financials.churnRatePercent")}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Opening cash balance
//               </Label>
//               <Input
//                 type="number"
//                 {...register("financials.openingCashBalance")}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Tax rate %</Label>
//               <Input type="number" {...register("financials.taxRatePercent")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Inflation rate %</Label>
//               <Input
//                 type="number"
//                 {...register("financials.inflationRatePercent")}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Projection horizon (months)
//               </Label>
//               <Input
//                 type="number"
//                 {...register("financials.projectionHorizonMonths")}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Scenario</Label>
//               <select
//                 {...register("financials.scenario")}
//                 className="w-full rounded-md border border-zinc-900/10 bg-transparent p-2 text-sm dark:border-white/10"
//               >
//                 <option value="base">Base</option>
//                 <option value="optimistic">Optimistic</option>
//                 <option value="pessimistic">Pessimistic</option>
//               </select>
//             </div>
//           </div>
//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">Seasonality notes</Label>
//             <Textarea {...register("financials.seasonalityNotes")} rows={2} />
//           </div>

//           <Label className="text-sm font-medium">
//             Cost of goods sold (per unit)
//           </Label>
//           <div className="grid gap-3 sm:grid-cols-4">
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Material cost</Label>
//               <Input
//                 type="number"
//                 {...register("financials.materialCostPerUnit")}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">Direct labor</Label>
//               <Input
//                 type="number"
//                 {...register("financials.directLaborPerUnit")}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Shipping / fulfillment
//               </Label>
//               <Input
//                 type="number"
//                 {...register("financials.shippingCostPerUnit")}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Other variable cost
//               </Label>
//               <Input
//                 type="number"
//                 {...register("financials.otherVariableCostPerUnit")}
//               />
//             </div>
//           </div>

//           <RepeatingSection
//             control={control}
//             register={register}
//             name="financials.revenueStreams"
//             title="Revenue streams"
//             addLabel="Add stream"
//             fields={[
//               { name: "name", label: "Name", type: "text" },
//               {
//                 name: "percentOfRevenue",
//                 label: "% of revenue",
//                 type: "number",
//               },
//             ]}
//           />
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="financials.operatingExpenses"
//             title="Operating expenses (monthly)"
//             addLabel="Add expense"
//             fields={[
//               { name: "category", label: "Category", type: "text" },
//               {
//                 name: "monthlyAmount",
//                 label: "Monthly amount",
//                 type: "number",
//               },
//               {
//                 name: "isFixed",
//                 label: "Fixed (vs variable)",
//                 type: "checkbox",
//               },
//             ]}
//           />
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="financials.loans"
//             title="Loans"
//             addLabel="Add loan"
//             fields={[
//               { name: "principal", label: "Principal", type: "number" },
//               {
//                 name: "annualInterestRatePercent",
//                 label: "Annual interest rate %",
//                 type: "number",
//               },
//               { name: "termMonths", label: "Term (months)", type: "number" },
//             ]}
//           />
//         </TabsContent>

//         {/* 9. KPIs ----------------------------------------------------------- */}
//         <TabsContent value="kpis" className={SECTION_CLASS}>
//           <div className="grid gap-3 sm:grid-cols-4">
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Gross margin target %
//               </Label>
//               <Input
//                 type="number"
//                 {...register("kpis.grossMarginTargetPercent")}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Net margin target %
//               </Label>
//               <Input
//                 type="number"
//                 {...register("kpis.netMarginTargetPercent")}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">ROI target %</Label>
//               <Input type="number" {...register("kpis.roiTargetPercent")} />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs text-zinc-500">
//                 Payback period target (months)
//               </Label>
//               <Input
//                 type="number"
//                 {...register("kpis.paybackPeriodTargetMonths")}
//               />
//             </div>
//           </div>
//           <StringListField
//             register={register}
//             name="kpis.assumptions"
//             label="Explicit assumptions"
//             placeholder={'e.g. "Assume 10% monthly growth after month 6"'}
//           />
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="kpis.riskFactors"
//             title="Risk factors & mitigation"
//             addLabel="Add risk"
//             fields={[
//               { name: "risk", label: "Risk", type: "text" },
//               { name: "mitigation", label: "Mitigation", type: "textarea" },
//             ]}
//           />
//         </TabsContent>

//         {/* 10. Appendix -------------------------------------------------- */}
//         <TabsContent value="appendix" className={SECTION_CLASS}>
//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">
//               Historical financials notes
//             </Label>
//             <Textarea
//               {...register("appendix.historicalFinancialsNotes")}
//               rows={2}
//             />
//           </div>
//           <StringListField
//             register={register}
//             name="appendix.marketResearchSources"
//             label="Market research sources / citations"
//           />
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="appendix.attachments"
//             title="Attachments (photos, floor plans, contracts...)"
//             addLabel="Add attachment"
//             fields={[
//               { name: "label", label: "Label", type: "text" },
//               { name: "url", label: "URL", type: "text" },
//             ]}
//           />
//           <RepeatingSection
//             control={control}
//             register={register}
//             name="appendix.milestones"
//             title="Timeline / milestones"
//             addLabel="Add milestone"
//             fields={[
//               { name: "title", label: "Milestone", type: "text" },
//               { name: "date", label: "Date", type: "text" },
//               { name: "owner", label: "Owner", type: "text" },
//             ]}
//           />
//           <div className="space-y-1">
//             <Label className="text-xs text-zinc-500">
//               Free-text notes for the AI
//             </Label>
//             <Textarea {...register("appendix.freeNotes")} rows={3} />
//           </div>
//         </TabsContent>
//       </Tabs>

//       <div className="sticky bottom-4 flex justify-end gap-2 rounded-2xl border border-zinc-900/10 bg-white/90 p-3 backdrop-blur dark:border-white/10 dark:bg-zinc-950/90">
//         <Button
//           type="button"
//           variant="outline"
//           disabled={submitting !== null}
//           onClick={handleSubmit((v) => onSaveDraft(v))}
//         >
//           {submitting === "draft" && (
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           )}
//           Save draft
//         </Button>
//         <Button
//           type="button"
//           disabled={submitting !== null}
//           onClick={handleSubmit((v) => onGenerate(v))}
//         >
//           {submitting === "generate" && (
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           )}
//           Generate plan
//         </Button>
//       </div>
//     </form>
//   );
// }

// export default function CreateBusinessPlanPage() {
//   return (
//     <Suspense
//       fallback={<div className="p-8 text-sm text-zinc-500">Loading…</div>}
//     >
//       <CreateBusinessPlanForm />
//     </Suspense>
//   );
// }

"use client";

import { Suspense, useEffect, useState } from "react";
import {
  useForm,
  useFieldArray,
  useController,
  type Control,
  type UseFormRegister,
  type FieldPath,
  type FieldArrayPath,
  type FieldArray,
} from "react-hook-form";
import { useMutation, useAction, useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import type { FunctionArgs, FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MediaUpload } from "@/app/components/media-upload";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";

// -----------------------------------------------------------------------
// Shared layout classes — same look as the CV app's section cards.
// -----------------------------------------------------------------------
const SECTION_CLASS =
  "space-y-3 rounded-2xl border border-zinc-900/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5";
const ROW_CLASS =
  "grid gap-3 rounded-xl border border-zinc-900/10 dark:border-white/10 p-4 relative";

// -----------------------------------------------------------------------
// Literal unions for the <select> fields. These must match the schema's
// validator literals exactly — update both places together if the
// schema changes.
// -----------------------------------------------------------------------
type LegalStructure =
  | "sole_proprietorship"
  | "partnership"
  | "llc"
  | "corporation"
  | "nonprofit"
  | "other";
type Stage = "idea" | "pre_revenue" | "startup" | "growth" | "established";
type Scenario = "base" | "optimistic" | "pessimistic";

// -----------------------------------------------------------------------
// Form shape. Numbers are kept as `string` here (raw input value) and
// parsed on submit — avoids NaN/controlled-input churn on every keystroke.
// -----------------------------------------------------------------------
type Row = Record<string, string | boolean>;

type FormValues = {
  title: string;

  identity: {
    businessName: string;
    tradingName: string;
    legalStructure: string; // "" | LegalStructure, parsed on submit
    registrationDate: string;
    registrationNumber: string;
    physicalAddress: string;
    mailingAddress: string;
    website: string;
    phone: string;
    email: string;
    socialLinks: Row[]; // { label, url }
    logoUrl: string;
    foundingYear: string;
    stage: string; // "" | Stage, parsed on submit
    industry: string;
    industryCode: string;
    missionStatement: string;
    visionStatement: string;
    coreValues: string; // newline-separated
    problemStatement: string;
    uniqueValueProposition: string;
    shortTermGoals: string;
    mediumTermGoals: string;
    longTermGoals: string;
    exitStrategy: string;
  };

  team: {
    owners: Row[]; // name, ownershipPercent, role, bio
    managementTeam: Row[]; // name, title, responsibilities, experience
    orgStructureDescription: string;
    plannedHires: Row[]; // role, count, timeline, annualSalary
    advisors: Row[]; // name, role
    keyPartnerships: Row[]; // name, description
    licensesAndPermits: string;
    intellectualProperty: Row[]; // type, description
  };

  offerings: {
    products: Row[]; // name, description, features, price, pricingNotes, developmentStage
    productionProcess: string;
    inventoryRequirements: string;
    qualityControl: string;
    roadmap: string;
  };

  market: {
    targetDemographics: string;
    targetGeography: string;
    customerNeeds: string;
    tam: string;
    sam: string;
    som: string;
    marketSizeSource: string;
    marketTrends: string;
    competitors: Row[]; // name, strengths, weaknesses, marketSharePercent, pricing, differentiation
    swotStrengths: string;
    swotWeaknesses: string;
    swotOpportunities: string;
    swotThreats: string;
    barriersToEntry: string;
    regulatoryNotes: string;
    seasonalFactors: string;
  };

  marketingSales: {
    channels: string;
    salesStrategy: string;
    cac: string;
    ltv: string;
    branding: string;
    salesTargets: string;
    distributionChannels: string;
    retentionPlans: string;
    marketingBudgetAllocation: Row[]; // channel, percentOfBudget
  };

  operations: {
    locations: string;
    facilitiesNotes: string;
    equipment: Row[]; // item, cost, ownedOrLeased
    suppliers: string;
    productionCapacityNotes: string;
    logisticsNotes: string;
    techStack: string;
    hoursOfOperation: string;
    scalabilityPlans: string;
    operationalRisks: Row[]; // risk, mitigation
  };

  funding: {
    fundingSources: Row[]; // source, amount, terms
    fundingRequestAmount: string;
    equityOffered: string;
    debtTerms: string;
    collateral: string;
    startupCosts: Row[]; // category, amount
  };

  financials: {
    monthlySalesVolume: string;
    avgSellingPrice: string;
    revenueStreams: Row[]; // name, percentOfRevenue
    monthlyGrowthRatePercent: string;
    seasonalityNotes: string;
    churnRatePercent: string;
    materialCostPerUnit: string;
    directLaborPerUnit: string;
    shippingCostPerUnit: string;
    otherVariableCostPerUnit: string;
    operatingExpenses: Row[]; // category, monthlyAmount, isFixed(bool)
    openingCashBalance: string;
    loans: Row[]; // principal, annualInterestRatePercent, termMonths
    taxRatePercent: string;
    inflationRatePercent: string;
    projectionHorizonMonths: string;
    scenario: string; // "" | Scenario, parsed on submit
  };

  kpis: {
    grossMarginTargetPercent: string;
    netMarginTargetPercent: string;
    roiTargetPercent: string;
    paybackPeriodTargetMonths: string;
    assumptions: string;
    riskFactors: Row[]; // risk, mitigation
  };

  appendix: {
    historicalFinancialsNotes: string;
    marketResearchSources: string;
    attachments: Row[]; // label, url
    milestones: Row[]; // title, date, owner
    freeNotes: string;
  };
};

const EMPTY_DEFAULTS: FormValues = {
  title: "",
  identity: {
    businessName: "",
    tradingName: "",
    legalStructure: "",
    registrationDate: "",
    registrationNumber: "",
    physicalAddress: "",
    mailingAddress: "",
    website: "",
    phone: "",
    email: "",
    socialLinks: [],
    logoUrl: "",
    foundingYear: "",
    stage: "",
    industry: "",
    industryCode: "",
    missionStatement: "",
    visionStatement: "",
    coreValues: "",
    problemStatement: "",
    uniqueValueProposition: "",
    shortTermGoals: "",
    mediumTermGoals: "",
    longTermGoals: "",
    exitStrategy: "",
  },
  team: {
    owners: [],
    managementTeam: [],
    orgStructureDescription: "",
    plannedHires: [],
    advisors: [],
    keyPartnerships: [],
    licensesAndPermits: "",
    intellectualProperty: [],
  },
  offerings: {
    products: [],
    productionProcess: "",
    inventoryRequirements: "",
    qualityControl: "",
    roadmap: "",
  },
  market: {
    targetDemographics: "",
    targetGeography: "",
    customerNeeds: "",
    tam: "",
    sam: "",
    som: "",
    marketSizeSource: "",
    marketTrends: "",
    competitors: [],
    swotStrengths: "",
    swotWeaknesses: "",
    swotOpportunities: "",
    swotThreats: "",
    barriersToEntry: "",
    regulatoryNotes: "",
    seasonalFactors: "",
  },
  marketingSales: {
    channels: "",
    salesStrategy: "",
    cac: "",
    ltv: "",
    branding: "",
    salesTargets: "",
    distributionChannels: "",
    retentionPlans: "",
    marketingBudgetAllocation: [],
  },
  operations: {
    locations: "",
    facilitiesNotes: "",
    equipment: [],
    suppliers: "",
    productionCapacityNotes: "",
    logisticsNotes: "",
    techStack: "",
    hoursOfOperation: "",
    scalabilityPlans: "",
    operationalRisks: [],
  },
  funding: {
    fundingSources: [],
    fundingRequestAmount: "",
    equityOffered: "",
    debtTerms: "",
    collateral: "",
    startupCosts: [],
  },
  financials: {
    monthlySalesVolume: "",
    avgSellingPrice: "",
    revenueStreams: [],
    monthlyGrowthRatePercent: "",
    seasonalityNotes: "",
    churnRatePercent: "",
    materialCostPerUnit: "",
    directLaborPerUnit: "",
    shippingCostPerUnit: "",
    otherVariableCostPerUnit: "",
    operatingExpenses: [],
    openingCashBalance: "",
    loans: [],
    taxRatePercent: "",
    inflationRatePercent: "12",
    projectionHorizonMonths: "12",
    scenario: "base",
  },
  kpis: {
    grossMarginTargetPercent: "",
    netMarginTargetPercent: "",
    roiTargetPercent: "",
    paybackPeriodTargetMonths: "",
    assumptions: "",
    riskFactors: [],
  },
  appendix: {
    historicalFinancialsNotes: "",
    marketResearchSources: "",
    attachments: [],
    milestones: [],
    freeNotes: "",
  },
};

// -----------------------------------------------------------------------
// Generic repeating-row config. One config replaces ~15 lines of
// hand-written JSX per array field in the old CV form.
// -----------------------------------------------------------------------
type FieldType = "text" | "number" | "textarea" | "checkbox";
type RowFieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
};

// `TName` is constrained to react-hook-form's own FieldArrayPath type, so
// callers can only pass a dot-path that genuinely points at an array field
// on FormValues (e.g. "team.owners") — TypeScript will reject a typo like
// "team.owner" at the call site instead of silently accepting `any`.
function RepeatingSection<TName extends FieldArrayPath<FormValues>>({
  control,
  register,
  name,
  title,
  fields,
  addLabel = "Add row",
}: {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  name: TName;
  title: string;
  fields: RowFieldConfig[];
  addLabel?: string;
}) {
  const { fields: rows, append, remove } = useFieldArray({ control, name });

  const emptyRow = (): Row =>
    Object.fromEntries(
      fields.map((f) => [f.name, f.type === "checkbox" ? false : ""]),
    );

  // Same limitation as the row `path` cast below: inside a generic function,
  // TypeScript can't narrow `FieldArray<FormValues, TName>` from an abstract
  // TName down to `Row`, even though every array field on FormValues really
  // is `Row[]`. Asserting to the library's own FieldArray type (not `any`)
  // is the accepted way to bridge that gap.
  function appendRow() {
    append(emptyRow() as FieldArray<FormValues, TName>);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{title}</Label>
        <Button type="button" variant="outline" size="sm" onClick={appendRow}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          {addLabel}
        </Button>
      </div>
      {rows.length === 0 && (
        <p className="text-sm text-zinc-500">
          Nothing added yet — click &quot;{addLabel}&quot; to start.
        </p>
      )}
      {rows.map((row, index) => (
        <div key={row.id} className={ROW_CLASS}>
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute right-3 top-3 text-zinc-400 hover:text-red-500"
            aria-label="Remove row"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="grid gap-3 pr-8 sm:grid-cols-2">
            {fields.map((f) => {
              // A fully dynamic `${name}.${index}.${f.name}` dot-path can't
              // be verified against FormValues at compile time — react-hook-form
              // has no way to type-check a path assembled at runtime. This
              // is the one place a manual assertion is unavoidable, so we
              // assert to the library's own FieldPath type (never `any`),
              // which still gives autocomplete/registration correctness.
              const path =
                `${name}.${index}.${f.name}` as FieldPath<FormValues>;
              if (f.type === "checkbox") {
                return (
                  <label
                    key={f.name}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Checkbox {...register(path)} />
                    {f.label}
                  </label>
                );
              }
              if (f.type === "textarea") {
                return (
                  <div key={f.name} className="sm:col-span-2 space-y-1">
                    <Label className="text-xs text-zinc-500">{f.label}</Label>
                    <Textarea
                      {...register(path)}
                      placeholder={f.placeholder}
                      rows={2}
                    />
                  </div>
                );
              }
              return (
                <div key={f.name} className="space-y-1">
                  <Label className="text-xs text-zinc-500">{f.label}</Label>
                  <Input
                    type={f.type === "number" ? "number" : "text"}
                    step={f.type === "number" ? "any" : undefined}
                    {...register(path)}
                    placeholder={f.placeholder}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Plain string[] fields stored as newline-separated text in the form,
// split/joined at the load/submit boundary.
function StringListField({
  register,
  name,
  label,
  placeholder,
}: {
  register: UseFormRegister<FormValues>;
  name: FieldPath<FormValues>;
  label: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-zinc-500">{label} (one per line)</Label>
      <Textarea {...register(name)} placeholder={placeholder} rows={3} />
    </div>
  );
}

// Small controlled field for the logo upload. MediaUpload itself is
// upload-only (label / accept / onUploaded) and stays unchanged — this
// wrapper is what makes it play nicely with react-hook-form by writing
// the uploaded URL into `identity.logoUrl` via useController instead of
// the old raw-DOM `document.querySelector` hack.
function LogoUploadField({ control }: { control: Control<FormValues> }) {
  const { field } = useController({ control, name: "identity.logoUrl" });

  return (
    <div className="space-y-2">
      <MediaUpload
        label="Business logo"
        accept="image/*"
        onUploaded={(url) => field.onChange(url)}
      />
      {field.value && (
        <p className="truncate text-xs text-zinc-500">
          Current: <span className="break-all">{field.value}</span>
        </p>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------
// Convert loaded plan doc -> form values (strings for all numbers,
// newline-joined for string arrays, safe fallbacks for every field).
// `BusinessPlanDoc` comes straight from Convex's own generated return
// type for the query, so this stays in sync with the schema automatically
// instead of accepting `plan: any`.
// -----------------------------------------------------------------------
type BusinessPlanDoc = NonNullable<
  FunctionReturnType<typeof api.businessPlans.getPlan>
>;

function n(v: number | undefined | null): string {
  return v === undefined || v === null ? "" : String(v);
}
function lines(arr: string[] | undefined): string {
  return (arr ?? []).join("\n");
}
function rows<T, R extends Row>(
  arr: T[] | undefined,
  mapRow: (item: T) => R,
): R[] {
  return (arr ?? []).map(mapRow);
}

function planToFormValues(plan: BusinessPlanDoc): FormValues {
  return {
    title: plan.title ?? "",
    identity: {
      businessName: plan.identity?.businessName ?? "",
      tradingName: plan.identity?.tradingName ?? "",
      legalStructure: plan.identity?.legalStructure ?? "",
      registrationDate: plan.identity?.registrationDate ?? "",
      registrationNumber: plan.identity?.registrationNumber ?? "",
      physicalAddress: plan.identity?.physicalAddress ?? "",
      mailingAddress: plan.identity?.mailingAddress ?? "",
      website: plan.identity?.website ?? "",
      phone: plan.identity?.phone ?? "",
      email: plan.identity?.email ?? "",
      socialLinks: rows(plan.identity?.socialLinks, (s) => ({
        label: s.label ?? "",
        url: s.url ?? "",
      })),
      logoUrl: plan.identity?.logoUrl ?? "",
      foundingYear: n(plan.identity?.foundingYear),
      stage: plan.identity?.stage ?? "",
      industry: plan.identity?.industry ?? "",
      industryCode: plan.identity?.industryCode ?? "",
      missionStatement: plan.identity?.missionStatement ?? "",
      visionStatement: plan.identity?.visionStatement ?? "",
      coreValues: lines(plan.identity?.coreValues),
      problemStatement: plan.identity?.problemStatement ?? "",
      uniqueValueProposition: plan.identity?.uniqueValueProposition ?? "",
      shortTermGoals: lines(plan.identity?.shortTermGoals),
      mediumTermGoals: lines(plan.identity?.mediumTermGoals),
      longTermGoals: lines(plan.identity?.longTermGoals),
      exitStrategy: plan.identity?.exitStrategy ?? "",
    },
    team: {
      owners: rows(plan.team?.owners, (o) => ({
        name: o.name ?? "",
        ownershipPercent: n(o.ownershipPercent),
        role: o.role ?? "",
        bio: o.bio ?? "",
      })),
      managementTeam: rows(plan.team?.managementTeam, (m) => ({
        name: m.name ?? "",
        title: m.title ?? "",
        responsibilities: m.responsibilities ?? "",
        experience: m.experience ?? "",
      })),
      orgStructureDescription: plan.team?.orgStructureDescription ?? "",
      plannedHires: rows(plan.team?.plannedHires, (h) => ({
        role: h.role ?? "",
        count: n(h.count),
        timeline: h.timeline ?? "",
        annualSalary: n(h.annualSalary),
      })),
      advisors: rows(plan.team?.advisors, (a) => ({
        name: a.name ?? "",
        role: a.role ?? "",
      })),
      keyPartnerships: rows(plan.team?.keyPartnerships, (p) => ({
        name: p.name ?? "",
        description: p.description ?? "",
      })),
      licensesAndPermits: lines(plan.team?.licensesAndPermits),
      intellectualProperty: rows(plan.team?.intellectualProperty, (ip) => ({
        type: ip.type ?? "",
        description: ip.description ?? "",
      })),
    },
    offerings: {
      products: rows(plan.offerings?.products, (p) => ({
        name: p.name ?? "",
        description: p.description ?? "",
        features: p.features ?? "",
        price: n(p.price),
        pricingNotes: p.pricingNotes ?? "",
        developmentStage: p.developmentStage ?? "",
      })),
      productionProcess: plan.offerings?.productionProcess ?? "",
      inventoryRequirements: plan.offerings?.inventoryRequirements ?? "",
      qualityControl: plan.offerings?.qualityControl ?? "",
      roadmap: lines(plan.offerings?.roadmap),
    },
    market: {
      targetDemographics: plan.market?.targetDemographics ?? "",
      targetGeography: plan.market?.targetGeography ?? "",
      customerNeeds: plan.market?.customerNeeds ?? "",
      tam: n(plan.market?.tam),
      sam: n(plan.market?.sam),
      som: n(plan.market?.som),
      marketSizeSource: plan.market?.marketSizeSource ?? "",
      marketTrends: plan.market?.marketTrends ?? "",
      competitors: rows(plan.market?.competitors, (c) => ({
        name: c.name ?? "",
        strengths: c.strengths ?? "",
        weaknesses: c.weaknesses ?? "",
        marketSharePercent: n(c.marketSharePercent),
        pricing: c.pricing ?? "",
        differentiation: c.differentiation ?? "",
      })),
      swotStrengths: lines(plan.market?.swotStrengths),
      swotWeaknesses: lines(plan.market?.swotWeaknesses),
      swotOpportunities: lines(plan.market?.swotOpportunities),
      swotThreats: lines(plan.market?.swotThreats),
      barriersToEntry: plan.market?.barriersToEntry ?? "",
      regulatoryNotes: plan.market?.regulatoryNotes ?? "",
      seasonalFactors: plan.market?.seasonalFactors ?? "",
    },
    marketingSales: {
      channels: lines(plan.marketingSales?.channels),
      salesStrategy: plan.marketingSales?.salesStrategy ?? "",
      cac: n(plan.marketingSales?.cac),
      ltv: n(plan.marketingSales?.ltv),
      branding: plan.marketingSales?.branding ?? "",
      salesTargets: plan.marketingSales?.salesTargets ?? "",
      distributionChannels: lines(plan.marketingSales?.distributionChannels),
      retentionPlans: plan.marketingSales?.retentionPlans ?? "",
      marketingBudgetAllocation: rows(
        plan.marketingSales?.marketingBudgetAllocation,
        (b) => ({
          channel: b.channel ?? "",
          percentOfBudget: n(b.percentOfBudget),
        }),
      ),
    },
    operations: {
      locations: lines(plan.operations?.locations),
      facilitiesNotes: plan.operations?.facilitiesNotes ?? "",
      equipment: rows(plan.operations?.equipment, (e) => ({
        item: e.item ?? "",
        cost: n(e.cost),
        ownedOrLeased: e.ownedOrLeased ?? "",
      })),
      suppliers: lines(plan.operations?.suppliers),
      productionCapacityNotes: plan.operations?.productionCapacityNotes ?? "",
      logisticsNotes: plan.operations?.logisticsNotes ?? "",
      techStack: lines(plan.operations?.techStack),
      hoursOfOperation: plan.operations?.hoursOfOperation ?? "",
      scalabilityPlans: plan.operations?.scalabilityPlans ?? "",
      operationalRisks: rows(plan.operations?.operationalRisks, (r) => ({
        risk: r.risk ?? "",
        mitigation: r.mitigation ?? "",
      })),
    },
    funding: {
      fundingSources: rows(plan.funding?.fundingSources, (s) => ({
        source: s.source ?? "",
        amount: n(s.amount),
        terms: s.terms ?? "",
      })),
      fundingRequestAmount: n(plan.funding?.fundingRequestAmount),
      equityOffered: plan.funding?.equityOffered ?? "",
      debtTerms: plan.funding?.debtTerms ?? "",
      collateral: plan.funding?.collateral ?? "",
      startupCosts: rows(plan.funding?.startupCosts, (c) => ({
        category: c.category ?? "",
        amount: n(c.amount),
      })),
    },
    financials: {
      monthlySalesVolume: n(plan.financials?.monthlySalesVolume),
      avgSellingPrice: n(plan.financials?.avgSellingPrice),
      revenueStreams: rows(plan.financials?.revenueStreams, (r) => ({
        name: r.name ?? "",
        percentOfRevenue: n(r.percentOfRevenue),
      })),
      monthlyGrowthRatePercent: n(plan.financials?.monthlyGrowthRatePercent),
      seasonalityNotes: plan.financials?.seasonalityNotes ?? "",
      churnRatePercent: n(plan.financials?.churnRatePercent),
      materialCostPerUnit: n(plan.financials?.materialCostPerUnit),
      directLaborPerUnit: n(plan.financials?.directLaborPerUnit),
      shippingCostPerUnit: n(plan.financials?.shippingCostPerUnit),
      otherVariableCostPerUnit: n(plan.financials?.otherVariableCostPerUnit),
      operatingExpenses: rows(plan.financials?.operatingExpenses, (e) => ({
        category: e.category ?? "",
        monthlyAmount: n(e.monthlyAmount),
        isFixed: !!e.isFixed,
      })),
      openingCashBalance: n(plan.financials?.openingCashBalance),
      loans: rows(plan.financials?.loans, (l) => ({
        principal: n(l.principal),
        annualInterestRatePercent: n(l.annualInterestRatePercent),
        termMonths: n(l.termMonths),
      })),
      taxRatePercent: n(plan.financials?.taxRatePercent),
      inflationRatePercent: n(plan.financials?.inflationRatePercent) || "12",
      projectionHorizonMonths:
        n(plan.financials?.projectionHorizonMonths) || "12",
      scenario: plan.financials?.scenario ?? "base",
    },
    kpis: {
      grossMarginTargetPercent: n(plan.kpis?.grossMarginTargetPercent),
      netMarginTargetPercent: n(plan.kpis?.netMarginTargetPercent),
      roiTargetPercent: n(plan.kpis?.roiTargetPercent),
      paybackPeriodTargetMonths: n(plan.kpis?.paybackPeriodTargetMonths),
      assumptions: lines(plan.kpis?.assumptions),
      riskFactors: rows(plan.kpis?.riskFactors, (r) => ({
        risk: r.risk ?? "",
        mitigation: r.mitigation ?? "",
      })),
    },
    appendix: {
      historicalFinancialsNotes: plan.appendix?.historicalFinancialsNotes ?? "",
      marketResearchSources: lines(plan.appendix?.marketResearchSources),
      attachments: rows(plan.appendix?.attachments, (a) => ({
        label: a.label ?? "",
        url: a.url ?? "",
      })),
      milestones: rows(plan.appendix?.milestones, (m) => ({
        title: m.title ?? "",
        date: m.date ?? "",
        owner: m.owner ?? "",
      })),
      freeNotes: plan.appendix?.freeNotes ?? "",
    },
  };
}

// -----------------------------------------------------------------------
// Convert form values -> upsertPlan args (parse numbers, split lines,
// drop empty optional strings so the mutation stores clean data).
// -----------------------------------------------------------------------
function toNum(v: string): number | undefined {
  if (v === undefined || v === null || v.trim() === "") return undefined;
  const parsed = Number(v);
  return Number.isNaN(parsed) ? undefined : parsed;
}
function toNumRequired(v: string): number {
  return toNum(v) ?? 0;
}
function toLines(v: string): string[] {
  return v
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
function opt(v: string): string | undefined {
  return v.trim() === "" ? undefined : v;
}
// Narrows an already-validated form string down to one of the schema's
// literal unions (e.g. "llc" -> LegalStructure). The <select> elements
// only ever emit one of the listed <option value="..."> strings (or ""),
// so this reflects a real invariant rather than papering over one with
// `any` — but note it's still an assertion, not a runtime check. If the
// <option> values and the schema's validator union ever drift apart,
// this won't catch it.
function asLiteral<T extends string>(v: string | undefined): T | undefined {
  return v as T | undefined;
}

// The shape Convex's `upsertPlan` mutation actually accepts, taken
// straight from the generated API types (minus the id/flag args, which
// are added at the call site). Using this instead of `any` means a
// mismatch between this form and the schema shows up as a real
// type error here rather than silently at runtime.
type UpsertPlanArgs = FunctionArgs<typeof api.businessPlans.upsertPlan>;
type PlanFields = Omit<UpsertPlanArgs, "planId" | "preserveStatus">;

function formValuesToPlanFields(values: FormValues): PlanFields {
  return {
    title: values.title || values.identity.businessName || "Untitled Plan",
    identity: {
      businessName: values.identity.businessName,
      tradingName: opt(values.identity.tradingName),
      legalStructure: asLiteral<LegalStructure>(
        opt(values.identity.legalStructure),
      ),
      registrationDate: opt(values.identity.registrationDate),
      registrationNumber: opt(values.identity.registrationNumber),
      physicalAddress: opt(values.identity.physicalAddress),
      mailingAddress: opt(values.identity.mailingAddress),
      website: opt(values.identity.website),
      phone: opt(values.identity.phone),
      email: opt(values.identity.email),
      socialLinks: values.identity.socialLinks.map((s) => ({
        label: String(s.label ?? ""),
        url: String(s.url ?? ""),
      })),
      logoUrl: opt(values.identity.logoUrl),
      foundingYear: toNum(values.identity.foundingYear),
      stage: asLiteral<Stage>(opt(values.identity.stage)),
      industry: opt(values.identity.industry),
      industryCode: opt(values.identity.industryCode),
      missionStatement: opt(values.identity.missionStatement),
      visionStatement: opt(values.identity.visionStatement),
      coreValues: toLines(values.identity.coreValues),
      problemStatement: opt(values.identity.problemStatement),
      uniqueValueProposition: opt(values.identity.uniqueValueProposition),
      shortTermGoals: toLines(values.identity.shortTermGoals),
      mediumTermGoals: toLines(values.identity.mediumTermGoals),
      longTermGoals: toLines(values.identity.longTermGoals),
      exitStrategy: opt(values.identity.exitStrategy),
    },
    team: {
      owners: values.team.owners.map((o) => ({
        name: String(o.name ?? ""),
        ownershipPercent: toNum(String(o.ownershipPercent ?? "")),
        role: opt(String(o.role ?? "")),
        bio: opt(String(o.bio ?? "")),
      })),
      managementTeam: values.team.managementTeam.map((m) => ({
        name: String(m.name ?? ""),
        title: String(m.title ?? ""),
        responsibilities: opt(String(m.responsibilities ?? "")),
        experience: opt(String(m.experience ?? "")),
      })),
      orgStructureDescription: opt(values.team.orgStructureDescription),
      plannedHires: values.team.plannedHires.map((h) => ({
        role: String(h.role ?? ""),
        count: toNumRequired(String(h.count ?? "")),
        timeline: opt(String(h.timeline ?? "")),
        annualSalary: toNum(String(h.annualSalary ?? "")),
      })),
      advisors: values.team.advisors.map((a) => ({
        name: String(a.name ?? ""),
        role: opt(String(a.role ?? "")),
      })),
      keyPartnerships: values.team.keyPartnerships.map((p) => ({
        name: String(p.name ?? ""),
        description: opt(String(p.description ?? "")),
      })),
      licensesAndPermits: toLines(values.team.licensesAndPermits),
      intellectualProperty: values.team.intellectualProperty.map((ip) => ({
        type: String(ip.type ?? ""),
        description: String(ip.description ?? ""),
      })),
    },
    offerings: {
      products: values.offerings.products.map((p) => ({
        name: String(p.name ?? ""),
        description: String(p.description ?? ""),
        features: opt(String(p.features ?? "")),
        price: toNum(String(p.price ?? "")),
        pricingNotes: opt(String(p.pricingNotes ?? "")),
        developmentStage: opt(String(p.developmentStage ?? "")),
      })),
      productionProcess: opt(values.offerings.productionProcess),
      inventoryRequirements: opt(values.offerings.inventoryRequirements),
      qualityControl: opt(values.offerings.qualityControl),
      roadmap: toLines(values.offerings.roadmap),
    },
    market: {
      targetDemographics: opt(values.market.targetDemographics),
      targetGeography: opt(values.market.targetGeography),
      customerNeeds: opt(values.market.customerNeeds),
      tam: toNum(values.market.tam),
      sam: toNum(values.market.sam),
      som: toNum(values.market.som),
      marketSizeSource: opt(values.market.marketSizeSource),
      marketTrends: opt(values.market.marketTrends),
      competitors: values.market.competitors.map((c) => ({
        name: String(c.name ?? ""),
        strengths: opt(String(c.strengths ?? "")),
        weaknesses: opt(String(c.weaknesses ?? "")),
        marketSharePercent: toNum(String(c.marketSharePercent ?? "")),
        pricing: opt(String(c.pricing ?? "")),
        differentiation: opt(String(c.differentiation ?? "")),
      })),
      swotStrengths: toLines(values.market.swotStrengths),
      swotWeaknesses: toLines(values.market.swotWeaknesses),
      swotOpportunities: toLines(values.market.swotOpportunities),
      swotThreats: toLines(values.market.swotThreats),
      barriersToEntry: opt(values.market.barriersToEntry),
      regulatoryNotes: opt(values.market.regulatoryNotes),
      seasonalFactors: opt(values.market.seasonalFactors),
    },
    marketingSales: {
      channels: toLines(values.marketingSales.channels),
      salesStrategy: opt(values.marketingSales.salesStrategy),
      cac: toNum(values.marketingSales.cac),
      ltv: toNum(values.marketingSales.ltv),
      branding: opt(values.marketingSales.branding),
      salesTargets: opt(values.marketingSales.salesTargets),
      distributionChannels: toLines(values.marketingSales.distributionChannels),
      retentionPlans: opt(values.marketingSales.retentionPlans),
      marketingBudgetAllocation:
        values.marketingSales.marketingBudgetAllocation.map((b) => ({
          channel: String(b.channel ?? ""),
          percentOfBudget: toNumRequired(String(b.percentOfBudget ?? "")),
        })),
    },
    operations: {
      locations: toLines(values.operations.locations),
      facilitiesNotes: opt(values.operations.facilitiesNotes),
      equipment: values.operations.equipment.map((e) => ({
        item: String(e.item ?? ""),
        cost: toNum(String(e.cost ?? "")),
        ownedOrLeased: opt(String(e.ownedOrLeased ?? "")),
      })),
      suppliers: toLines(values.operations.suppliers),
      productionCapacityNotes: opt(values.operations.productionCapacityNotes),
      logisticsNotes: opt(values.operations.logisticsNotes),
      techStack: toLines(values.operations.techStack),
      hoursOfOperation: opt(values.operations.hoursOfOperation),
      scalabilityPlans: opt(values.operations.scalabilityPlans),
      operationalRisks: values.operations.operationalRisks.map((r) => ({
        risk: String(r.risk ?? ""),
        mitigation: opt(String(r.mitigation ?? "")),
      })),
    },
    funding: {
      fundingSources: values.funding.fundingSources.map((s) => ({
        source: String(s.source ?? ""),
        amount: toNumRequired(String(s.amount ?? "")),
        terms: opt(String(s.terms ?? "")),
      })),
      fundingRequestAmount: toNum(values.funding.fundingRequestAmount),
      equityOffered: opt(values.funding.equityOffered),
      debtTerms: opt(values.funding.debtTerms),
      collateral: opt(values.funding.collateral),
      startupCosts: values.funding.startupCosts.map((c) => ({
        category: String(c.category ?? ""),
        amount: toNumRequired(String(c.amount ?? "")),
      })),
    },
    financials: {
      monthlySalesVolume: toNum(values.financials.monthlySalesVolume),
      avgSellingPrice: toNum(values.financials.avgSellingPrice),
      revenueStreams: values.financials.revenueStreams.map((r) => ({
        name: String(r.name ?? ""),
        percentOfRevenue: toNumRequired(String(r.percentOfRevenue ?? "")),
      })),
      monthlyGrowthRatePercent: toNum(
        values.financials.monthlyGrowthRatePercent,
      ),
      seasonalityNotes: opt(values.financials.seasonalityNotes),
      churnRatePercent: toNum(values.financials.churnRatePercent),
      materialCostPerUnit: toNum(values.financials.materialCostPerUnit),
      directLaborPerUnit: toNum(values.financials.directLaborPerUnit),
      shippingCostPerUnit: toNum(values.financials.shippingCostPerUnit),
      otherVariableCostPerUnit: toNum(
        values.financials.otherVariableCostPerUnit,
      ),
      operatingExpenses: values.financials.operatingExpenses.map((e) => ({
        category: String(e.category ?? ""),
        monthlyAmount: toNumRequired(String(e.monthlyAmount ?? "")),
        isFixed: !!e.isFixed,
      })),
      openingCashBalance: toNum(values.financials.openingCashBalance),
      loans: values.financials.loans.map((l) => ({
        principal: toNumRequired(String(l.principal ?? "")),
        annualInterestRatePercent: toNumRequired(
          String(l.annualInterestRatePercent ?? ""),
        ),
        termMonths: toNumRequired(String(l.termMonths ?? "")),
      })),
      taxRatePercent: toNum(values.financials.taxRatePercent),
      inflationRatePercent: toNum(values.financials.inflationRatePercent),
      projectionHorizonMonths: toNum(values.financials.projectionHorizonMonths),
      scenario: asLiteral<Scenario>(opt(values.financials.scenario)) ?? "base",
    },
    kpis: {
      grossMarginTargetPercent: toNum(values.kpis.grossMarginTargetPercent),
      netMarginTargetPercent: toNum(values.kpis.netMarginTargetPercent),
      roiTargetPercent: toNum(values.kpis.roiTargetPercent),
      paybackPeriodTargetMonths: toNum(values.kpis.paybackPeriodTargetMonths),
      assumptions: toLines(values.kpis.assumptions),
      riskFactors: values.kpis.riskFactors.map((r) => ({
        risk: String(r.risk ?? ""),
        mitigation: opt(String(r.mitigation ?? "")),
      })),
    },
    appendix: {
      historicalFinancialsNotes: opt(values.appendix.historicalFinancialsNotes),
      marketResearchSources: toLines(values.appendix.marketResearchSources),
      attachments: values.appendix.attachments.map((a) => ({
        label: String(a.label ?? ""),
        url: String(a.url ?? ""),
      })),
      milestones: values.appendix.milestones.map((m) => ({
        title: String(m.title ?? ""),
        date: opt(String(m.date ?? "")),
        owner: opt(String(m.owner ?? "")),
      })),
      freeNotes: opt(values.appendix.freeNotes),
    },
  };
}

// -----------------------------------------------------------------------
// Main form
// -----------------------------------------------------------------------
function CreateBusinessPlanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawPlanId = searchParams.get("planId");
  const planId =
    rawPlanId && rawPlanId.length > 0
      ? (rawPlanId as Id<"businessPlans">)
      : null;
  const isEditing = !!planId;

  const existingPlan = useQuery(
    api.businessPlans.getPlan,
    planId ? { planId } : "skip",
  );
  const upsertPlan = useMutation(api.businessPlans.upsertPlan);
  // NOTE: convex/ai.ts and its `generatePlan` action don't exist yet — this
  // is the "biggest remaining piece of work" item from the plan. Once that
  // file exports `generatePlan`, Convex codegen will type `api.ai.generatePlan`
  // automatically and this line just works with zero cast. Left uncast on
  // purpose (rather than `(api as any).ai.generatePlan`) so it surfaces as a
  // real, honest compile error until that action is written.
  const generatePlan = useAction(api.ai.generatePlan);

  const [submitting, setSubmitting] = useState<"draft" | "generate" | null>(
    null,
  );
  const { control, register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: EMPTY_DEFAULTS,
  });

  useEffect(() => {
    if (!existingPlan) return;
    reset(planToFormValues(existingPlan));
  }, [existingPlan, reset]);

  async function persist(values: FormValues, preserveStatus: boolean) {
    const fields = formValuesToPlanFields(values);
    const savedId = await upsertPlan({
      planId: planId ?? undefined,
      preserveStatus,
      ...fields,
    });
    return savedId;
  }

  async function onSaveDraft(values: FormValues) {
    setSubmitting("draft");
    try {
      const savedId = await persist(values, true);
      toast.success("Draft saved");
      if (!isEditing) router.replace(`/dashboard/create?planId=${savedId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save draft");
    } finally {
      setSubmitting(null);
    }
  }

  async function onGenerate(values: FormValues) {
    setSubmitting("generate");
    try {
      const savedId = await persist(values, false);
      await generatePlan({ planId: savedId });
      toast.success("Generating your business plan…");
      router.push(`/dashboard/plans/${savedId}/history`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to generate plan",
      );
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <form className="mx-auto max-w-4xl space-y-6 pb-24">
      <div className={SECTION_CLASS}>
        <Label className="text-xs text-zinc-500">
          Plan title (internal label)
        </Label>
        <Input {...register("title")} placeholder="e.g. Coffee Shop — v2" />
      </div>

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="grid grid-cols-5 gap-1 sm:grid-cols-10">
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="offerings">Offerings</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="marketingSales">Marketing</TabsTrigger>
          <TabsTrigger value="operations">Ops</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="appendix">Appendix</TabsTrigger>
        </TabsList>

        {/* 1. Identity ---------------------------------------------------- */}
        <TabsContent value="identity" className={SECTION_CLASS}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Business name *</Label>
              <Input {...register("identity.businessName")} required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Trading name / DBA
              </Label>
              <Input {...register("identity.tradingName")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Legal structure</Label>
              <select
                {...register("identity.legalStructure")}
                className="w-full rounded-md border border-zinc-900/10 bg-transparent p-2 text-sm dark:border-white/10"
              >
                <option value="">—</option>
                <option value="sole_proprietorship">Sole proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="llc">LLC</option>
                <option value="corporation">Corporation</option>
                <option value="nonprofit">Nonprofit</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Stage</Label>
              <select
                {...register("identity.stage")}
                className="w-full rounded-md border border-zinc-900/10 bg-transparent p-2 text-sm dark:border-white/10"
              >
                <option value="">—</option>
                <option value="idea">Idea</option>
                <option value="pre_revenue">Pre-revenue</option>
                <option value="startup">Startup</option>
                <option value="growth">Growth</option>
                <option value="established">Established</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Registration date</Label>
              <Input type="date" {...register("identity.registrationDate")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Registration number
              </Label>
              <Input {...register("identity.registrationNumber")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Physical address</Label>
              <Input {...register("identity.physicalAddress")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Mailing address</Label>
              <Input {...register("identity.mailingAddress")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Website</Label>
              <Input {...register("identity.website")} placeholder="https://" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Phone</Label>
              <Input {...register("identity.phone")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Email</Label>
              <Input type="email" {...register("identity.email")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Founding year</Label>
              <Input type="number" {...register("identity.foundingYear")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Industry</Label>
              <Input {...register("identity.industry")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                NAICS / industry code
              </Label>
              <Input {...register("identity.industryCode")} />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Logo</Label>
            <LogoUploadField control={control} />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Mission statement</Label>
            <Textarea {...register("identity.missionStatement")} rows={2} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Vision statement</Label>
            <Textarea {...register("identity.visionStatement")} rows={2} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">
              Problem the business solves
            </Label>
            <Textarea {...register("identity.problemStatement")} rows={2} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">
              Unique value proposition
            </Label>
            <Textarea
              {...register("identity.uniqueValueProposition")}
              rows={2}
            />
          </div>

          <StringListField
            register={register}
            name="identity.coreValues"
            label="Core values"
          />
          <StringListField
            register={register}
            name="identity.shortTermGoals"
            label="Short-term goals (~1yr)"
          />
          <StringListField
            register={register}
            name="identity.mediumTermGoals"
            label="Medium-term goals (~3yr)"
          />
          <StringListField
            register={register}
            name="identity.longTermGoals"
            label="Long-term goals (5yr+)"
          />

          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Exit strategy</Label>
            <Textarea {...register("identity.exitStrategy")} rows={2} />
          </div>

          <RepeatingSection
            control={control}
            register={register}
            name="identity.socialLinks"
            title="Social / brand links"
            addLabel="Add link"
            fields={[
              { name: "label", label: "Label", type: "text" },
              { name: "url", label: "URL", type: "text" },
            ]}
          />
        </TabsContent>

        {/* 2. Team --------------------------------------------------------- */}
        <TabsContent value="team" className={SECTION_CLASS}>
          <RepeatingSection
            control={control}
            register={register}
            name="team.owners"
            title="Owners / founders"
            addLabel="Add owner"
            fields={[
              { name: "name", label: "Name", type: "text" },
              {
                name: "ownershipPercent",
                label: "Ownership %",
                type: "number",
              },
              { name: "role", label: "Role", type: "text" },
              { name: "bio", label: "Bio / experience", type: "textarea" },
            ]}
          />
          <RepeatingSection
            control={control}
            register={register}
            name="team.managementTeam"
            title="Management team"
            addLabel="Add member"
            fields={[
              { name: "name", label: "Name", type: "text" },
              { name: "title", label: "Title", type: "text" },
              {
                name: "responsibilities",
                label: "Responsibilities",
                type: "textarea",
              },
              {
                name: "experience",
                label: "Relevant experience",
                type: "textarea",
              },
            ]}
          />
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">
              Org structure description
            </Label>
            <Textarea {...register("team.orgStructureDescription")} rows={2} />
          </div>
          <RepeatingSection
            control={control}
            register={register}
            name="team.plannedHires"
            title="Planned hires"
            addLabel="Add role"
            fields={[
              { name: "role", label: "Role", type: "text" },
              { name: "count", label: "Count", type: "number" },
              { name: "timeline", label: "Timeline", type: "text" },
              { name: "annualSalary", label: "Annual salary", type: "number" },
            ]}
          />
          <RepeatingSection
            control={control}
            register={register}
            name="team.advisors"
            title="Advisors / board members"
            addLabel="Add advisor"
            fields={[
              { name: "name", label: "Name", type: "text" },
              { name: "role", label: "Role", type: "text" },
            ]}
          />
          <RepeatingSection
            control={control}
            register={register}
            name="team.keyPartnerships"
            title="Key partnerships / suppliers"
            addLabel="Add partnership"
            fields={[
              { name: "name", label: "Name", type: "text" },
              { name: "description", label: "Description", type: "textarea" },
            ]}
          />
          <StringListField
            register={register}
            name="team.licensesAndPermits"
            label="Licenses & permits"
          />
          <RepeatingSection
            control={control}
            register={register}
            name="team.intellectualProperty"
            title="Intellectual property"
            addLabel="Add IP"
            fields={[
              {
                name: "type",
                label: "Type (patent/trademark/...)",
                type: "text",
              },
              { name: "description", label: "Description", type: "textarea" },
            ]}
          />
        </TabsContent>

        {/* 3. Offerings ------------------------------------------------------ */}
        <TabsContent value="offerings" className={SECTION_CLASS}>
          <RepeatingSection
            control={control}
            register={register}
            name="offerings.products"
            title="Products / services"
            addLabel="Add product"
            fields={[
              { name: "name", label: "Name", type: "text" },
              { name: "description", label: "Description", type: "textarea" },
              { name: "features", label: "Features / USPs", type: "textarea" },
              { name: "price", label: "Price", type: "number" },
              {
                name: "pricingNotes",
                label: "Pricing notes (tiers/discounts)",
                type: "textarea",
              },
              {
                name: "developmentStage",
                label: "Development stage",
                type: "text",
              },
            ]}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Production / delivery process
              </Label>
              <Textarea {...register("offerings.productionProcess")} rows={2} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Inventory requirements
              </Label>
              <Textarea
                {...register("offerings.inventoryRequirements")}
                rows={2}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Quality control / standards
              </Label>
              <Textarea {...register("offerings.qualityControl")} rows={2} />
            </div>
          </div>
          <StringListField
            register={register}
            name="offerings.roadmap"
            label="Future roadmap / planned expansions"
          />
        </TabsContent>

        {/* 4. Market ----------------------------------------------------- */}
        <TabsContent value="market" className={SECTION_CLASS}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-xs text-zinc-500">
                Target demographics / psychographics
              </Label>
              <Textarea {...register("market.targetDemographics")} rows={2} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Target geography</Label>
              <Input {...register("market.targetGeography")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Market size source
              </Label>
              <Input {...register("market.marketSizeSource")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">TAM ($)</Label>
              <Input type="number" {...register("market.tam")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">SAM ($)</Label>
              <Input type="number" {...register("market.sam")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">SOM ($)</Label>
              <Input type="number" {...register("market.som")} />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">
              Customer needs / pain points
            </Label>
            <Textarea {...register("market.customerNeeds")} rows={2} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">
              Market trends & growth rates
            </Label>
            <Textarea {...register("market.marketTrends")} rows={2} />
          </div>
          <RepeatingSection
            control={control}
            register={register}
            name="market.competitors"
            title="Competitors"
            addLabel="Add competitor"
            fields={[
              { name: "name", label: "Name", type: "text" },
              { name: "strengths", label: "Strengths", type: "textarea" },
              { name: "weaknesses", label: "Weaknesses", type: "textarea" },
              {
                name: "marketSharePercent",
                label: "Market share %",
                type: "number",
              },
              { name: "pricing", label: "Pricing", type: "text" },
              {
                name: "differentiation",
                label: "Differentiation",
                type: "textarea",
              },
            ]}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <StringListField
              register={register}
              name="market.swotStrengths"
              label="SWOT — Strengths"
            />
            <StringListField
              register={register}
              name="market.swotWeaknesses"
              label="SWOT — Weaknesses"
            />
            <StringListField
              register={register}
              name="market.swotOpportunities"
              label="SWOT — Opportunities"
            />
            <StringListField
              register={register}
              name="market.swotThreats"
              label="SWOT — Threats"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Barriers to entry</Label>
              <Textarea {...register("market.barriersToEntry")} rows={2} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Regulatory notes</Label>
              <Textarea {...register("market.regulatoryNotes")} rows={2} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Seasonal factors</Label>
              <Textarea {...register("market.seasonalFactors")} rows={2} />
            </div>
          </div>
        </TabsContent>

        {/* 5. Marketing & Sales -------------------------------------------- */}
        <TabsContent value="marketingSales" className={SECTION_CLASS}>
          <div className="grid gap-3 sm:grid-cols-2">
            <StringListField
              register={register}
              name="marketingSales.channels"
              label="Marketing channels"
            />
            <StringListField
              register={register}
              name="marketingSales.distributionChannels"
              label="Distribution channels / outlets"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">
              Sales strategy / process
            </Label>
            <Textarea {...register("marketingSales.salesStrategy")} rows={2} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Customer acquisition cost (CAC)
              </Label>
              <Input type="number" {...register("marketingSales.cac")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Customer lifetime value (LTV)
              </Label>
              <Input type="number" {...register("marketingSales.ltv")} />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">
              Branding & positioning
            </Label>
            <Textarea {...register("marketingSales.branding")} rows={2} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">
              Sales targets / conversion rates
            </Label>
            <Textarea {...register("marketingSales.salesTargets")} rows={2} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">
              Customer retention / loyalty plans
            </Label>
            <Textarea {...register("marketingSales.retentionPlans")} rows={2} />
          </div>
          <RepeatingSection
            control={control}
            register={register}
            name="marketingSales.marketingBudgetAllocation"
            title="Marketing budget allocation"
            addLabel="Add channel"
            fields={[
              { name: "channel", label: "Channel", type: "text" },
              { name: "percentOfBudget", label: "% of budget", type: "number" },
            ]}
          />
        </TabsContent>

        {/* 6. Operations --------------------------------------------------- */}
        <TabsContent value="operations" className={SECTION_CLASS}>
          <div className="grid gap-3 sm:grid-cols-2">
            <StringListField
              register={register}
              name="operations.locations"
              label="Locations (current & planned)"
            />
            <StringListField
              register={register}
              name="operations.suppliers"
              label="Suppliers"
            />
            <StringListField
              register={register}
              name="operations.techStack"
              label="Technology stack / software"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">
              Facilities notes (rent/lease terms, build-out)
            </Label>
            <Textarea {...register("operations.facilitiesNotes")} rows={2} />
          </div>
          <RepeatingSection
            control={control}
            register={register}
            name="operations.equipment"
            title="Equipment / technology needed"
            addLabel="Add item"
            fields={[
              { name: "item", label: "Item", type: "text" },
              { name: "cost", label: "Cost", type: "number" },
              { name: "ownedOrLeased", label: "Owned or leased", type: "text" },
            ]}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Production / service capacity notes
              </Label>
              <Textarea
                {...register("operations.productionCapacityNotes")}
                rows={2}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Logistics / shipping notes
              </Label>
              <Textarea {...register("operations.logisticsNotes")} rows={2} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Hours of operation
              </Label>
              <Input {...register("operations.hoursOfOperation")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Scalability plans</Label>
              <Textarea {...register("operations.scalabilityPlans")} rows={2} />
            </div>
          </div>
          <RepeatingSection
            control={control}
            register={register}
            name="operations.operationalRisks"
            title="Operational risks & contingencies"
            addLabel="Add risk"
            fields={[
              { name: "risk", label: "Risk", type: "text" },
              { name: "mitigation", label: "Mitigation", type: "textarea" },
            ]}
          />
        </TabsContent>

        {/* 7. Funding ------------------------------------------------------ */}
        <TabsContent value="funding" className={SECTION_CLASS}>
          <RepeatingSection
            control={control}
            register={register}
            name="funding.fundingSources"
            title="Funding sources"
            addLabel="Add source"
            fields={[
              {
                name: "source",
                label: "Source (personal/loan/investor/grant/crowdfunding)",
                type: "text",
              },
              { name: "amount", label: "Amount", type: "number" },
              { name: "terms", label: "Terms", type: "textarea" },
            ]}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Funding request amount
              </Label>
              <Input
                type="number"
                {...register("funding.fundingRequestAmount")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Equity offered</Label>
              <Input {...register("funding.equityOffered")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Debt terms</Label>
              <Input {...register("funding.debtTerms")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Collateral available
              </Label>
              <Input {...register("funding.collateral")} />
            </div>
          </div>
          <RepeatingSection
            control={control}
            register={register}
            name="funding.startupCosts"
            title="Startup costs by category"
            addLabel="Add cost"
            fields={[
              { name: "category", label: "Category", type: "text" },
              { name: "amount", label: "Amount", type: "number" },
            ]}
          />
        </TabsContent>

        {/* 8. Financials ----------------------------------------------------- */}
        <TabsContent value="financials" className={SECTION_CLASS}>
          <p className="text-sm text-zinc-500">
            These feed <code>calculateFinancials()</code> directly — the AI
            never computes these numbers.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Monthly sales volume (units)
              </Label>
              <Input
                type="number"
                {...register("financials.monthlySalesVolume")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Average selling price
              </Label>
              <Input
                type="number"
                {...register("financials.avgSellingPrice")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Monthly growth rate %
              </Label>
              <Input
                type="number"
                {...register("financials.monthlyGrowthRatePercent")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Churn rate %</Label>
              <Input
                type="number"
                {...register("financials.churnRatePercent")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Opening cash balance
              </Label>
              <Input
                type="number"
                {...register("financials.openingCashBalance")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Tax rate %</Label>
              <Input type="number" {...register("financials.taxRatePercent")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Inflation rate %</Label>
              <Input
                type="number"
                {...register("financials.inflationRatePercent")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Projection horizon (months)
              </Label>
              <Input
                type="number"
                {...register("financials.projectionHorizonMonths")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Scenario</Label>
              <select
                {...register("financials.scenario")}
                className="w-full rounded-md border border-zinc-900/10 bg-transparent p-2 text-sm dark:border-white/10"
              >
                <option value="base">Base</option>
                <option value="optimistic">Optimistic</option>
                <option value="pessimistic">Pessimistic</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Seasonality notes</Label>
            <Textarea {...register("financials.seasonalityNotes")} rows={2} />
          </div>

          <Label className="text-sm font-medium">
            Cost of goods sold (per unit)
          </Label>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Material cost</Label>
              <Input
                type="number"
                {...register("financials.materialCostPerUnit")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Direct labor</Label>
              <Input
                type="number"
                {...register("financials.directLaborPerUnit")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Shipping / fulfillment
              </Label>
              <Input
                type="number"
                {...register("financials.shippingCostPerUnit")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Other variable cost
              </Label>
              <Input
                type="number"
                {...register("financials.otherVariableCostPerUnit")}
              />
            </div>
          </div>

          <RepeatingSection
            control={control}
            register={register}
            name="financials.revenueStreams"
            title="Revenue streams"
            addLabel="Add stream"
            fields={[
              { name: "name", label: "Name", type: "text" },
              {
                name: "percentOfRevenue",
                label: "% of revenue",
                type: "number",
              },
            ]}
          />
          <RepeatingSection
            control={control}
            register={register}
            name="financials.operatingExpenses"
            title="Operating expenses (monthly)"
            addLabel="Add expense"
            fields={[
              { name: "category", label: "Category", type: "text" },
              {
                name: "monthlyAmount",
                label: "Monthly amount",
                type: "number",
              },
              {
                name: "isFixed",
                label: "Fixed (vs variable)",
                type: "checkbox",
              },
            ]}
          />
          <RepeatingSection
            control={control}
            register={register}
            name="financials.loans"
            title="Loans"
            addLabel="Add loan"
            fields={[
              { name: "principal", label: "Principal", type: "number" },
              {
                name: "annualInterestRatePercent",
                label: "Annual interest rate %",
                type: "number",
              },
              { name: "termMonths", label: "Term (months)", type: "number" },
            ]}
          />
        </TabsContent>

        {/* 9. KPIs ----------------------------------------------------------- */}
        <TabsContent value="kpis" className={SECTION_CLASS}>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Gross margin target %
              </Label>
              <Input
                type="number"
                {...register("kpis.grossMarginTargetPercent")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Net margin target %
              </Label>
              <Input
                type="number"
                {...register("kpis.netMarginTargetPercent")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">ROI target %</Label>
              <Input type="number" {...register("kpis.roiTargetPercent")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">
                Payback period target (months)
              </Label>
              <Input
                type="number"
                {...register("kpis.paybackPeriodTargetMonths")}
              />
            </div>
          </div>
          <StringListField
            register={register}
            name="kpis.assumptions"
            label="Explicit assumptions"
            placeholder={'e.g. "Assume 10% monthly growth after month 6"'}
          />
          <RepeatingSection
            control={control}
            register={register}
            name="kpis.riskFactors"
            title="Risk factors & mitigation"
            addLabel="Add risk"
            fields={[
              { name: "risk", label: "Risk", type: "text" },
              { name: "mitigation", label: "Mitigation", type: "textarea" },
            ]}
          />
        </TabsContent>

        {/* 10. Appendix -------------------------------------------------- */}
        <TabsContent value="appendix" className={SECTION_CLASS}>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">
              Historical financials notes
            </Label>
            <Textarea
              {...register("appendix.historicalFinancialsNotes")}
              rows={2}
            />
          </div>
          <StringListField
            register={register}
            name="appendix.marketResearchSources"
            label="Market research sources / citations"
          />
          <RepeatingSection
            control={control}
            register={register}
            name="appendix.attachments"
            title="Attachments (photos, floor plans, contracts...)"
            addLabel="Add attachment"
            fields={[
              { name: "label", label: "Label", type: "text" },
              { name: "url", label: "URL", type: "text" },
            ]}
          />
          <RepeatingSection
            control={control}
            register={register}
            name="appendix.milestones"
            title="Timeline / milestones"
            addLabel="Add milestone"
            fields={[
              { name: "title", label: "Milestone", type: "text" },
              { name: "date", label: "Date", type: "text" },
              { name: "owner", label: "Owner", type: "text" },
            ]}
          />
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">
              Free-text notes for the AI
            </Label>
            <Textarea {...register("appendix.freeNotes")} rows={3} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-4 flex justify-end gap-2 rounded-2xl border border-zinc-900/10 bg-white/90 p-3 backdrop-blur dark:border-white/10 dark:bg-zinc-950/90">
        <Button
          type="button"
          variant="outline"
          disabled={submitting !== null}
          onClick={handleSubmit((v) => onSaveDraft(v))}
        >
          {submitting === "draft" && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save draft
        </Button>
        <Button
          type="button"
          disabled={submitting !== null}
          onClick={handleSubmit((v) => onGenerate(v))}
        >
          {submitting === "generate" && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Generate plan
        </Button>
      </div>
    </form>
  );
}

export default function CreateBusinessPlanPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-sm text-zinc-500">Loading…</div>}
    >
      <CreateBusinessPlanForm />
    </Suspense>
  );
}
