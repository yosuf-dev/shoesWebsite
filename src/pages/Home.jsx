import Hero from '../components/home/Hero';
import BrandsStrip from '../components/home/BrandsStrip';
import CategoryShowcase from '../components/home/CategoryShowcase';
import FeaturedProducts from '../components/home/FeaturedProducts';
import FlashSale from '../components/home/FlashSale';
import LimitedEdition from '../components/home/LimitedEdition';
import BestSellers from '../components/home/BestSellers';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <BrandsStrip />
      <CategoryShowcase />
      <FeaturedProducts />
      <FlashSale />
      <LimitedEdition />
      <BestSellers />
      <Testimonials />
      <Newsletter />
    </>
  );
}
