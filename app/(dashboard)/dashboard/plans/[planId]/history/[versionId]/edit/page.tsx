// app/(dashboard)/dashboard/plans/[planId]/history/[versionId]/edit/page.tsx
//
// TRANSFORMED FROM: app/(dashboard)/dashboard/cvs/[cvId]/history/[versionId]/edit/page.tsx
//
// The old page also queried the parent `cv` record because
// CvVersionEditForm needed it for personalInfo/testimonials/etc. This
// form doesn't touch anything at the plan level (see the long comment
// in plan-version-edit-form.tsx for why), so there's no equivalent
// getPlan query here — just the version itself.

"use client";

import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PlanVersionEditForm } from "@/app/components/plan-version-edit-form";
import { GeneratedPlanContent } from "@/lib/plan-types";
import Image from "next/image";

export default function EditPlanVersionPage() {
  const params = useParams();
  const router = useRouter();

  const planId = params.planId as Id<"businessPlans"> | undefined;
  const versionId = params.versionId as Id<"businessPlanVersions"> | undefined;

  const version = useQuery(
    api.businessPlans.getPlanVersionContent,
    versionId ? { versionId } : "skip",
  );

  function backToHistory() {
    router.push(`/dashboard/plans/${planId}/history`);
  }

  if (!planId || !versionId) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center text-muted-foreground">
        Missing plan or version id.
      </div>
    );
  }

  const stillLoading = version === undefined;
  const notFound = version === null;

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <Image
        src="/cvcolleague.jpg"
        alt=""
        fill
        priority
        className="object-cover opacity-20 dark:opacity-10 -z-10 pointer-events-none select-none"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-950/30 via-slate-900/20 to-purple-950/35 dark:from-indigo-950/40 dark:via-black/60 dark:to-purple-950/30 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto space-y-8 px-6 pt-16 pb-20">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium tracking-wide uppercase text-purple-600 dark:text-purple-400">
              Update this version
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-zinc-900 dark:text-white">
              Edit v{version?.versionNumber ?? "..."}
              {version?.label ? ` — ${version.label}` : ""}
            </h1>
            <p className="mt-2 text-sm text-zinc-900/70 dark:text-white/70">
              Changes save in place to this version — no new row is created.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={backToHistory}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to history
          </Button>
        </div>

        {stillLoading && !notFound && (
          <div className="text-sm text-zinc-900/60 dark:text-white/60 py-16 text-center">
            Loading version...
          </div>
        )}

        {notFound && (
          <div className="text-sm text-zinc-900/60 dark:text-white/60 py-16 text-center">
            Version not found, or you don&apos;t have access to it.
          </div>
        )}

        {version && (
          <PlanVersionEditForm
            versionId={version._id}
            content={version.generatedContent as GeneratedPlanContent}
            currentStyle={version.style}
            currentLayout={version.layout}
            onSaved={backToHistory}
            onCancel={backToHistory}
          />
        )}
      </div>
    </div>
  );
}
