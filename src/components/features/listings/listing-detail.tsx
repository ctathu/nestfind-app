import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { formatPrice, formatSpecs } from "@/lib/format-listing";
import type { Listing } from "@/types/listing";

type ListingDetailProps = {
  listing: Listing;
};

export function ListingDetail({ listing }: ListingDetailProps) {
  return (
    <article data-testid="listing-detail">
      <div className="relative aspect-[21/9] w-full bg-zinc-100 sm:aspect-[2.4/1]">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          {listing.isNew ? <Badge variant="new">New</Badge> : null}
          {listing.isTopPick ? <Badge variant="brand">Top pick</Badge> : null}
        </div>
      </div>

      <Container className="py-10">
        <Link
          href="/listings"
          className="text-sm font-medium text-[var(--nestfind-green)] hover:underline"
        >
          ← Back to listings
        </Link>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-zinc-900">{listing.title}</h1>
            <p className="mt-2 flex items-center gap-2 text-zinc-600">
              <MapPin className="size-4 text-[var(--nestfind-green)]" />
              {formatSpecs(listing)}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-700">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-2">
                <BedDouble className="size-4" />
                {listing.beds === 0
                  ? "Studio"
                  : `${listing.beds} bed${listing.beds === 1 ? "" : "s"}`}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-2">
                <Bath className="size-4" />
                {listing.baths} bath{listing.baths === 1 ? "" : "s"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-2">
                <Users className="size-4" />
                Up to {listing.maxGuests} guests
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-2">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {listing.rating.toFixed(1)} rating
              </span>
            </div>

            <p className="mt-8 leading-relaxed text-zinc-600">
              {listing.description}
            </p>
          </div>

          <aside className="w-full shrink-0 rounded-2xl border border-[#e8eeeb] bg-white p-6 shadow-lg lg:max-w-sm">
            <p className="text-3xl font-bold text-[var(--nestfind-green)]">
              {formatPrice(listing.pricePerNight)}
              <span className="text-base font-normal text-zinc-500">
                {" "}
                / night
              </span>
            </p>
            <Button type="button" className="mt-6 w-full" size="lg">
              Check availability
            </Button>
            <p className="mt-3 text-center text-xs text-zinc-500">
              You won&apos;t be charged yet
            </p>
          </aside>
        </div>
      </Container>
    </article>
  );
}
