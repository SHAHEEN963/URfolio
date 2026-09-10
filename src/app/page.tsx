import { Preloader } from "@/components/sections/Preloader";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Statement } from "@/components/sections/Statement";
import { Audiences } from "@/components/sections/Audiences";
import { Process } from "@/components/sections/Process";
import { Work } from "@/components/sections/Work";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Proof } from "@/components/sections/Proof";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Statement />
        <Audiences />
        <Process />
        <Work />
        <BeforeAfter />
        <Proof />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
