import type { PipelineCounts } from "@/server/db/queries/workspace";
import { cn } from "@/lib/cn";

const STAGES = [
  { key: "uploaded", label: "Uploaded" },
  { key: "interpreted", label: "Interpreted" },
  { key: "classified", label: "Classified" },
  { key: "enriched", label: "Enriched" },
  { key: "normalized", label: "Normalized" },
  { key: "content", label: "Content" },
  { key: "assets", label: "Assets" },
] as const;

export function ImportPipeline({ counts }: { counts: PipelineCounts }) {
  return (
    <ol className="space-y-4">
      {STAGES.map((stage) => {
        const done =
          stage.key === "uploaded"
            ? counts.total
            : counts[stage.key as Exclude<typeof stage.key, "uploaded">];
        const percent = counts.total > 0 ? Math.round((done / counts.total) * 100) : 0;

        return (
          <li key={stage.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium">{stage.label}</p>
              <p className="text-sm text-muted tabular-nums">
                {done} of {counts.total}
                <span className="ml-2 text-xs">{percent}%</span>
              </p>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
                style={{ width: `${percent}%` }}
              />
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
  const completed = stages.filter((stage) => stage.done).length;
  const current = stages.find((stage) => !stage.done)?.label ?? "Complete";

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold">
          {completed === stages.length ? "All stages complete" : `Currently: ${current}`}
        </p>
        <p className="text-sm text-muted tabular-nums">
          {completed}/{stages.length}
        </p>
      </div>
      <ol className="flex gap-1">
        {stages.map((stage) => (
          <li key={stage.label} className="min-w-0 flex-1">
            <div
              className={cn(
                "h-1.5 rounded-full",
                stage.done ? "bg-accent" : "bg-surface-muted",
              )}
            />
            <p
              className={cn(
                "mt-2 truncate text-[11px]",
                stage.done ? "font-medium text-foreground" : "text-muted",
              )}
              title={stage.label}
            >
              {stage.label}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
