import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Sans, Syne } from "next/font/google";

import { AtmosphereBackbone } from "@/components/layout/AtmosphereBackbone";
import { CursorLight } from "@/components/shared/CursorLight";
import { FloatingNav } from "@/components/layout/FloatingNav/FloatingNav";
import { OSLauncherProvider } from "@/components/layout/OSLauncher/OSLauncherContext";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";

import "./globals.css";

// The site's three faces, loaded once and applied globally via the
// `--font-display` / `--font-sans` / `--font-mono` tokens in tokens.css -
// no more Geist. `latin-ext` on each is required for Serbian Latin
// (č ć ž š đ); verify actual glyph coverage by rendering those five
// characters before relying on this for real Serbian copy.

// Display - large headings, project titles and the NOTIC wordmark.
// Distinctive and geometric on purpose; replaces Fraunces, which read as
// too editorial/luxury-fashion for a "premium creative engineering" identity.
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin", "latin-ext"],
});

// System/terminal/metadata register - boot log, timestamps, project IDs,
// status labels - kept deliberately distinct from the body face so the
// site's technical details read as their own register.
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"],
});

// Body/navigation/UI - paragraphs, nav labels, buttons, cards, descriptions.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "NOTIC | Creative Developer & Digital Storyteller",
  description:
    "NOTIC builds animated, interactive websites where design, motion and code turn ordinary ideas into digital worlds people remember.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${ibmPlexMono.variable} ${instrumentSans.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <OSLauncherProvider>
          <AtmosphereBackbone />
          <CursorLight />
          <FloatingNav />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </OSLauncherProvider>
      </body>
    </html>
  );
}
