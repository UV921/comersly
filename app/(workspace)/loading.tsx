export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-7 w-48 animate-pulse rounded bg-surface-muted" />
      <div className="h-4 w-80 animate-pulse rounded bg-surface-muted" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-lg border border-border bg-surface"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-lg border border-border bg-surface" />
    </div>
  );
}
