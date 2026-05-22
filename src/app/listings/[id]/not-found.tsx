import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/layout/container";

export default function ListingNotFound() {
  return (
    <>
      <Navbar />
      <main>
        <Container className="py-20">
          <EmptyState
            title="Listing not found"
            description="This stay may have been removed or the link is incorrect."
            action={
              <Link
                href="/listings"
                className="text-sm font-semibold text-[var(--nestfind-green)] hover:underline"
              >
                Browse all listings
              </Link>
            }
          />
        </Container>
      </main>
      <Footer />
    </>
  );
}
