// components/cv-layouts/types.ts
import type { Doc } from "@/convex/_generated/dataModel";

/**
 * Every web layout component (centered.tsx, sidebar-photo.tsx, ...)
 * takes exactly this prop shape. cv-preview.tsx does the data prep
 * once (via lib/cv-data.ts) and hands it down — no layout re-derives
 * `g` / testimonials / achievements itself, so they can't drift.
 *
 * `cv` is the base draft (personalInfo, interests, links, references,
 * shareId, status). `version` is the specific generation being shown
 * (generatedContent, style, layout) — a cv can have many versions.
 */
export interface CvLayoutProps {
  cv: Doc<"cvs">;
  version: Doc<"cvVersions">;
  pdfUrl: string;
}
