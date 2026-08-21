// components/plan-preview.tsx
//
// TRANSFORMED FROM: components/cv-preview.tsx
//
// Dropped the CV app's interlude-audio hook/toggle entirely -- it was a
// CV-specific presentation gimmick (ambient music while scrolling someone's
// resume) with no business-plan equivalent, and wasn't listed as something
// to keep or rewrite in the transform plan.
//
// executive-first, cover-banner, minimal-clean, and financial-charts all
// have real layout components now. investor-deck is still unwritten and
// falls back to executive-first until components/plan-layouts/investor-deck.tsx
// exists -- same append-only-versions story, just an incomplete layout
// registry rather than a missing version.

"use client";

import { motion } from "framer-motion";
import type { Doc } from "@/convex/_generated/dataModel";
import { getPlanLayoutMeta, type PlanLayoutId } from "@/lib/layouts";
import { ExecutiveFirstLayout } from "./plan-layouts/executive-first";
import { CoverBannerLayout } from "./plan-layouts/cover-banner";
import { MinimalCleanLayout } from "./plan-layouts/minimal-clean";
import { FinancialChartsLayout } from "./plan-layouts/financial-charts";
import type { PlanLayoutProps } from "./plan-layouts/types";
import { JSX } from "react";
import { InvestorDeckLayout } from "./plan-layouts/investor-deck";

const LAYOUT_COMPONENTS: Partial<
  Record<PlanLayoutId, (props: PlanLayoutProps) => JSX.Element>
> = {
  "executive-first": ExecutiveFirstLayout,
  "investor-deck": InvestorDeckLayout,
  "cover-banner": CoverBannerLayout,
  "minimal-clean": MinimalCleanLayout,
  "financial-charts": FinancialChartsLayout,
};

export function PlanAnimatedView({
  plan,
  version,
  pdfUrl,
}: {
  plan: Doc<"businessPlans">;
  version?: Doc<"businessPlanVersions"> | null;
  pdfUrl?: string;
}) {
  const { businessName } = plan.identity;
  const resolvedPdfUrl = pdfUrl ?? `/api/plan/${plan.shareId}/pdf`;

  if (plan.status === "generating" || plan.status === "draft" || !version) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="text-muted-foreground"
        >
          Generating {businessName}&apos;s business plan...
        </motion.div>
      </div>
    );
  }

  if (plan.status === "failed") {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-2">
        <p className="text-lg font-medium">
          Something went wrong generating this plan.
        </p>
        {plan.generationError && (
          <p className="text-sm text-muted-foreground">
            {plan.generationError}
          </p>
        )}
      </div>
    );
  }

  const layoutId = getPlanLayoutMeta(version.layout).id;
  const Layout = LAYOUT_COMPONENTS[layoutId] ?? ExecutiveFirstLayout;
  return <Layout plan={plan} version={version} pdfUrl={resolvedPdfUrl} />;
}
