import type { Theme } from "@/components/theme/theme-provider";

const sharedElements = {
  logoBox: "justify-center",
  logoImage: "h-8 w-8",
  card: "rounded-[28px] bg-surface shadow-none ring-1 ring-border",
  cardBox: "shadow-none",
  headerTitle: "text-lg font-semibold tracking-tight text-foreground",
  headerSubtitle: "text-sm text-muted",
  socialButtonsBlockButton:
    "rounded-xl bg-canvas text-foreground ring-1 ring-border hover:bg-surface-muted",
  socialButtonsBlockButtonText: "text-sm font-medium",
  dividerLine: "bg-border",
  dividerText: "text-muted",
  formFieldLabel: "text-sm font-medium text-foreground",
  formFieldInput:
    "rounded-xl bg-canvas text-foreground ring-1 ring-border placeholder:text-muted",
  formButtonPrimary:
    "h-10 rounded-full bg-accent text-sm font-medium text-white shadow-none hover:bg-accent-hover",
  footer: "bg-transparent",
  footerActionText: "text-sm text-muted",
  footerActionLink: "text-sm font-medium text-accent hover:text-accent-hover",
  identityPreview: "rounded-xl bg-canvas ring-1 ring-border",
  formFieldSuccessText: "text-accent",
  formFieldErrorText: "text-failed",
  alert: "rounded-xl bg-accent-soft text-foreground",
  badge: "hidden",
  userButtonPopoverCard: "rounded-2xl bg-surface ring-1 ring-border shadow-none",
  userButtonPopoverActionButton: "text-foreground hover:bg-surface-muted",
  userButtonPopoverActionButtonText: "text-sm",
  userButtonPopoverFooter: "hidden",
  userPreviewMainIdentifier: "text-foreground",
  userPreviewSecondaryIdentifier: "text-muted",
  userButtonPopoverMain: "bg-surface",
  modalContent: "bg-surface",
  modalCloseButton: "text-muted hover:text-foreground",
};

function variables(theme: Theme) {
  if (theme === "dark") {
    return {
      colorBackground: "#16211e",
      colorForeground: "#f3efe6",
      colorPrimary: "#5ec8b0",
      colorPrimaryForeground: "#0c1412",
      colorMuted: "#111a17",
      colorMutedForeground: "#8a9a94",
      colorInput: "#0c1412",
      colorInputForeground: "#f3efe6",
      colorNeutral: "#8a9a94",
      colorDanger: "#e07a6a",
      colorSuccess: "#5ec8b0",
      colorWarning: "#e0c36a",
      colorBorder: "rgba(243, 239, 230, 0.12)",
      borderRadius: "0.75rem",
      fontFamily: "var(--font-workspace-family), ui-sans-serif, system-ui, sans-serif",
      fontFamilyButtons: "var(--font-workspace-family), ui-sans-serif, system-ui, sans-serif",
    };
  }

  return {
    colorBackground: "#ffffff",
    colorForeground: "#1a1a1a",
    colorPrimary: "#1e4d40",
    colorPrimaryForeground: "#ffffff",
    colorMuted: "#efece6",
    colorMutedForeground: "#717171",
    colorInput: "#f6f4ef",
    colorInputForeground: "#1a1a1a",
    colorNeutral: "#717171",
    colorDanger: "#c45c4a",
    colorSuccess: "#1e4d40",
    colorWarning: "#c4a35a",
    colorBorder: "#e8e4dc",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-workspace-family), ui-sans-serif, system-ui, sans-serif",
    fontFamilyButtons: "var(--font-workspace-family), ui-sans-serif, system-ui, sans-serif",
  };
}

export function comerslyClerkAppearance(theme: Theme) {
  return {
    layout: {
      logoImageUrl: "/comersly-mark.svg",
      logoLinkUrl: "/",
      logoPlacement: "inside" as const,
      socialButtonsPlacement: "bottom" as const,
      socialButtonsVariant: "blockButton" as const,
      shimmer: false,
      unsafe_disableDevelopmentModeWarnings: true,
    },
    variables: variables(theme),
    elements: sharedElements,
  };
}
