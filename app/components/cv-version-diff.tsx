// components/cv-version-diff.tsx
import type { DiffOpItem, CvContentDiff } from "@/lib/cv-diff";

function InlineWordDiff({ tokens }: { tokens: DiffOpItem<string>[] }) {
  return (
    <p className="text-sm leading-relaxed">
      {tokens.map((t, i) => {
        if (t.op === "equal") return <span key={i}>{t.value}</span>;
        if (t.op === "add")
          return (
            <span
              key={i}
              className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 rounded px-0.5"
            >
              {t.value}
            </span>
          );
        return (
          <span
            key={i}
            className="bg-rose-500/10 text-rose-700 dark:text-rose-400 line-through rounded px-0.5"
          >
            {t.value}
          </span>
        );
      })}
    </p>
  );
}

function ListDiff({ tokens }: { tokens: DiffOpItem<string>[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tokens.map((t, i) => (
        <span
          key={i}
          className={`text-xs px-2 py-1 rounded-full ${
            t.op === "add"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : t.op === "remove"
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 line-through"
                : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
          }`}
        >
          {t.value}
        </span>
      ))}
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  added: "New",
  removed: "Removed",
  modified: "Retailored",
  unchanged: "Unchanged",
};

export function CvVersionDiff({ diff }: { diff: CvContentDiff }) {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Headline
        </h3>
        <InlineWordDiff tokens={diff.headline} />
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Summary
        </h3>
        <InlineWordDiff tokens={diff.summary} />
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Top skills
        </h3>
        <ListDiff tokens={diff.topSkills} />
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Experience
        </h3>
        <div className="space-y-4">
          {diff.experience.map((e, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-900/10 dark:border-white/10 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">{e.company}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    e.status === "added"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : e.status === "removed"
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        : e.status === "modified"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-zinc-500/10 text-zinc-500"
                  }`}
                >
                  {STATUS_LABEL[e.status]}
                </span>
              </div>
              {e.roleDiff && <InlineWordDiff tokens={e.roleDiff} />}
              {e.bulletsDiff && (
                <ul className="mt-2 space-y-1">
                  {e.bulletsDiff.map((b, j) => (
                    <li
                      key={j}
                      className={`text-sm pl-4 relative before:content-['•'] before:absolute before:left-0 ${
                        b.op === "add"
                          ? "text-emerald-700 dark:text-emerald-400"
                          : b.op === "remove"
                            ? "text-rose-700 dark:text-rose-400 line-through"
                            : "text-muted-foreground"
                      }`}
                    >
                      {b.value}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {diff.closingNote.some((t) => t.op !== "equal") && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Closing note
          </h3>
          <InlineWordDiff tokens={diff.closingNote} />
        </section>
      )}
    </div>
  );
}
