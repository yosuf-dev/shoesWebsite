import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, TicketPercent, ArrowLeft, ShieldCheck, Truck, RotateCcw, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/ui/Breadcrumb';
import ProductImage from '../components/ui/ProductImage';
import QuantityStepper from '../components/ui/QuantityStepper';
import EmptyState from '../components/ui/EmptyState';
import SectionHeading from '../components/ui/SectionHeading';
import ProductCard from '../components/product/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { COUPONS, PRODUCTS } from '../data/mockData';
import { formatToman, toFaDigits } from '../utils/format';

const PERKS = [
  { icon: Truck, title: 'ارسال سریع', text: '۱ تا ۵ روز کاری' },
  { icon: ShieldCheck, title: 'پرداخت امن', text: 'درگاه معتبر زرین‌پال' },
  { icon: RotateCcw, title: '۷ روز مرجوعی', text: 'ضمانت بازگشت' },
];

export default function Cart() {
  const {
    items, subtotal, discount, shipping, tax, total, coupon,
    removeItem, updateQuantity, applyCoupon, removeCoupon,
  } = useCart();
  const [code, setCode] = useState('');
  const [applying, setApplying] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const suggested = PRODUCTS.filter((p) => !items.some((it) => it.productId === p.id))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const handleCoupon = async () => {
    if (!code.trim()) return;
    setApplying(true);
    try {
      const found = COUPONS.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
      if (!found) throw new Error('کد تخفیف معتبر نیست.');
      if (new Date(found.expiresAt) < new Date()) throw new Error('کد تخفیف منقضی شده است.');
      if (subtotal < found.minOrder)
        throw new Error(`حداقل مبلغ سفارش ${toFaDigits(found.minOrder.toLocaleString('fa-IR'))} تومان است.`);
      await applyCoupon(() => ({ coupon: found }), code);
      toast.success('کد تخفیف اعمال شد', found.title);
      setCode('');
    } catch (e) {
      toast.error(e.message || 'کد تخفیف معتبر نیست.');
    } finally {
      setApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-app py-16">
        <Breadcrumb items={[{ label: 'سبد خرید' }]} />
        <div className="mt-8">
          <EmptyState
            icon="package"
            title="سبد خرید شما خالی است"
            description="هنوز محصولی به سبد خرید اضافه نکرده‌اید. از کالکشن‌های ویژه کفشینو شروع کنید."
            action={
              <Link to="/shop">
                <Button icon={ArrowLeft} size="lg">شروع خرید</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <Breadcrumb items={[{ label: 'سبد خرید' }]} />
      <h1 className="mt-4 font-morabba font-bold text-3xl text-foreground">
        سبد خرید <span className="text-lg font-dana text-muted-foreground">({toFaDigits(items.length)} کالا)</span>
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* آیتم‌ها */}
        <div className="min-w-0 space-y-4">
          <AnimatePresence initial={false}>
            {items.map((it) => (
              <motion.div
                key={it.key}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card p-4 shadow-softer sm:flex-row sm:items-center"
              >
                <Link to={`/product/${it.product.slug}`} className="shrink-0">
                  <div className="h-28 w-28 overflow-hidden rounded-2xl bg-muted/30 sm:h-32 sm:w-32">
                    <ProductImage product={it.product} colorIndex={it.colorIndex} className="h-full w-full object-cover" />
                  </div>
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-brand-600 dark:text-brand-300">{it.brand}</span>
                      <Link to={`/product/${it.product.slug}`}>
                        <h3 className="mt-1 truncate font-morabba font-semibold text-base text-foreground hover:text-brand-600">
                          {it.name}
                        </h3>
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {it.size && <span>سایز {toFaDigits(it.size)} • </span>}
                        {it.colorName}
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {formatToman(it.price)}
                        {it.compareAtPrice && (
                          <span className="mr-2 text-xs text-muted-foreground line-through">
                            {formatToman(it.compareAtPrice)}
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(it.key)}
                      className="text-muted-foreground transition-colors hover:text-red-500"
                      aria-label="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between sm:mt-4">
                    <QuantityStepper value={it.quantity} onChange={(q) => updateQuantity(it.key, q)} />
                    <span className="font-morabba font-bold text-base text-foreground">
                      {formatToman(it.price * it.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-2">
            <Link to="/shop" className="flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-300 hover:underline">
              <ArrowLeft size={16} />
              ادامه خرید
            </Link>
            <button onClick={() => removeItem('__all__')} className="hidden">
              {''}
            </button>
          </div>

          {/* پیشنهاد */}
          <div className="pt-6">
            <SectionHeading title="شاید این‌ها را هم بپسندید" eyebrow="پیشنهاد کفشینو" className="mb-6" />
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {suggested.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* خلاصه */}
        <div className="space-y-4 lg:sticky lg:top-[190px] lg:self-start">
          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
            <h2 className="mb-5 font-morabba font-bold text-lg text-foreground">خلاصه سفارش</h2>

            {/* کوپن */}
            {coupon ? (
              <div className="mb-5 flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                  <TicketPercent size={17} />
                  {coupon.code}
                  <span className="text-xs">({coupon.title})</span>
                </span>
                <button onClick={removeCoupon} className="text-muted-foreground hover:text-red-500" aria-label="حذف کوپن">
                  <X size={15} />
                </button>
              </div>
            ) : (
              <div className="mb-5 flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="کد تخفیف دارید؟"
                  className="input-app flex-1"
                />
                <Button onClick={handleCoupon} variant="secondary" loading={applying} className="shrink-0">
                  اعمال
                </Button>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>جمع کالاها ({toFaDigits(items.length)} مورد)</span>
                <span>{formatToman(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>تخفیف</span>
                  <span>− {formatToman(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>هزینه ارسال</span>
                <span>{shipping === 0 ? 'رایگان' : formatToman(shipping)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>مالیات بر ارزش افزوده (۹٪)</span>
                <span>{formatToman(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-4 text-base font-bold text-foreground">
                <span>مبلغ قابل پرداخت</span>
                <span className="font-morabba text-xl">{formatToman(total)}</span>
              </div>
            </div>

            <Button size="lg" fullWidth className="mt-6" icon={ShoppingBag} onClick={() => navigate('/checkout')}>
              تسویه حساب
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              با کلیک روی تسویه، از پرداخت امن زرین‌پال استفاده می‌کنید.
            </p>
          </div>

          {/* مزایا */}
          <div className="grid grid-cols-3 gap-3">
            {PERKS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-border/60 bg-card p-3 text-center">
                <p.icon size={20} className="mx-auto text-brand-500" />
                <p className="mt-2 text-xs font-medium text-foreground">{p.title}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
