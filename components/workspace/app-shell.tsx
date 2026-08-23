"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/imports", label: "Imports" },
  { href: "/products", label: "Products" },
  { href: "/exports", label: "Exports" },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent-soft text-accent"
                : "text-muted hover:bg-surface-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-full lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="hidden border-r border-border bg-surface lg:flex lg:min-h-full lg:flex-col">
        <div className="flex h-16 items-center border-b border-border px-4">
          <Logo href="/dashboard" />
        </div>
        <div className="flex-1 px-3 py-4">
          <NavLinks pathname={pathname} />
        </div>
        <div className="space-y-3 border-t border-border px-4 py-4">
          <ThemeToggle compact />
          <UserButton
            appearance={{
              elements: {
                rootBox: "w-full",
                userButtonBox: "w-full justify-start",
              },
            }}
          />
        </div>
      </aside>

      <div className="flex min-h-full flex-col bg-background">
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
          <Logo href="/dashboard" />
          <div className="flex items-center gap-3">
            <ThemeToggle compact />
            <UserButton />
            <button
              type="button"
              className="rounded-full border border-border px-3 py-1.5 text-sm"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
            >
              Menu
            </button>
          </div>
        </header>

        {open ? (
          <div className="border-b border-border bg-surface px-3 py-3 lg:hidden">
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        ) : null}

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
