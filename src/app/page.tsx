import { About } from "@/components/about";
import { Contact, SiteFooter } from "@/components/closing";
import { Explore } from "@/components/explore";
import { Halls } from "@/components/halls";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <Halls />
        <About />
        <Explore />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
