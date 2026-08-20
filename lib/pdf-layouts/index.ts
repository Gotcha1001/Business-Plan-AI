// lib/pdf-layouts/index.ts

import type { ReactElement } from "react";
import type { PlanLayoutId } from "@/lib/layouts";
import type { PdfLayoutData } from "./types";

import { buildExecutiveFirstPdfDocument } from "./executive-first";
import { buildFinancialChartsPdfDocument } from "./financial-charts";

/**
 * One entry per PlanLayoutId -- must stay in sync with LAYOUT_COMPONENTS
 * in components/plan-preview.tsx so the PDF always matches the web
 * preview for the same version.layout value.
 *
 * investor-deck, cover-banner, and minimal-clean don't have their own
 * PDF builders yet -- same story as the web registry, they fall back to
 * executive-first until lib/pdf-layouts/investor-deck.tsx,
 * cover-banner.tsx, and minimal-clean.tsx are written. Swap the
 * corresponding line below in as each one lands.
 */
export const PDF_LAYOUT_BUILDERS: Record<
  PlanLayoutId,
  (data: PdfLayoutData) => ReactElement
> = {
  "executive-first": buildExecutiveFirstPdfDocument,
  "investor-deck": buildExecutiveFirstPdfDocument, // TODO: buildInvestorDeckPdfDocument
  "cover-banner": buildExecutiveFirstPdfDocument, // TODO: buildCoverBannerPdfDocument
  "minimal-clean": buildExecutiveFirstPdfDocument, // TODO: buildMinimalCleanPdfDocument
  "financial-charts": buildFinancialChartsPdfDocument,
};
