"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/common/logo";
import { Container } from "@/components/layout/container";
import { Button, buttonVariantsFn } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Explore" },
  { href: "/listings", label: "My trips" },
  { href: "/listings?saved=true", label: "Saved" },
  { href: "/host", label: "Host your place" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header data-testid="navbar" className="sticky top-0 z-40 border-b border-[#e5ebe8] bg-white/95 backdrop-blur-md">
      <Container>
        <div className="flex h-[72px] items-center justify-between gap-4">
          <Logo />

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={cn(
                buttonVariantsFn({ variant: "outline", size: "sm" }),
                "hidden sm:inline-flex",
              )}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className={cn(buttonVariantsFn({ size: "sm" }), "hidden sm:inline-flex")}
            >
              Sign up
            </Link>
            <Button
              type="button"
              data-testid="mobile-menu-toggle"
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen ? (
          <nav
            data-testid="mobile-nav"
            className="flex flex-col gap-3 border-t border-zinc-100 py-4 md:hidden"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-700"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link
                href="/login"
                className={cn(buttonVariantsFn({ variant: "outline" }), "flex-1")}
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className={cn(buttonVariantsFn(), "flex-1")}
                onClick={() => setMobileOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </nav>
        ) : null}
      </Container>
    </header>
  );
}
