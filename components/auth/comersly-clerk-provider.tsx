"use client";

import { ClerkProvider } from "@clerk/nextjs";

import { useTheme } from "@/components/theme/theme-provider";
import { comerslyClerkAppearance } from "@/lib/clerk-appearance";

export function ComerslyClerkProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={comerslyClerkAppearance(theme)}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  );
}
