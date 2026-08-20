export function MatchScore({
  matchAnalysis,
}: {
  matchAnalysis:
    | {
        score: number;
        matchedKeywords: string[];
        missingKeywords: string[];
        suggestions: string[];
      }
    | null
    | undefined;
}) {
  if (!matchAnalysis) return null;
  const { score, matchedKeywords, missingKeywords, suggestions } =
    matchAnalysis;
  const color =
    score >= 75
      ? "text-emerald-500"
      : score >= 50
        ? "text-amber-500"
        : "text-rose-500";

  return (
    <div className="rounded-2xl border border-zinc-900/10 dark:border-white/10 p-5 space-y-3">
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${color}`}>{score}</span>
        <span className="text-sm text-zinc-500">match to this job</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {matchedKeywords.map((k) => (
          <span
            key={k}
            className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            {k}
          </span>
        ))}
        {missingKeywords.map((k) => (
          <span
            key={k}
            className="text-xs px-2 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400"
          >
            {k}
          </span>
        ))}
      </div>
      {suggestions.length > 0 && (
        <ul className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
          {suggestions.map((s) => (
            <li key={s}>• {s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
