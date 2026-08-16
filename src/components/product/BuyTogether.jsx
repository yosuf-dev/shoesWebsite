import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import ProductImage from '../ui/ProductImage';
import PriceTag from '../ui/PriceTag';
import Button from '../ui/Button';
import Reveal from '../ui/Reveal';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { toFaDigits, formatPrice } from '../../utils/format';

/**
 * «معمولاً با هم خریداری می‌شوند» — ۳ محصول پیشنهادی + محصول اصلی و افزودن همگی به سبد
 */
export default function BuyTogether({ product, suggestions = [] }) {
  const { addItem } = useCart();
  const toast = useToast();

  const all = [product, ...suggestions].filter(Boolean);
  const total = all.reduce((sum, p) => sum + p.price, 0);

  const defaultSize = (p) => p.sizes?.[Math.floor(p.sizes.length / 2)] || p.sizes?.[0];

  const handleAddAll = () => {
    all.forEach((p) => addItem(p, { size: defaultSize(p) }));
    toast.success('همه محصولات به سبد اضافه شد', `${toFaDigits(all.length)} محصول`);
  };

  if (all.length < 2) return null;

  return (
    <Reveal className="mt-14">
      <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-softer sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="mb-1 inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-300">
              پیشنهاد ویژه
            </span>
            <h2 className="mt-1.5 font-morabba font-bold text-xl text-foreground sm:text-2xl">
              معمولاً با هم خریداری می‌شوند
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* محصولات */}
          <div className="flex flex-wrap items-center gap-3">
            {all.map((p, i) => (
              <Fragment key={p.id}>
                {i > 0 && (
                  <span className="font-morabba text-2xl font-bold text-muted-foreground/60">+</span>
                )}
                <Link
                  to={`/product/${p.slug}`}
                  className="group flex w-36 flex-col items-center rounded-2xl border border-border/60 bg-surface p-3 transition-all hover:-translate-y-1 hover:border-brand-400 hover:shadow-soft"
                >
                  <div className="mb-2 h-20 w-20 overflow-hidden rounded-xl bg-muted/30">
                    <ProductImage
                      product={p}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <p className="w-full truncate text-center text-xs font-medium text-foreground">{p.name}</p>
                  <span className="mt-1 font-morabba font-bold text-sm text-brand-600 dark:text-brand-300">
                    {formatPrice(p.price)} تومان
                  </span>
                </Link>
              </Fragment>
            ))}
          </div>

          {/* مجموع و دکمه */}
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">مجموع:</span>
              <PriceTag price={total} size="lg" />
            </div>
            <Button onClick={handleAddAll} icon={ShoppingBag}>
              افزودن همگی به سبد خرید
            </Button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
