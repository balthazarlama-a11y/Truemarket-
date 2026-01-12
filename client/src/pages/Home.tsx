import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TrueBoxBanner } from "@/components/home/TrueBoxBanner";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <HowItWorks />
        <TrueBoxBanner />
      </main>
      <Footer />
    </div>
  );
}