import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryCardsSection from "@/components/CategoryCardsSection";
import TrendingProducts from "@/components/TrendingProducts";
import AboutImpulseSection from "@/components/AboutImpulseSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroCarousel />
      <CategoryCardsSection />
      <TrendingProducts />
      <AboutImpulseSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
