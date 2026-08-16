import { useEffect, useState } from 'react';
import { PRODUCTS } from '../../data/mockData';
import ProductGrid from '../product/ProductGrid';
import SectionHeading from '../ui/SectionHeading';

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProducts(
        [...PRODUCTS]
          .filter((p) => p.bestSeller)
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .slice(0, 5)
      );
      setLoading(false);
    }, 300);
  }, []);

  return (
    <section className="container-app py-16">
      <SectionHeading
        eyebrow="محبوب‌ترین‌ها"
        title="پرفروش‌ترین کفش‌ها"
        subtitle="محصولاتی که مشتریان کفشینو بیشتر از همه دوست دارند."
        link="/shop?sort=best-seller"
      />
      <ProductGrid products={products} loading={loading} cols="5" />
    </section>
  );
}
