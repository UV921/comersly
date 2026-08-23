import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Landscape } from "@/components/landing/landscape";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function Page() {
  return (
    <div className="relative min-h-full overflow-hidden">
      <Landscape
        id="signin-landscape"
        variant="grove"
        kenBurns
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-[var(--hero-overlay)]" />
      <div className="relative flex min-h-full flex-col items-center justify-center px-4 py-10">
        <div className="mb-6 flex w-full max-w-md items-center justify-between">
          <Logo />
          <ThemeToggle compact />
        </div>
        <div className="w-full max-w-md surface-card p-6">
          <p className="mb-4 text-center font-serif text-2xl tracking-tight">
            Welcome back
          </p>
          <SignIn fallbackRedirectUrl="/dashboard" />
        </div>
        <Link href="/" className="mt-6 text-sm text-muted hover:text-foreground">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
