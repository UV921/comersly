import type { Metadata } from "next";
import { Inter, Geist_Mono, Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";

import { ComerslyClerkProvider } from "@/components/auth/comersly-clerk-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans-family",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: "400",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-workspace-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Comersly",
  description: "Industrial product intelligence workspace",
  icons: {
    icon: "/comersly-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${instrumentSerif.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas text-foreground">
        <Script
          id="comersly-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("comersly-theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.dataset.theme="light"}})();`,
          }}
        />
        <ThemeProvider>
          <ComerslyClerkProvider>{children}</ComerslyClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
