import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { PlanAnimatedView } from "@/app/components/plan-preview";

export default async function PublicPlanPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const result = await fetchQuery(api.businessPlans.getByShareId, {
    shareId,
  });
  if (!result) notFound();
  return <PlanAnimatedView plan={result.plan} version={result.activeVersion} />;
}
