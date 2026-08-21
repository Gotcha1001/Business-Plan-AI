// components/plan-version-edit-form.tsx
//
// TRANSFORMED FROM: components/cv-version-edit-form.tsx
//
// Deliberately narrower than the CV version of this form. The CV form
// edited two things at once: version-level generatedContent (via
// updateVersionContent) AND cv-level fields — personalInfo, testimonials,
// references, links, achievements — that live on the parent `cvs` row
// and are shared across every version (via upsertCv).
//
// The business-plan equivalent of that "shared, cv-level" data is
// businessPlans.identity — but that's the full multi-section creation
// wizard's output (business name, legal structure, mission/vision,
// goals, social links, etc.), not a handful of contact fields. Folding
// all of that into a "quick edit this version" form would turn this
// into a second copy of the create wizard, so it's left alone here.
// This form only edits what actually lives on businessPlanVersions:
// style, layout, and the 10 GeneratedPlanContent narrative sections —
// via updateVersionContent, which only ever patches the version row,
// never plan.status. (The CV form's upsertCv call needed a
// `preserveStatus: true` flag to avoid knocking cv.status back to
// "draft" and getting every version's preview stuck on "Generating...".
// Since this form never touches the plan row at all, that failure mode
// doesn't exist here — nothing to preserve.)
//
// If per-version editing of the identity/wizard fields turns out to be
// wanted later, that's a separate feature — likely its own "edit plan
// details" form, not an extension of this one.

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { GeneratedPlanContent } from "@/lib/plan-types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StyleSelect } from "@/app/components/style-select";
import { LayoutSelect } from "@/app/components/layout-select";
import { DEFAULT_PLAN_STYLE_ID } from "@/lib/styles";
import { getPlanLayoutMeta } from "@/lib/layouts";
import { toast } from "sonner";

// Same section-card look as app/(dashboard)/dashboard/create/page.tsx so the
// two forms feel like the same product.
const SECTION_CLASS =
  "space-y-3 rounded-2xl border border-zinc-900/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5";

const SECTION_FIELDS: {
  key: keyof GeneratedPlanContent;
  label: string;
  rows: number;
}[] = [
  { key: "executiveSummary", label: "Executive summary", rows: 5 },
  { key: "companyOverview", label: "Company overview", rows: 4 },
  { key: "productsAndServices", label: "Products & services", rows: 4 },
  { key: "marketAnalysis", label: "Market analysis", rows: 5 },
  { key: "marketingAndSalesPlan", label: "Marketing & sales plan", rows: 4 },
  { key: "operationsPlan", label: "Operations plan", rows: 4 },
  {
    key: "managementAndOrganization",
    label: "Management & organization",
    rows: 4,
  },
  { key: "fundingRequest", label: "Funding request", rows: 3 },
  { key: "financialPlanNarrative", label: "Financial plan narrative", rows: 5 },
  { key: "appendixNotes", label: "Appendix notes", rows: 3 },
];

type FormValues = {
  style: string;
  layout: string;
} & Record<keyof GeneratedPlanContent, string>;

export function PlanVersionEditForm({
  versionId,
  content,
  currentStyle,
  currentLayout,
  onSaved,
  onCancel,
}: {
  versionId: Id<"businessPlanVersions">;
  content: GeneratedPlanContent;
  currentStyle?: string;
  currentLayout?: string;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const updateVersionContent = useMutation(
    api.businessPlans.updateVersionContent,
  );
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      style: currentStyle ?? DEFAULT_PLAN_STYLE_ID,
      layout: getPlanLayoutMeta(currentLayout).id,
      executiveSummary: content.executiveSummary ?? "",
      companyOverview: content.companyOverview ?? "",
      productsAndServices: content.productsAndServices ?? "",
      marketAnalysis: content.marketAnalysis ?? "",
      marketingAndSalesPlan: content.marketingAndSalesPlan ?? "",
      operationsPlan: content.operationsPlan ?? "",
      managementAndOrganization: content.managementAndOrganization ?? "",
      fundingRequest: content.fundingRequest ?? "",
      financialPlanNarrative: content.financialPlanNarrative ?? "",
      appendixNotes: content.appendixNotes ?? "",
    },
  });

  const style = watch("style");
  const layout = watch("layout");

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      const merged: GeneratedPlanContent = {
        ...content,
        executiveSummary: values.executiveSummary,
        companyOverview: values.companyOverview,
        productsAndServices: values.productsAndServices,
        marketAnalysis: values.marketAnalysis,
        marketingAndSalesPlan: values.marketingAndSalesPlan,
        operationsPlan: values.operationsPlan,
        managementAndOrganization: values.managementAndOrganization,
        fundingRequest: values.fundingRequest,
        financialPlanNarrative: values.financialPlanNarrative,
        appendixNotes: values.appendixNotes,
      };
      // Same-row update: same versionId, no new row created.
      await updateVersionContent({
        versionId,
        generatedContent: merged,
        style: values.style,
        layout: values.layout,
      });
      toast.success("Version updated in place");
      onSaved();
    } catch {
      toast.error("Couldn't save — try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className={SECTION_CLASS}>
        <h2 className="font-[family-name:var(--font-display)] text-lg text-zinc-900 dark:text-white">
          Appearance
        </h2>
        <div>
          <Label className="text-zinc-900 dark:text-white">Color style</Label>
          <StyleSelect
            value={style}
            onValueChange={(id) => setValue("style", id, { shouldDirty: true })}
          />
        </div>
        <div>
          <Label className="text-zinc-900 dark:text-white">Layout</Label>
          <LayoutSelect
            value={layout}
            onValueChange={(id) =>
              setValue("layout", id, { shouldDirty: true })
            }
          />
        </div>
      </section>

      {SECTION_FIELDS.map(({ key, label, rows }) => (
        <section key={key} className={SECTION_CLASS}>
          <h2 className="font-[family-name:var(--font-display)] text-lg text-zinc-900 dark:text-white">
            {label}
          </h2>
          <Textarea rows={rows} {...register(key)} />
        </section>
      ))}

      <div className="flex gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={saving}
          className="flex-1 py-6 text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30"
        >
          {saving ? "Saving..." : "Save changes to this version"}
        </Button>
      </div>
    </form>
  );
}
