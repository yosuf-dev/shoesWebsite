import ProductGrid from './ProductGrid';
import SectionHeading from '../ui/SectionHeading';

/**
 * محصولات مرتبط — نمایش در قالب ProductGrid
 */
export default function RelatedProducts({ products, loading = false }) {
  if (!loading && !products?.length) return null;

  return (
    <section className="container-app py-16">
      <SectionHeading
        eyebrow="پیشنهاد کفشینو"
        title="محصولات مرتبط"
        subtitle="محصولاتی که شاید به آن‌ها هم علاقه‌مند باشید."
      />
      <ProductGrid products={products} loading={loading} cols="4" />
    </section>
  );
}
