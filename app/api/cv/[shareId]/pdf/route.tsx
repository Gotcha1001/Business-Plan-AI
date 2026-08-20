import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import { NextResponse } from "next/server";
import { prepareCvData } from "@/lib/cv-data";
import { PDF_LAYOUT_BUILDERS } from "@/lib/pdf-layouts";

export const runtime = "nodejs"; // @react-pdf/renderer needs Node APIs, not edge

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ shareId: string }> },
) {
  const { shareId } = await params;

  // getByShareId returns { cv, activeVersion } | null
  const result = await fetchQuery(api.cvs.getByShareId, { shareId });
  if (!result?.cv || !result?.activeVersion) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { cv, activeVersion } = result;

  // Same data shaping the web preview uses — both args required
  const data = prepareCvData(cv, activeVersion);

  const buildDocument =
    PDF_LAYOUT_BUILDERS[data.layout.id] ?? PDF_LAYOUT_BUILDERS.centered;

  const document = buildDocument({
    cv,
    ...data,
  }) as ReactElement<DocumentProps>;

  const buffer = await renderToBuffer(document);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${cv.personalInfo.fullName.replace(/\s+/g, "-")}-CV.pdf"`,
    },
  });
}
