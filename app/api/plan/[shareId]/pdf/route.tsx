// import { fetchQuery } from "convex/nextjs";
// import { api } from "@/convex/_generated/api";
// import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
// import type { ReactElement } from "react";
// import { NextResponse } from "next/server";
// import { preparePlanData } from "@/lib/plan-data";
// import { PDF_LAYOUT_BUILDERS } from "@/lib/pdf-layouts";
// import { getPlanLayoutMeta } from "@/lib/layouts";

// export const runtime = "nodejs"; // @react-pdf/renderer needs Node APIs, not edge

// export async function GET(
//   _req: Request,
//   { params }: { params: Promise<{ shareId: string }> },
// ) {
//   const { shareId } = await params;

//   // getByShareId returns { plan, activeVersion } | null
//   const result = await fetchQuery(api.businessPlans.getByShareId, {
//     shareId,
//   });
//   if (!result?.plan || !result?.activeVersion) {
//     return NextResponse.json({ error: "Not found" }, { status: 404 });
//   }

//   const { plan, activeVersion } = result;

//   // Same data shaping the web preview uses — both args required
//   const data = preparePlanData(plan, activeVersion);

//   const layoutId = getPlanLayoutMeta(activeVersion.layout).id;
//   const buildDocument =
//     PDF_LAYOUT_BUILDERS[layoutId] ?? PDF_LAYOUT_BUILDERS["executive-first"];

//   const document = buildDocument({
//     plan,
//     version: activeVersion,
//     ...data,
//   }) as ReactElement<DocumentProps>;

//   const buffer = await renderToBuffer(document);

//   return new NextResponse(new Uint8Array(buffer), {
//     headers: {
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename="${data.businessName.replace(/\s+/g, "-")}-Business-Plan.pdf"`,
//     },
//   });
// }

import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import { NextResponse } from "next/server";
import { preparePlanData } from "@/lib/plan-data";
import { PDF_LAYOUT_BUILDERS } from "@/lib/pdf-layouts";
import { getPlanLayoutMeta } from "@/lib/layouts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // good to add — avoids accidental static caching

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ shareId: string }> },
) {
  const { shareId } = await params;

  const result = await fetchQuery(api.businessPlans.getByShareId, { shareId });
  if (!result?.plan || !result?.activeVersion) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { plan, activeVersion } = result;
  const data = preparePlanData(plan, activeVersion);

  const layoutId = getPlanLayoutMeta(activeVersion.layout).id;
  const buildDocument =
    PDF_LAYOUT_BUILDERS[layoutId] ?? PDF_LAYOUT_BUILDERS["executive-first"];

  const document = buildDocument({
    plan,
    version: activeVersion,
    ...data,
  }) as ReactElement<DocumentProps>;

  const buffer = await renderToBuffer(document);

  const safeName =
    data.businessName.replace(/[^\w\-]+/g, "-").replace(/^-|-$/g, "") ||
    "Business-Plan";

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}-Business-Plan.pdf"`,
    },
  });
}
