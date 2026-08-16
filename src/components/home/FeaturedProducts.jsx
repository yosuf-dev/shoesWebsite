import { useEffect, useState } from 'react';
import { getFeaturedProducts } from '../../services/productService';
import ProductGrid from '../product/ProductGrid';
import SectionHeading from '../ui/SectionHeading';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="container-app py-16">
      <SectionHeading
        eyebrow="منتخب کفشینو"
        title="محصولات ویژه"
        subtitle="برترین انتخاب‌های این فصل را از میان جدیدترین مدل‌های برندهای معتبر ببینید."
        link="/shop"
      />
      <ProductGrid products={products} loading={loading} cols="4" />
    </section>
  );
}
