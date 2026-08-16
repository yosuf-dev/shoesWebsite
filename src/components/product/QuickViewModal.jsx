import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Scale, Eye } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ProductImage from '../ui/ProductImage';
import Rating from '../ui/Rating';
import PriceTag from '../ui/PriceTag';
import Badge from '../ui/Badge';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCompare } from '../../contexts/CompareContext';
import { useToast } from '../../contexts/ToastContext';
import { toFaDigits, cn } from '../../utils/format';

export default function QuickViewModal({ product, open, onClose }) {
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState(product?.sizes?.[Math.floor(product?.sizes?.length / 2)] || null);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();
  const toast = useToast();

  if (!product) return null;

  const color = product.colors?.[colorIndex];
  const stockAvailable = product.stock > 0;

  const handleAdd = () => {
    if (!size) return toast.error('لطفاً سایز را انتخاب کنید');
    addItem(product, { color: colorIndex, size });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="grid gap-6 md:grid-cols-2">
        {/* تصویر */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-muted/30 to-transparent">
          <ProductImage product={product} colorIndex={colorIndex} className="h-full w-full object-cover" />
          <div className="absolute right-4 top-4 flex flex-col gap-2">
            {product.discountPercent > 0 && (
              <Badge variant="danger">{toFaDigits(product.discountPercent)}٪ تخفیف</Badge>
            )}
            {product.isNew && <Badge variant="success">جدید</Badge>}
          </div>
        </div>

        {/* جزئیات */}
        <div>
          <span className="text-sm font-medium text-brand-600 dark:text-brand-300">{product.brand.name}</span>
          <h3 className="mt-1 font-morabba font-bold text-2xl text-foreground">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <Rating value={product.rating} count={product.reviewCount} />
          </div>

          <div className="mt-4">
            <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
          </div>

          <p className="mt-4 text-sm leading-7 text-muted-foreground line-clamp-3">{product.description}</p>

          {/* انتخاب رنگ */}
          {product.colors?.length > 0 && (
            <div className="mt-5">
              <p className="label-app">رنگ: {color?.name}</p>
              <div className="flex gap-2.5">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setColorIndex(i)}
                    className={cn(
                      'h-9 w-9 rounded-full border-2 transition-all',
                      colorIndex === i
                        ? 'border-brand-600 scale-110 shadow-glow-sm'
                        : 'border-border hover:scale-105'
                    )}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* انتخاب سایز */}
          <div className="mt-5">
            <p className="label-app">سایز: {size ? toFaDigits(size) : 'انتخاب کنید'}</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    'h-10 min-w-11 rounded-xl border px-3 text-sm font-medium transition-all',
                    size === s
                      ? 'border-brand-600 bg-brand-gradient text-white shadow-glow-sm'
                      : 'border-border bg-surface text-foreground hover:border-brand-500'
                  )}
                >
                  {toFaDigits(s)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className={cn(
              'text-xs font-medium',
              stockAvailable ? 'text-emerald-500' : 'text-red-500'
            )}>
              {stockAvailable ? `موجودی: ${toFaDigits(product.stock)} عدد` : 'ناموجود'}
            </span>
          </div>

          {/* اکشن‌ها */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={handleAdd} icon={ShoppingBag} className="flex-1">
              افزودن به سبد خرید
            </Button>
            <Button
              variant={isInWishlist(product.id) ? 'danger' : 'secondary'}
              onClick={() => toggleWishlist(product.id)}
              className="!px-4"
              icon={Heart}
            />
            <Button
              variant={isInCompare(product.id) ? 'primary' : 'secondary'}
              onClick={() => toggleCompare(product.id)}
              className="!px-4"
              icon={Scale}
            />
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-300 hover:underline"
          >
            <Eye size={15} />
            مشاهده کامل محصول
          </Link>
        </div>
      </div>
    </Modal>
  );
}
