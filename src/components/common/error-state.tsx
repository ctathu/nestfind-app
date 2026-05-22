import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      data-testid="error-state"
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/50 px-6 py-12 text-center",
        className,
      )}
      role="alert"
    >
      <AlertCircle className="mb-3 size-10 text-red-400" aria-hidden />
      <p className="text-lg font-medium text-zinc-800">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-zinc-600">{message}</p>
      {onRetry ? (
        <Button
          type="button"
          data-testid="error-retry"
          variant="outline"
          className="mt-6"
          onClick={onRetry}
        >
          Try again
        </Button>
      ) : null}
    </div>
  );
}
