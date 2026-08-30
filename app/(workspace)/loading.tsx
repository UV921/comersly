export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-48 animate-pulse rounded-lg bg-surface" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
        <div className="h-60 animate-pulse rounded-[28px] bg-surface" />
        <div className="grid gap-4">
          <div className="h-[114px] animate-pulse rounded-[28px] bg-surface" />
          <div className="h-[114px] animate-pulse rounded-[28px] bg-surface" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(17rem,0.8fr)]">
        <div className="h-80 animate-pulse rounded-[28px] bg-surface" />
        <div className="h-80 animate-pulse rounded-[28px] bg-surface" />
      </div>
    </div>
  );
}
