import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "Comersly — AI classification for industrial catalogs",
  description:
    "Just upload a messy spreadsheet. Get the commerce-ready file in one click.",
};

export default function HomePage() {
  return <LandingPage />;
}
