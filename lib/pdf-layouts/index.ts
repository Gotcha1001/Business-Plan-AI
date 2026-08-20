// lib/pdf-layouts/index.ts
import type { ReactElement } from "react";
import type { CvLayoutId } from "@/lib/layouts";
import type { PdfLayoutData } from "./types";
import { buildCenteredPdfDocument } from "./centered";
import { buildSidebarPhotoPdfDocument } from "./sidebar-photo";
import { buildSplitBannerPdfDocument } from "./split-banner";
import { buildMinimalAtsPdfDocument } from "./minimal-ats";
import { buildGraphStatsPdfDocument } from "./graph-stats";

/**
 * One entry per CvLayoutId — must stay in sync with LAYOUT_COMPONENTS
 * in components/cv-preview.tsx so the PDF always matches the web
 * preview for the same cv.layout value.
 */
export const PDF_LAYOUT_BUILDERS: Record<
  CvLayoutId,
  (data: PdfLayoutData) => ReactElement
> = {
  centered: buildCenteredPdfDocument,
  "sidebar-photo": buildSidebarPhotoPdfDocument,
  "split-banner": buildSplitBannerPdfDocument,
  "minimal-ats": buildMinimalAtsPdfDocument,
  "graph-stats": buildGraphStatsPdfDocument,
};
