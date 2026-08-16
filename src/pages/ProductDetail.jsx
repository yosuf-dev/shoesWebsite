import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Store } from 'lucide-react';
import { getProduct } from '../services/productService';
import Breadcrumb from '../components/ui/Breadcrumb';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import ProductGallery from '../components/product/ProductGallery';
import ProductBuyBox from '../components/product/ProductBuyBox';
import ProductTabs from '../components/product/ProductTabs';
import RelatedProducts from '../components/product/RelatedProducts';
import BuyTogether from '../components/product/BuyTogether';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { toFaDigits } from '../utils/format';

/**
 * صفحه جزئیات محصول — مسیر /product/:slug
 */
export default function ProductDetail() {
  const { slug } = useParams();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setProduct(null);
    setColorIndex(0);

    getProduct(slug).then((data) => {
      if (!active) return;
      if (!data) {
        setNotFound(true);
      } else {
        setProduct(data);
        addRecentlyViewed(data);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} | کفشینو`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = product.description;
  }, [product]);

  /* ---------- لودینگ ---------- */
  if (loading) {
    return (
      <div className="container-app py-8 lg:py-12">
        <Skeleton className="mb-8 h-5 w-64" />
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full !rounded-3xl" />
          <div className="space-y-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-16 w-2/3" />
            <Skeleton className="h-5 w-40" />
            <div className="flex gap-2.5 pt-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-11 w-11 !rounded-full" />
              ))}
            </div>
            <div className="flex gap-3 pt-3">
              <Skeleton className="h-14 flex-1" />
              <Skeleton className="h-14 flex-1" />
            </div>
          </div>
        </div>
        <Skeleton className="mt-14 h-72 w-full !rounded-3xl" />
      </div>
    );
  }

  /* ---------- یافت نشد ---------- */
  if (notFound || !product) {
    return (
      <div className="container-app py-20">
        <EmptyState
          title="محصول یافت نشد"
          description="متاسفانه محصول مورد نظر شما در فروشگاه موجود نیست. از فروشگاه دیدن کنید یا جستجو را تغییر دهید."
          icon="package"
          action={
            <Link to="/shop">
              <Button icon={Store}>رفتن به فروشگاه</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const related = product.related || [];
  const together = related.slice(0, 3);

  return (
    <>
      <div className="container-app py-8 lg:py-12">
        {/* برادکرمب */}
        <Breadcrumb
          className="mb-8"
          items={[
            { to: '/shop', label: 'فروشگاه' },
            { to: `/shop?category=${product.category.slug}`, label: product.category.name },
            product.name,
          ]}
        />

        {/* گالری + جعبه خرید */}
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-2">
            <ProductGallery
              key={`g-${product.id}`}
              product={product}
              colorIndex={colorIndex}
              onColorChange={setColorIndex}
            />
            <ProductBuyBox
              key={`b-${product.id}`}
              product={product}
              colorIndex={colorIndex}
              onColorChange={setColorIndex}
            />
          </div>
        </Reveal>

        {/* خرید با هم */}
        {together.length > 0 && <BuyTogether product={product} suggestions={together} />}

        {/* تب‌ها */}
        <Reveal className="mt-14">
          <ProductTabs key={`t-${product.id}`} product={product} />
        </Reveal>
      </div>

      {/* محصولات مرتبط */}
      <RelatedProducts products={related} />
    </>
  );
}
