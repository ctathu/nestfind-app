import { Container } from "@/components/layout/container";

export default function ListingDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[72px] border-b border-zinc-100" />
      <div className="aspect-[21/9] animate-pulse bg-zinc-100" />
      <Container className="py-10">
        <div className="h-4 w-32 animate-pulse rounded bg-zinc-100" />
        <div className="mt-6 h-10 w-2/3 animate-pulse rounded bg-zinc-100" />
        <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-zinc-100" />
        <div className="mt-8 h-32 animate-pulse rounded-2xl bg-zinc-100" />
      </Container>
    </div>
  );
}
