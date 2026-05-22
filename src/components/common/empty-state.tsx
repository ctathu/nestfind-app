import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title?: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
};

export function EmptyState({
  title = "No listings found",
  description = "Try another city or adjust your filters.",
  className,
  action,
}: EmptyStateProps) {
  return (
    <div
      data-testid="empty-state"
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-16 text-center",
        className,
      )}
    >
      <SearchX className="mb-3 size-10 text-zinc-300" aria-hidden />
      <p className="text-lg font-medium text-zinc-700">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
