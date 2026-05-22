import { notFound } from "next/navigation";
import { ListingDetail } from "@/components/features/listings/listing-detail";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getPropertyForPage } from "@/server/data/get-property";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const listing = await getPropertyForPage(id);
  return {
    title: listing ? `${listing.title} | NestFind` : "Listing | NestFind",
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await getPropertyForPage(id);

  if (!listing) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <ListingDetail listing={listing} />
      </main>
      <Footer />
    </>
  );
}
