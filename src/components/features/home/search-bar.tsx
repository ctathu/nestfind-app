"use client";

import { Calendar, ChevronDown, MapPin, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import type { SearchFilters } from "@/lib/filters";

const guestOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];

type SearchBarProps = {
  filters: SearchFilters;
  onChange: (patch: Partial<SearchFilters>) => void;
  /** Called on submit with the latest field values from the form. */
  onSearch: (snapshot?: Partial<SearchFilters>) => void;
};

export function SearchBar({ filters, onChange, onSearch }: SearchBarProps) {
  return (
    <form
      data-testid="search-bar"
      className="mx-auto w-full max-w-5xl"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const location =
          (
            form.querySelector(
              '[data-testid="search-location"]',
            ) as HTMLInputElement | null
          )?.value ?? filters.location;
        const checkIn =
          (form.querySelector('[aria-label="Check-in date"]') as HTMLInputElement | null)
            ?.value ?? filters.checkIn;
        const checkOut =
          (form.querySelector('[aria-label="Check-out date"]') as HTMLInputElement | null)
            ?.value ?? filters.checkOut;
        onSearch({ location, checkIn, checkOut });
      }}
    >
      <div className="flex flex-col gap-2 rounded-full border border-zinc-200/90 bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] lg:flex-row lg:items-stretch lg:gap-0 lg:p-2">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full px-4 py-3 lg:border-r lg:border-zinc-100">
          <MapPin
            className="size-4 shrink-0 text-[var(--nestfind-green)]"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <Input
              data-testid="search-location"
              value={filters.location}
              onChange={(e) => onChange({ location: e.target.value })}
              placeholder="Search by city, district, or landmark"
              className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              aria-label="Location"
            />
          </div>
        </label>

        <label className="flex items-center gap-2 rounded-full px-4 py-3 lg:min-w-[9rem] lg:border-r lg:border-zinc-100">
          <Calendar
            className="size-4 shrink-0 text-[var(--nestfind-green)]"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <span className="mb-0.5 block text-xs font-medium text-zinc-500 lg:hidden">
              Check-in
            </span>
            <Input
              type="date"
              value={filters.checkIn}
              onChange={(e) => onChange({ checkIn: e.target.value })}
              className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              aria-label="Check-in date"
            />
          </div>
          <ChevronDown className="size-4 shrink-0 text-zinc-400 lg:hidden" aria-hidden />
        </label>

        <label className="flex items-center gap-2 rounded-full px-4 py-3 lg:min-w-[9rem] lg:border-r lg:border-zinc-100">
          <Calendar
            className="size-4 shrink-0 text-[var(--nestfind-green)]"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <span className="mb-0.5 block text-xs font-medium text-zinc-500 lg:hidden">
              Check-out
            </span>
            <Input
              type="date"
              value={filters.checkOut}
              onChange={(e) => onChange({ checkOut: e.target.value })}
              className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              aria-label="Check-out date"
            />
          </div>
          <ChevronDown className="size-4 shrink-0 text-zinc-400 lg:hidden" aria-hidden />
        </label>

        <div className="flex items-center gap-2 rounded-full px-4 py-3 lg:min-w-[8rem] lg:border-r lg:border-zinc-100">
          <Users
            className="size-4 shrink-0 text-[var(--nestfind-green)]"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <span className="mb-0.5 block text-xs font-medium text-zinc-500 lg:hidden">
              Guests
            </span>
            <Select
              value={filters.guests}
              onValueChange={(value) => onChange({ guests: value })}
              placeholder="Guests"
            >
              {guestOptions.map((g) => (
                <SelectItem key={g} value={g}>
                  {g} guest{g === "1" ? "" : "s"}
                </SelectItem>
              ))}
            </Select>
          </div>
          <ChevronDown className="size-4 shrink-0 text-zinc-400 lg:hidden" aria-hidden />
        </div>

        <Button
          type="submit"
          data-testid="search-submit"
          size="lg"
          className="mx-1 h-12 shrink-0 rounded-full px-8 lg:my-1 lg:h-11"
        >
          <Search className="size-4" aria-hidden />
          Search
        </Button>
      </div>
    </form>
  );
}
