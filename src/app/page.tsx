import { Hero } from "@/components/home/hero";
import { Therapists } from "@/components/home/therapists";
import { Massages } from "@/components/home/massages";
import { About } from "@/components/home/about";
import { Reviews } from "@/components/home/reviews";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Therapists />
      <Massages />
      <Reviews />
      <Footer />
    </main>
  );
}
