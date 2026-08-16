import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import ProductImage from '../components/ui/ProductImage';
import PriceTag from '../components/ui/PriceTag';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import SectionHeading from '../components/ui/SectionHeading';
import ProductGrid from '../components/product/ProductGrid';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { PRODUCTS } from '../data/mockData';
import { toFaDigits } from '../utils/format';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const toast = useToast();

  const wishlistProducts = useMemo(
    () => PRODUCTS.filter((p) => wishlist.includes(p.id)),
    [wishlist]
  );

  const suggestions = useMemo(() => {
    const categorySlugs = new Set(wishlistProducts.map((p) => p.category.slug));
    const pool = PRODUCTS.filter(
      (p) => !wishlist.includes(p.id) && (categorySlugs.has(p.category.slug) || p.featured)
    );
    return pool.slice(0, 5);
  }, [wishlist, wishlistProducts]);

  const handleRemove = (product) => {
    removeFromWishlist(product.id);
    toast.info('از علاقه‌مندی‌ها حذف شد', product.name);
  };

  const handleAdd = (product) => {
    addItem(product, { size: product.sizes[Math.floor(product.sizes.length / 2)] });
  };

  return (
    <div className="container-app py-8 lg:py-12">
      <Breadcrumb items={['علاقه‌مندی‌ها']} className="mb-6" />

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-morabba font-bold text-2xl text-foreground sm:text-3xl">علاقه‌مندی‌ها</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {toFaDigits(wishlistProducts.length)} محصول در لیست علاقه‌مندی‌های شما
          </p>
        </div>
        <Link to="/shop">
          <Button variant="secondary" icon={ArrowLeft}>مشاهده محصولات</Button>
        </Link>
      </div>

      {wishlistProducts.length === 0 ? (
        <EmptyState
          title="لیست علاقه‌مندی‌ها خالی است"
          description="محصولات مورد علاقه خود را با کلیک روی قلب محصولات، اینجا ذخیره کنید."
          icon="wishlist"
          action={
            <Link to="/shop">
              <Button icon={Heart}>کاوش در فروشگاه</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
                className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-softer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <Link to={`/product/${p.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/30 to-transparent">
                    <ProductImage
                      product={p}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {p.discountPercent > 0 && (
                      <Badge variant="danger" className="absolute right-3 top-3 shadow">
                        {toFaDigits(p.discountPercent)}٪ تخفیف
                      </Badge>
                    )}
                  </div>
                </Link>

                <button
                  onClick={() => handleRemove(p)}
                  className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-rose-500 shadow backdrop-blur-md transition-all hover:bg-rose-500 hover:text-white"
                  aria-label="حذف از علاقه‌مندی‌ها"
                >
                  <Trash2 size={16} />
                </button>

                <div className="p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-brand-600 dark:text-brand-300">{p.brand.name}</span>
                    <Rating value={p.rating} count={p.reviewCount} showValue={false} size={13} />
                  </div>
                  <Link to={`/product/${p.slug}`}>
                    <h3 className="mb-2 truncate font-morabba font-semibold text-base text-foreground transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
                      {p.name}
                    </h3>
                  </Link>
                  <div className="flex items-end justify-between gap-2">
                    <PriceTag price={p.price} compareAtPrice={p.compareAtPrice} size="sm" />
                    <button
                      onClick={() => handleAdd(p)}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow-sm transition-all hover:scale-105 active:scale-95"
                      aria-label="افزودن به سبد"
                    >
                      <ShoppingBag size={17} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {suggestions.length > 0 && (
            <div className="mt-16">
              <SectionHeading
                eyebrow="برای شما"
                title="پیشنهادهای مشابه"
                subtitle="محصولاتی که ممکن است به سلیقه شما نزدیک باشند."
                link="/shop"
              />
              <ProductGrid products={suggestions} cols="4" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
