import type { PipelineCounts } from "@/server/db/queries/workspace";
import { cn } from "@/lib/cn";

const STAGES = [
  { key: "uploaded", label: "Uploaded" },
  { key: "interpreted", label: "Interpreting" },
  { key: "classified", label: "Verification" },
  { key: "classified", label: "Classification" },
  { key: "enriched", label: "Enrichment" },
  { key: "normalized", label: "Normalization" },
  { key: "content", label: "Content" },
  { key: "assets", label: "Assets" },
  { key: "content", label: "Ready" },
] as const;

export function ImportPipeline({ counts }: { counts: PipelineCounts }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-3 xl:grid-cols-9">
      {STAGES.map((stage, index) => {
        const done =
          stage.key === "uploaded"
            ? counts.total
            : counts[stage.key as Exclude<typeof stage.key, "uploaded">];
        const complete = counts.total > 0 && done >= counts.total;

        return (
          <li
            key={`${stage.label}-${index}`}
            className={cn(
              "rounded-lg border px-3 py-2",
              complete
                ? "border-accent/20 bg-accent-soft"
                : "border-border bg-surface",
            )}
          >
            <div className="text-xs font-medium text-muted">{stage.label}</div>
            <div className="mt-1 text-sm font-semibold">
              {done}/{counts.total}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ProductPipeline({
  stages,
}: {
  stages: {
    label: string;
    done: boolean;
  }[];
}) {
  return (
    <ol className="flex flex-wrap gap-2">
      {stages.map((stage) => (
        <li
          key={stage.label}
          className={cn(
            "rounded-md border px-2.5 py-1 text-xs font-medium",
            stage.done
              ? "border-accent/20 bg-accent-soft text-accent"
              : "border-border bg-surface text-muted",
          )}
        >
          {stage.label}
        </li>
      ))}
    </ol>
  );
}
