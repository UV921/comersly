import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "Comersly — AI classification for industrial catalogs",
  description:
    "Interpret each spreadsheet row, verify the manufacturer, write Dept, Class, Fine, and Classpath with confidence, then export the 252-column delivery file.",
};

export default function HomePage() {
  return <LandingPage />;
}
