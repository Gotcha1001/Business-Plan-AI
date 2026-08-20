// // app/cv/[shareId]/page.tsx
// import { fetchQuery } from "convex/nextjs";
// import { api } from "@/convex/_generated/api";
// import { notFound } from "next/navigation";
// import { CvAnimatedView } from "@/app/components/cv-preview";

// export default async function PublicCvPage({
//   params,
// }: {
//   params: Promise<{ shareId: string }>;
// }) {
//   const { shareId } = await params;
//   const result = await fetchQuery(api.cvs.getByShareId, { shareId });
//   if (!result) notFound();
//   return <CvAnimatedView cv={result.cv} version={result.activeVersion} />;
// }
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { CvAnimatedView } from "@/app/components/cv-preview";

export default async function PublicCvPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const result = await fetchQuery(api.cvs.getByShareId, { shareId });
  if (!result) notFound();
  return (
    <CvAnimatedView
      cv={result.cv}
      version={result.activeVersion}
      deferAutoplay
    />
  );
}
