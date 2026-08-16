import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Scale } from 'lucide-react';
import ProductImage from '../ui/ProductImage';
import PriceTag from '../ui/PriceTag';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import QuickViewModal from '../product/QuickViewModal';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCompare } from '../../contexts/CompareContext';
import { useToast } from '../../contexts/ToastContext';
import { toFaDigits, cn } from '../../utils/format';

function ProductCard({ product, index = 0 }) {
  const [quickView, setQuickView] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();
  const toast = useToast();

  const wishlisted = isInWishlist(product.id);
  const compared = isInCompare(product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, { size: product.sizes[Math.floor(product.sizes.length / 2)] });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    toast[added ? 'success' : 'info'](
      added ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد',
      product.name
    );
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product.id);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickView(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: (index % 5) * 0.06 }}
        className="group relative"
      >
        <Link
          to={`/product/${product.slug}`}
          className="relative block overflow-hidden rounded-3xl border border-border/60 bg-card shadow-softer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
        >
          {/* تصویر */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/30 to-transparent">
            <ProductImage
              product={product}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* نشان‌ها */}
            <div className="absolute right-3 top-3 flex flex-col items-start gap-2">
              {product.discountPercent > 0 && (
                <Badge variant="danger" className="shadow">{toFaDigits(product.discountPercent)}٪ تخفیف</Badge>
              )}
              {product.isNew && <Badge variant="success">جدید</Badge>}
              {product.limited && <Badge variant="warning">نسخه محدود</Badge>}
              {product.flashSale && <Badge variant="warning">فروش ویژه</Badge>}
            </div>

            {/* اکشن‌ها */}
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              <button
                onClick={handleWishlist}
                className={cn(
                  'grid h-9 w-9 place-items-center rounded-full backdrop-blur-md transition-all duration-300',
                  wishlisted
                    ? 'bg-rose-500 text-white shadow-glow-sm'
                    : 'bg-white/85 text-foreground hover:bg-rose-500 hover:text-white',
                  'opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0'
                )}
                aria-label="علاقه‌مندی"
              >
                <Heart size={17} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleCompare}
                className={cn(
                  'grid h-9 w-9 place-items-center rounded-full backdrop-blur-md transition-all duration-300',
                  compared
                    ? 'bg-brand-600 text-white shadow-glow-sm'
                    : 'bg-white/85 text-foreground hover:bg-brand-600 hover:text-white',
                  'opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-delay-50'
                )}
                aria-label="مقایسه"
              >
                <Scale size={16} />
              </button>
              <button
                onClick={handleQuickView}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/85 text-foreground backdrop-blur-md transition-all duration-300 hover:bg-brand-600 hover:text-white opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-delay-100"
                aria-label="مشاهده سریع"
              >
                <Eye size={17} />
              </button>
            </div>

            {/* دکمه افزودن به سبد */}
            <button
              onClick={handleAdd}
              className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-xl bg-foreground/90 text-background backdrop-blur-md py-2.5 text-sm font-semibold opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-brand-600 hover:text-white"
            >
              <ShoppingBag size={16} />
              افزودن به سبد خرید
            </button>
          </div>

          {/* اطلاعات */}
          <div className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-brand-600 dark:text-brand-300">
                {product.brand.name}
              </span>
              <Rating value={product.rating} count={product.reviewCount} showValue={false} size={13} />
            </div>
            <h3 className="mb-2 truncate font-morabba font-semibold text-base text-foreground transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
              <span className="text-[11px] text-muted-foreground">
                {toFaDigits(product.rating.toFixed(1))}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>

      <QuickViewModal product={product} open={quickView} onClose={() => setQuickView(false)} />
    </>
  );
}

export default memo(ProductCard);
