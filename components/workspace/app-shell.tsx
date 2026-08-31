"use client";

import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import {
  IconBell,
  IconFileExport,
  IconFileImport,
  IconLayoutDashboard,
  IconPackage,
  IconSearch,
  IconUpload,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ComerslyMark } from "@/components/brand/comersly-mark";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/products", label: "Catalog", icon: IconPackage },
  { href: "/imports", label: "Imports", icon: IconFileImport },
  { href: "/upload", label: "Upload", icon: IconUpload },
  { href: "/exports", label: "Exports", icon: IconFileExport },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function WorkspaceLogo() {
  const { open, animate } = useSidebar();

  return (
    <Link
      href="/dashboard"
      className="relative z-20 flex items-center gap-2.5 py-1 text-sm"
    >
      <ComerslyMark className="h-8 w-8" />
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-[15px] font-semibold tracking-tight whitespace-pre text-foreground"
      >
        Comersly
      </motion.span>
    </Link>
  );
}

function WorkspaceSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <form
      className="relative w-full max-w-xl flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        const value = query.trim();
        router.push(value ? `/products?q=${encodeURIComponent(value)}` : "/products");
      }}
    >
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
        <IconSearch className="h-4 w-4" />
      </span>
      <input
        ref={inputRef}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products"
        className="h-10 w-full rounded-full bg-surface-muted pr-12 pl-10 text-sm outline-none placeholder:text-muted"
      />
      <span className="pointer-events-none absolute inset-y-0 right-3 hidden items-center text-[11px] text-muted sm:flex">
        ⌘K
      </span>
    </form>
  );
}

function WorkspaceLinks({ pathname }: { pathname: string }) {
  return (
    <div className="mt-8 flex flex-col gap-2">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);

        return (
          <SidebarLink
            key={item.href}
            className={active ? "text-accent" : "text-muted hover:text-foreground"}
            link={{
              href: item.href,
              label: item.label,
              icon: (
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    active ? "text-accent" : "text-muted",
                  )}
                />
              ),
            }}
          />
        );
      })}
    </div>
  );
}

function AccountButton() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "h-7 w-7",
          userButtonPopoverFooter: "hidden",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Action label="manageAccount" />
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
    </UserButton>
  );
}

function SidebarAccount() {
  const { user } = useUser();
  const { open, animate } = useSidebar();
  const name = user?.fullName || user?.firstName || "Account";
  const showLabel = !animate || open;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 py-2">
        <AccountButton />
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="truncate text-sm whitespace-pre text-foreground"
        >
          {name}
        </motion.span>
      </div>
      {showLabel ? (
        <SignOutButton redirectUrl="/">
          <button
            type="button"
            className="rounded-lg px-1 py-1 text-left text-sm text-muted hover:text-foreground"
          >
            Sign out
          </button>
        </SignOutButton>
      ) : null}
    </div>
  );
}

export function AppShell({
  children,
  processingCount = 0,
}: {
  children: React.ReactNode;
  processingCount?: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="workspace-shell flex h-dvh w-full flex-1 overflow-hidden bg-canvas">
      <Sidebar open={open} setOpen={setOpen}>
        <div className="flex h-full w-full flex-1 flex-col overflow-hidden md:flex-row">
          <SidebarBody className="justify-between gap-10 bg-canvas">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              <WorkspaceLogo />
              <WorkspaceLinks pathname={pathname} />
            </div>
            <SidebarAccount />
          </SidebarBody>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-surface md:rounded-tl-2xl md:ring-1 md:ring-inset md:ring-border">
            <header className="flex h-[72px] shrink-0 items-center gap-3 px-5 sm:px-8">
              <SidebarTrigger className="bg-surface-muted" />
              <WorkspaceSearch />
              <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
                <Link
                  href="/imports"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-muted hover:text-foreground"
                  aria-label="Imports"
                >
                  <IconBell className="h-5 w-5" />
                  {processingCount > 0 ? (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
                  ) : null}
                </Link>
                <AccountButton />
              </div>
            </header>

            <main className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-6xl px-5 pb-12 sm:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
