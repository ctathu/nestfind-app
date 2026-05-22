import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("text-xl font-bold tracking-tight", className)}
      aria-label="NestFind home"
    >
      <span className="text-zinc-900">nest</span>
      <span className="text-[var(--nestfind-green)]">find</span>
    </Link>
  );
}
