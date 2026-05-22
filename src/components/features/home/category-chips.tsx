"use client";

import {
  Building2,
  Home,
  LayoutGrid,
  Star,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryFilter } from "@/lib/filters";

const chips: {
  id: CategoryFilter;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "all", label: "All types", icon: LayoutGrid },
  { id: "studio", label: "Studio", icon: Building2 },
  { id: "apartment", label: "Apartment", icon: Building2 },
  { id: "house", label: "House", icon: Home },
  { id: "top-rated", label: "Top rated", icon: Star },
  { id: "budget-friendly", label: "Budget-friendly", icon: Wallet },
];

type CategoryChipsProps = {
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
};

export function CategoryChips({ value, onChange }: CategoryChipsProps) {
  return (
    <div
      data-testid="category-chips"
      className="flex flex-wrap justify-center gap-2"
      role="group"
      aria-label="Property type filters"
    >
      {chips.map((chip) => {
        const active = value === chip.id;
        const Icon = chip.icon;
        return (
          <button
            key={chip.id}
            type="button"
            data-testid={`category-chip-${chip.id}`}
            onClick={() => onChange(chip.id)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
              active
                ? "border-[#1e4d3b] bg-[#1e4d3b] text-white shadow-sm"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-[var(--nestfind-green)]/40 hover:text-zinc-900",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
