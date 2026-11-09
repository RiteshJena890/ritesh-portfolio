import { ParticleField } from "@/components/gl/particle-field";
import { Cursor } from "@/components/core/cursor";
import { Nav } from "@/components/core/nav";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Capabilities } from "@/components/sections/capabilities";
import { Stack } from "@/components/sections/stack";
import { Journey } from "@/components/sections/journey";
import { Work } from "@/components/sections/work";
import { Recognition } from "@/components/sections/recognition";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <ParticleField />
      <Cursor />
      <Nav />
      <main id="main" className="content">
        <Hero />
        <About />
        <Capabilities />
        <Stack />
        <Journey />
        <Work />
        <Recognition />
        <Contact />
      </main>
    </>
  );
}
