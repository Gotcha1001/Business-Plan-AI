// components/viability-badge.tsx
//
// NEW FILE -- reads version.viabilityAnalysis (score/flags/suggestions,
// computed deterministically by lib/financial-calculations.ts's
// computeViability(), never by the AI). Plays the role match-score.tsx
// played in the CV app, but for financial viability instead of a
// job-keyword match.

import { AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

type ViabilityAnalysis = Doc<"businessPlanVersions">["viabilityAnalysis"];

function scoreBand(score: number): { label: string; classes: string } {
  if (score >= 80) {
    return {
      label: "Strong",
      classes:
        "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    };
  }
  if (score >= 55) {
    return {
      label: "Workable",
      classes:
        "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    };
  }
  return {
    label: "Needs work",
    classes:
      "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
  };
}

export function ViabilityBadge({
  viability,
  showDetails = true,
}: {
  viability: ViabilityAnalysis;
  /** Compact mode (no flags/suggestions) for use in list rows or headers. */
  showDetails?: boolean;
}) {
  if (!viability) return null;

  const { score, flags, suggestions } = viability;
  const band = scoreBand(score);

  return (
    <div className="space-y-3">
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${band.classes}`}
      >
        {score >= 80 ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <AlertTriangle className="h-4 w-4" />
        )}
        Viability score: {score}/100 &middot; {band.label}
      </div>

      {showDetails && flags.length > 0 && (
        <ul className="space-y-1.5">
          {flags.map((flag, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500" />
              <span>{flag}</span>
            </li>
          ))}
        </ul>
      )}

      {showDetails && suggestions.length > 0 && (
        <ul className="space-y-1.5">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <Lightbulb className="h-3.5 w-3.5 mt-0.5 shrink-0 text-sky-500" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
