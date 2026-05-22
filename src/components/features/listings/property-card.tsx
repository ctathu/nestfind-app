"use client";

import Link from "next/link";
import {
  Building2,
  Heart,
  Home,
  MapPin,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatSpecs } from "@/lib/format-listing";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types/listing";

const accentStyles: Record<
  NonNullable<Listing["cardAccent"]>,
  { bg: string; icon: string }
> = {
  blue: { bg: "bg-[#dbeafe]", icon: "text-[#1e40af]" },
  green: { bg: "bg-[#d1fae5]", icon: "text-[#047857]" },
  yellow: { bg: "bg-[#fef3c7]", icon: "text-[#b45309]" },
  pink: { bg: "bg-[#fce7f3]", icon: "text-[#be185d]" },
};

function CategoryIcon({ category }: { category: Listing["category"] }) {
  const className = "size-16";
  if (category === "HOUSE") return <Home className={className} aria-hidden />;
  return <Building2 className={className} aria-hidden />;
}

type PropertyCardProps = {
  listing: Listing;
  variant?: "featured" | "default";
};

export function PropertyCard({
  listing,
  variant = "featured",
}: PropertyCardProps) {
  const [saved, setSaved] = useState(false);
  const accent = listing.cardAccent
    ? accentStyles[listing.cardAccent]
    : null;

  return (
    <article
      data-testid="property-card"
      className="group overflow-hidden rounded-2xl border border-[#e8eeeb] bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <Link
        href={`/listings/${listing.id}`}
        data-testid="property-card-link"
        className="block"
      >
        <div
          className={cn(
            "relative flex aspect-[4/3] items-center justify-center overflow-hidden",
            variant === "featured" && accent
              ? accent.bg
              : "bg-zinc-100",
          )}
        >
          {variant === "featured" && accent ? (
            <div className={cn("opacity-90", accent.icon)}>
              <CategoryIcon category={listing.category} />
            </div>
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundImage: `url(${listing.imageUrl})` }}
              role="img"
              aria-label={listing.title}
            />
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {listing.isNew ? <Badge variant="new">New</Badge> : null}
            {listing.isTopPick ? (
              <Badge variant="brand">Top pick</Badge>
            ) : null}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={saved ? "Remove from saved" : "Save listing"}
            onClick={(e) => {
              e.preventDefault();
              setSaved((s) => !s);
            }}
            className={cn(
              "absolute right-3 top-3 size-9 rounded-full border border-zinc-100 bg-white shadow-sm hover:bg-white",
              saved && "text-rose-500",
            )}
          >
            <Heart
              className={cn("size-4 text-rose-400", saved && "fill-current")}
            />
          </Button>
        </div>

        <div className="space-y-2 p-4">
          <h3
            data-testid="property-card-title"
            className="line-clamp-1 font-semibold text-zinc-900"
          >
            {listing.title}
          </h3>
          <p className="flex items-center gap-1 text-sm text-zinc-500">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {formatSpecs(listing)}
          </p>
          <div className="flex items-center justify-between pt-1">
            <p className="text-base font-bold text-[var(--nestfind-green)]">
              {formatPrice(listing.pricePerNight)}
              <span className="text-sm font-normal text-zinc-500"> / night</span>
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-zinc-700">
              <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
              {listing.rating.toFixed(1)}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
