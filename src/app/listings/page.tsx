import { Suspense } from "react";
import { ListingsPageClient } from "@/components/features/listings/listings-page-client";
import { LoadingGrid } from "@/components/common/loading-grid";
import { Container } from "@/components/layout/container";

export const metadata = {
  title: "Search stays | NestFind",
  description: "Browse apartments, studios, and homes across Vietnam.",
};

function ListingsFallback() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[72px] border-b border-zinc-100" />
      <Container className="py-12">
        <LoadingGrid count={6} className="sm:grid-cols-2 lg:grid-cols-3" />
      </Container>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<ListingsFallback />}>
      <ListingsPageClient />
    </Suspense>
  );
}
