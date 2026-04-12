import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutImpulseSection from "@/components/AboutImpulseSection";

const AProposPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-[45px]">
        <AboutImpulseSection />
      </div>
      <Footer />
    </div>
  );
};

export default AProposPage;
