import { LoadingGrid } from "@/components/common/loading-grid";
import { Container } from "@/components/layout/container";

export default function ListingsLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[72px] animate-pulse border-b border-zinc-100 bg-zinc-50" />
      <Container className="py-12">
        <div className="mb-8 h-32 animate-pulse rounded-2xl bg-zinc-100" />
        <LoadingGrid count={6} className="sm:grid-cols-2 lg:grid-cols-3" />
      </Container>
    </div>
  );
}
