import { Loader } from "@/components/sections/loader";
import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Stack } from "@/components/sections/stack";
import { Experience } from "@/components/sections/experience";
import { Work } from "@/components/sections/work";
import { Recognition } from "@/components/sections/recognition";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Cursor } from "@/components/motion/cursor";

export default function Home() {
  return (
    <>
      <Loader />
      <Cursor />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Stack />
        <Experience />
        <Work />
        <Recognition />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
