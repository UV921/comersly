import { SignUp } from "@clerk/nextjs";

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
    <AuthShell title="Start" sub="Upload a spreadsheet. Get a catalog.">
      <SignUp
        forceRedirectUrl="/dashboard"
        fallbackRedirectUrl="/dashboard"
        appearance={hideClerkChrome}
      />
    </AuthShell>
  );
}
