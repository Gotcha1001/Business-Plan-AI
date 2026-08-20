// lib/pdf-layouts/types.ts
import type { Doc } from "@/convex/_generated/dataModel";
import type { GeneratedCvContent } from "@/lib/cv-types";
import type { CvStyleTheme } from "@/lib/styles";

/**
 * Everything a pdf layout builder needs, already shaped by
 * lib/cv-data.ts's prepareCvData() so it's byte-for-byte the same data
 * the matching web layout renders from.
 */
export interface PdfLayoutData {
  cv: Doc<"cvs">;
  theme: CvStyleTheme;
  g: GeneratedCvContent | undefined;
  testimonials: Array<{ author: string; authorRole?: string; text: string }>;
  achievements: Array<{ title: string; description?: string; date?: string }>;
  hasSidebarContent: boolean;
  fullName: string;
  idNumber?: string;
  address?: string;
  email: string;
  phone?: string;
  photoUrl?: string;
}

/** Same digit-stripping as the web preview's WhatsApp link. */
export function toWhatsAppNumber(phone: string) {
  return phone.replace(/[^\d]/g, "");
}
