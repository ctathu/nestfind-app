import Link from "next/link";
import { Globe, Share2, Mail } from "lucide-react";
import { Container } from "@/components/layout/container";

export function Footer() {
  return (
    <footer className="border-t border-[#e5ebe8] bg-white">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <p className="text-sm text-zinc-500">
          © 2026 NestFind ·{" "}
          <Link href="/terms" className="hover:text-zinc-800">
            Terms
          </Link>{" "}
          ·{" "}
          <Link href="/privacy" className="hover:text-zinc-800">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/sitemap" className="hover:text-zinc-800">
            Sitemap
          </Link>
        </p>
        <div className="flex items-center gap-4 text-zinc-400">
          <Link href="#" aria-label="Website" className="hover:text-zinc-600">
            <Globe className="size-4" />
          </Link>
          <Link href="#" aria-label="Share" className="hover:text-zinc-600">
            <Share2 className="size-4" />
          </Link>
          <Link href="#" aria-label="Contact" className="hover:text-zinc-600">
            <Mail className="size-4" />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
