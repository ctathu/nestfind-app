"use client";

import { Map, MapPinned } from "lucide-react";
import { useState } from "react";
import { MapModal } from "@/components/features/map/map-modal";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/types/listing";

type MapCTAProps = {
  listings: Listing[];
};

export function MapCTA({ listings }: MapCTAProps) {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <section className="pb-16">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border-2 border-[#b8e6d4] bg-[var(--nestfind-mint)] px-6 py-8 sm:flex-row sm:px-10">
          <div className="flex items-start gap-4 text-center sm:text-left">
            <div className="hidden rounded-xl bg-[var(--nestfind-green)] p-3 text-white sm:flex">
              <Map className="size-7" aria-hidden />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1e4d3b] sm:text-2xl">
                Explore listings on the map
              </h2>
              <p className="mt-1 max-w-md text-sm text-[#2d6b52]">
                Pan across cities and compare nightly rates in real time as you
                explore where to stay.
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="lg"
            className="shrink-0"
            onClick={() => setMapOpen(true)}
          >
            <MapPinned className="size-4" aria-hidden />
            Open map
          </Button>
        </div>
      </Container>

      <MapModal open={mapOpen} onOpenChange={setMapOpen} listings={listings} />
    </section>
  );
}
