// app/(dashboard)/dashboard/cvs/[cvId]/history/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { CvAnimatedView } from "@/app/components/cv-preview";

export default function CvHistoryPage() {
  const params = useParams();
  const router = useRouter();

  // May be undefined during first paint / bad navigation — never pass that to Convex
  const cvId = params.cvId as Id<"cvs"> | undefined;

  const cv = useQuery(api.cvs.getCv, cvId ? { cvId } : "skip");
  const versions = useQuery(api.cvs.listCvVersions, cvId ? { cvId } : "skip");

  const setActiveVersion = useMutation(api.cvs.setActiveVersion);
  const deleteVersion = useMutation(api.cvs.deleteVersion);

  const [previewVersionId, setPreviewVersionId] =
    useState<Id<"cvVersions"> | null>(null);
  const [deletingId, setDeletingId] = useState<Id<"cvVersions"> | null>(null);

  const previewVersion = useQuery(
    api.cvs.getCvVersionContent,
    previewVersionId ? { versionId: previewVersionId } : "skip",
  );

  async function handleShare(versionId: Id<"cvVersions">) {
    if (!cvId) return;
    await setActiveVersion({ cvId, versionId });
    if (cv?.shareId) {
      const link = `${window.location.origin}/cv/${cv.shareId}`;
      await navigator.clipboard.writeText(link);
      toast.success("Link copied — this version is now the one shared");
    } else {
      toast.success("This version is now the one shared");
    }
  }

  async function handleDelete(versionId: Id<"cvVersions">) {
    setDeletingId(versionId);
    try {
      await deleteVersion({ versionId });
      if (previewVersionId === versionId) setPreviewVersionId(null);
      toast.success("Version deleted");
    } finally {
      setDeletingId(null);
    }
  }

  if (!cvId) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center text-muted-foreground">
        Missing CV id.
      </div>
    );
  }

  if (versions === undefined || cv === undefined) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center text-muted-foreground">
        Loading history...
      </div>
    );
  }

  if (cv === null) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center text-muted-foreground">
        CV not found, or you don&apos;t have access to it.
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4 text-muted-foreground">
        <p>No generations yet — generate this CV to start building history.</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/cvs")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My CVs
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Version history</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every generation is kept. View the finished CV, share it, or delete
            a version.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/cvs")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          My CVs
        </Button>
      </div>

      <div className="space-y-3">
        {versions.map((version) => (
          <div
            key={version._id}
            className={`flex items-center justify-between gap-4 rounded-2xl border p-4 ${
              version.isActive
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-zinc-900/10 dark:border-white/10"
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium truncate">
                  v{version.versionNumber}
                  {version.label ? ` — ${version.label}` : ""}
                </p>
                {version.isActive && (
                  <span className="text-xs rounded-full px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Live
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(version.createdAt).toLocaleString()}
                {version.matchScore != null &&
                  ` — ${version.matchScore}% match`}
                {version.style ? ` · ${version.style}` : ""}
                {version.layout ? ` · ${version.layout}` : ""}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPreviewVersionId(version._id)}
              >
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  router.push(
                    `/dashboard/cvs/${cvId}/history/${version._id}/edit`,
                  )
                }
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare(version._id)}
              >
                Share
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700"
                disabled={deletingId === version._id}
                onClick={() => handleDelete(version._id)}
              >
                {deletingId === version._id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={previewVersionId !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewVersionId(null);
        }}
      >
        <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>
              {previewVersion
                ? `v${previewVersion.versionNumber}${
                    previewVersion.label ? ` — ${previewVersion.label}` : ""
                  }`
                : "Loading..."}
            </DialogTitle>
          </DialogHeader>

          <div className="px-2 pb-6">
            {previewVersion && previewVersionId ? (
              <CvAnimatedView
                cv={cv}
                version={previewVersion}
                pdfUrl={`/api/cv/versions/${cvId}/${previewVersionId}/pdf`}
              />
            ) : (
              <div className="text-sm text-muted-foreground py-16 text-center">
                Loading version...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
