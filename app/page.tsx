import { About } from "@/components/About";
import { ConversionFlow } from "@/components/ConversionFlow";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Pricing } from "@/components/Pricing";
import { Product } from "@/components/Product";
import { Trust } from "@/components/Trust";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Product />
        <Pricing />
        <ConversionFlow />
        <Trust />
      </main>
      <Footer />
    </>
  );
}
