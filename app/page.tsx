import HeroSlider from "@/components/HeroSlider";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import WhyChooseUs from "@/components/WhyChooseUs";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <main className="min-h-screen pb-24 md:pb-0">
      <HeroSlider />
      <Categories />
      <FeaturedProducts />
      <WhyChooseUs />
      <Newsletter />
    </main>
  );
}
