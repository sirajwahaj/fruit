import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoBar } from "@/components/home/PromoBar";
import { BannerSection } from "@/components/home/BannerSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <PromoBar />
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <BannerSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
