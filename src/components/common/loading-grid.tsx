import { cn } from "@/lib/utils";

type LoadingGridProps = {
  count?: number;
  className?: string;
};

export function LoadingGrid({ count = 4, className }: LoadingGridProps) {
  return (
    <div
      data-testid="loading-grid"
      className={cn(
        "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
      aria-busy="true"
      aria-label="Loading listings"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm"
        >
          <div className="aspect-[4/3] animate-pulse bg-zinc-100" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
