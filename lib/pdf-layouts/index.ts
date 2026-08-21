// lib/pdf-layouts/index.ts

import type { ReactElement } from "react";
import type { PlanLayoutId } from "@/lib/layouts";
import type { PdfLayoutData } from "./types";

import { buildExecutiveFirstPdfDocument } from "./executive-first";
import { buildInvestorDeckPdfDocument } from "./investor-deck";
import { buildFinancialChartsPdfDocument } from "./financial-charts";
import { buildCoverBannerPdfDocument } from "./cover-banner";
import { buildMinimalCleanPdfDocument } from "./minimal-clean";

/**
 * One entry per PlanLayoutId — must stay in sync with LAYOUT_COMPONENTS
 * in components/plan-preview.tsx so the PDF always matches the web
 * preview for the same version.layout value.
 */
export const PDF_LAYOUT_BUILDERS: Record<
  PlanLayoutId,
  (data: PdfLayoutData) => ReactElement
> = {
  "executive-first": buildExecutiveFirstPdfDocument,
  "investor-deck": buildInvestorDeckPdfDocument,
  "cover-banner": buildCoverBannerPdfDocument,
  "minimal-clean": buildMinimalCleanPdfDocument,
  "financial-charts": buildFinancialChartsPdfDocument,
};
