// // app/api/cv/[cvId]/versions/[versionId]/pdf/route.ts
// import { fetchQuery } from "convex/nextjs";
// import { api } from "@/convex/_generated/api";
// import type { Id } from "@/convex/_generated/dataModel";
// import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
// import type { ReactElement } from "react";
// import { NextResponse } from "next/server";
// import { prepareCvData } from "@/lib/cv-data";
// import { PDF_LAYOUT_BUILDERS } from "@/lib/pdf-layouts";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// export async function GET(
//   _req: Request,
//   { params }: { params: Promise<{ cvId: string; versionId: string }> },
// ) {
//   const { cvId, versionId } = await params;

//   // getCv / getCvVersionContent already enforce cv.userId === current user —
//   // this route is behind Clerk auth (not in isPublicRoute), so an
//   // unauthenticated request never reaches here.
//   const cv = await fetchQuery(api.cvs.getCv, {
//     cvId: cvId as Id<"cvs">,
//   });
//   const version = await fetchQuery(api.cvs.getCvVersionContent, {
//     versionId: versionId as Id<"cvVersions">,
//   });
//   if (!cv || !version) {
//     return NextResponse.json({ error: "Not found" }, { status: 404 });
//   }

//   const data = prepareCvData(cv, version);
//   const buildDocument =
//     PDF_LAYOUT_BUILDERS[data.layout.id] ?? PDF_LAYOUT_BUILDERS.centered;
//   const document = buildDocument({
//     cv,
//     ...data,
//   }) as ReactElement<DocumentProps>;
//   const buffer = await renderToBuffer(document);

//   return new NextResponse(new Uint8Array(buffer), {
//     headers: {
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename="${cv.personalInfo.fullName.replace(/\s+/g, "-")}-v${version.versionNumber}-CV.pdf"`,
//     },
//   });
// }

// app/api/cv/versions/[cvId]/[versionId]/pdf/route.ts
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import { NextResponse } from "next/server";
import { prepareCvData } from "@/lib/cv-data";
import { PDF_LAYOUT_BUILDERS } from "@/lib/pdf-layouts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ cvId: string; versionId: string }> },
) {
  const { cvId, versionId } = await params;

  // This route sits behind Clerk (not in isPublicRoute), so we always
  // have a session by the time we get here — but fetchQuery still needs
  // the token handed to it explicitly, or Convex sees an anonymous caller.
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cv = await fetchQuery(
    api.cvs.getCv,
    { cvId: cvId as Id<"cvs"> },
    { token },
  );
  const version = await fetchQuery(
    api.cvs.getCvVersionContent,
    { versionId: versionId as Id<"cvVersions"> },
    { token },
  );
  if (!cv || !version) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = prepareCvData(cv, version);
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
      "Content-Disposition": `attachment; filename="${cv.personalInfo.fullName.replace(/\s+/g, "-")}-v${version.versionNumber}-CV.pdf"`,
    },
  });
}
