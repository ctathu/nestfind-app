import { LoadingGrid } from "@/components/common/loading-grid";
import { Container } from "@/components/layout/container";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[72px] animate-pulse border-b border-zinc-100 bg-zinc-50" />
      <div className="h-64 bg-[var(--nestfind-hero)]" />
      <Container className="py-12">
        <LoadingGrid count={4} />
      </Container>
    </div>
  );
}
