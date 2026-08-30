import { SignIn } from "@clerk/nextjs";

import { AuthShell } from "@/components/auth/auth-shell";

const hideClerkChrome = {
  elements: {
    logoBox: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
  },
};

export default function Page() {
  return (
    <AuthShell title="Sign in" sub="Open your catalog workspace.">
      <SignIn
        forceRedirectUrl="/dashboard"
        fallbackRedirectUrl="/dashboard"
        appearance={hideClerkChrome}
      />
    </AuthShell>
  );
}
