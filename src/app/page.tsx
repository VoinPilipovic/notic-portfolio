import { About } from "@/components/sections/About";
import { CapabilitiesLab } from "@/components/sections/CapabilitiesLab";
import { Contact } from "@/components/sections/Contact";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { Identity } from "@/components/sections/Identity";
import { Lab } from "@/components/sections/Lab";
import { NoticOSTeaser } from "@/components/sections/NoticOSTeaser";
import { OSIntro } from "@/components/sections/OSIntro";
import { SelectedWork } from "@/components/sections/SelectedWork";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Identity />
      <SelectedWork />
      <NoticOSTeaser />
      <CapabilitiesLab />
      <About />
      <Lab />
      <FAQ />
      <Contact />
      {/* The full NOTIC OS entry - boot sequence into the working desktop -
          stays last: the teaser earlier gives it away within the first few
          scrolls, this is where visitors who want the whole thing enter it. */}
      <OSIntro />
    </main>
  );
}
