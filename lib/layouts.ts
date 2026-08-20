// export type CvLayoutId =
//   | "centered"
//   | "sidebar-photo"
//   | "split-banner"
//   | "minimal-ats"
//   | "graph-stats";

// export interface CvLayoutMeta {
//   id: CvLayoutId;
//   name: string;
//   description: string;
// }

// export const CV_LAYOUTS: CvLayoutMeta[] = [
//   {
//     id: "centered",
//     name: "Centered Hero",
//     description:
//       "Original layout — centered photo/name header, then a sidebar + main two-column body. Friendly and modern.",
//   },
//   {
//     id: "sidebar-photo",
//     name: "Sidebar Photo",
//     description:
//       "Full-height dark sidebar with photo, contact list and skill bars; content panel with a timeline experience section.",
//   },
//   {
//     id: "split-banner",
//     name: "Split Banner",
//     description:
//       "Bold full-width color banner header, then a flowing single-column body with left-accent timeline blocks.",
//   },
//   {
//     id: "minimal-ats",
//     name: "Minimal ATS",
//     description:
//       "Clean single-column, no decorative cards — optimized for readability and applicant-tracking-system parsing.",
//   },
//   {
//     id: "graph-stats",
//     name: "Graph Stats",
//     description:
//       "Animated skill-signal bar chart and experience-depth radar chart, plus the standard header/experience/education sections.",
//   },
// ];

// export const DEFAULT_CV_LAYOUT_ID: CvLayoutId = "centered";

// /** Look up a layout by id, falling back to the default when missing/unset. */
// export function getCvLayoutMeta(id?: string | null): CvLayoutMeta {
//   return (
//     CV_LAYOUTS.find((l) => l.id === id) ??
//     CV_LAYOUTS.find((l) => l.id === DEFAULT_CV_LAYOUT_ID)!
//   );
// }
export type PlanLayoutId =
  | "executive-first"
  | "investor-deck"
  | "cover-banner"
  | "minimal-clean"
  | "financial-charts";

export interface PlanLayoutMeta {
  id: PlanLayoutId;
  name: string;
  description: string;
}

export const PLAN_LAYOUTS: PlanLayoutMeta[] = [
  {
    id: "executive-first",
    name: "Executive Summary First",
    description:
      "Leads with the executive summary and viability score, then flows into the remaining sections. Friendly and modern — good default for most audiences.",
  },
  {
    id: "investor-deck",
    name: "Investor Deck Style",
    description:
      "Full-height sidebar with logo, key financial metrics and viability score; main panel carries the narrative sections. Built for a fundraising audience skimming for numbers first.",
  },
  {
    id: "cover-banner",
    name: "Cover & Banner",
    description:
      "Bold full-width cover page with business name/logo, then a flowing single-column body with left-accent section blocks.",
  },
  {
    id: "minimal-clean",
    name: "Minimal Print",
    description:
      "Clean single-column, no decorative cards — optimized for readability, printing, and getting through a skeptical reader's first pass quickly.",
  },
  {
    id: "financial-charts",
    name: "Financial Charts",
    description:
      "Revenue/profit projection line chart and break-even chart up top, plus the standard narrative sections — for audiences who want to see the trajectory before reading the story.",
  },
];

export const DEFAULT_PLAN_LAYOUT_ID: PlanLayoutId = "executive-first";

/** Look up a layout by id, falling back to the default when missing/unset. */
export function getPlanLayoutMeta(id?: string | null): PlanLayoutMeta {
  return (
    PLAN_LAYOUTS.find((l) => l.id === id) ??
    PLAN_LAYOUTS.find((l) => l.id === DEFAULT_PLAN_LAYOUT_ID)!
  );
}
