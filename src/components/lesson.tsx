import type { LessonBlock } from "@/lib/types";

// Renders a chapter lesson from structured blocks. No markdown/LaTeX
// dependency — concepts, formulas, worked examples and tips each get a
// distinct, readable style.
export function Lesson({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <article className="space-y-4">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "heading":
            return (
              <h2 key={i} className="pt-2 text-lg font-bold text-brand">
                {b.text}
              </h2>
            );
          case "para":
            return (
              <p key={i} className="leading-relaxed text-foreground/90">
                {b.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="list-disc space-y-1 pl-6 text-foreground/90">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          case "formula":
            return (
              <div
                key={i}
                className="rounded-lg border border-border bg-background px-4 py-2 text-center font-mono text-sm"
              >
                {b.text}
              </div>
            );
          case "example":
            return (
              <div key={i} className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Example
                </div>
                <p className="mt-1 font-medium">{b.problem}</p>
                <p className="mt-2 text-sm text-foreground/80">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Solution:{" "}
                  </span>
                  {b.solution}
                </p>
              </div>
            );
          case "tip":
            return (
              <div
                key={i}
                className="rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-200"
              >
                💡 {b.text}
              </div>
            );
          default:
            return null;
        }
      })}
    </article>
  );
}
