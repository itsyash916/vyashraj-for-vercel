import { useState, useCallback } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BookSection from "@/components/BookSection";
import StatsSection from "@/components/StatsSection";
import BookGallery from "@/components/BookGallery";
import PoemPreview from "@/components/PoemPreview";
import WhySection from "@/components/WhySection";
import CountdownSection from "@/components/CountdownSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const handleComplete = useCallback(() => setLoading(false), []);

  return (
    <div className="min-h-screen bg-background">
      {loading && <Preloader onComplete={handleComplete} />}
      <Navbar />
      <HeroSection />
      <BookSection />
      <StatsSection />
      <BookGallery />
      <WhySection />
      <PoemPreview />
      <CountdownSection />
      <TestimonialsSection />
      <AboutSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
};

export default Index;
