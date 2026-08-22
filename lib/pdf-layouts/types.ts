// lib/pdf-layouts/types.ts
import type { Doc } from "@/convex/_generated/dataModel";
import type { GeneratedPlanContent } from "@/lib/plan-types";
import type { PlanStyleTheme } from "@/lib/styles";

/**
 * Everything a pdf layout builder needs, already shaped by
 * lib/plan-data.ts's preparePlanData() so it's byte-for-byte the same
 * data the matching web layout renders from.
 */
export interface PdfLayoutData {
  plan: Doc<"businessPlans">;
  version: Doc<"businessPlanVersions">;
  theme: PlanStyleTheme;
  g: GeneratedPlanContent;
  calc: import("@/lib/financial-calculations").CalculatedFinancials;
  viability: Doc<"businessPlanVersions">["viabilityAnalysis"];
  businessName: string;
  tagline?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  socialLinks: Array<{ label: string; url: string }>;
  currency: string;
}

/** Same digit-stripping as the web preview's WhatsApp-style contact links. */
export function toWhatsAppNumber(phone: string) {
  return phone.replace(/[^\d]/g, "");
}
