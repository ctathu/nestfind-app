"use client";

import { MapPin } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/format-listing";
import type { Listing } from "@/types/listing";

type MapModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listings: Listing[];
};

export function MapModal({ open, onOpenChange, listings }: MapModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Explore listings on the map" className="max-w-2xl">
        <h2 className="pr-8 text-xl font-bold text-zinc-900">
          Explore listings on the map
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Map view (MVP). Pins show sample stays from your current results.
        </p>

        <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl bg-gradient-to-br from-[#e1f5ee] to-[#c5e8dc]">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_40%,#2d9c75_0%,transparent_50%),radial-gradient(circle_at_70%_60%,#10b981_0%,transparent_45%)]" />
          {listings.slice(0, 6).map((listing, i) => (
            <div
              key={listing.id}
              className="absolute flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-semibold shadow-md"
              style={{
                left: `${15 + (i % 3) * 28}%`,
                top: `${20 + Math.floor(i / 3) * 35}%`,
              }}
            >
              <MapPin className="size-3 text-[var(--nestfind-green)]" />
              {formatPrice(listing.pricePerNight)}
            </div>
          ))}
        </div>

        <ul className="mt-4 max-h-40 space-y-2 overflow-y-auto text-sm">
          {listings.length === 0 ? (
            <li className="text-zinc-500">No listings to show on the map.</li>
          ) : (
            listings.map((l) => (
              <li key={l.id} className="flex justify-between text-zinc-700">
                <span>{l.title}</span>
                <span className="font-medium text-[var(--nestfind-green)]">
                  {formatPrice(l.pricePerNight)}/night
                </span>
              </li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
