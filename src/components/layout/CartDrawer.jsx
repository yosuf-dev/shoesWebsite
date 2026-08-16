import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, TicketPercent, ArrowLeft, X } from 'lucide-react';
import Drawer from '../ui/Drawer';
import Button from '../ui/Button';
import ProductImage from '../ui/ProductImage';
import QuantityStepper from '../ui/QuantityStepper';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { COUPONS } from '../../data/mockData';
import { formatToman, toFaDigits, cn } from '../../utils/format';

export default function CartDrawer() {
  const {
    items, isOpen, closeCart, subtotal, discount, shipping, tax, total,
    coupon, removeItem, updateQuantity, applyCoupon, removeCoupon,
  } = useCart();
  const [code, setCode] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);
  const [applying, setApplying] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleCoupon = async () => {
    if (!code.trim()) return;
    setApplying(true);
    setCouponMsg(null);
    try {
      const found = COUPONS.find(
        (c) => c.code.toLowerCase() === code.trim().toLowerCase()
      );
      if (!found) throw new Error('کد تخفیف معتبر نیست.');
      if (new Date(found.expiresAt) < new Date()) throw new Error('کد تخفیف منقضی شده است.');
      if (found.usedCount >= found.usageLimit) throw new Error('سقف استفاده از این کد به پایان رسیده است.');
      if (subtotal < found.minOrder)
        throw new Error(`حداقل مبلغ سفارش برای این کد ${toFaDigits(found.minOrder.toLocaleString('fa-IR'))} تومان است.`);
      await applyCoupon(() => ({ coupon: found }), code);
      toast.success('کد تخفیف اعمال شد', `${found.title} با موفقیت اعمال شد.`);
      setCode('');
    } catch (e) {
      toast.error(e.message || 'کد تخفیف معتبر نیست.');
      setCouponMsg({ type: 'error', text: e.message });
    } finally {
      setApplying(false);
    }
  };

  const goCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <Drawer
      open={isOpen}
      onClose={closeCart}
      title={`سبد خرید (${toFaDigits(items.length)})`}
      side="left"
      size="lg"
    >
      <div className="flex h-full flex-col">
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-brand-500/10 text-brand-500 mb-5">
              <ShoppingBag size={34} strokeWidth={1.6} />
            </div>
            <h3 className="font-morabba font-bold text-lg text-foreground mb-2">سبد خرید شما خالی است</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              از بین محصولات ویژه ما، اولین انتخاب خود را پیدا کنید.
            </p>
            <Button onClick={closeCart} icon={ArrowLeft}>
              شروع خرید
            </Button>
          </div>
        ) : (
          <>
            {/* آیتم‌ها */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <AnimatePresence initial={false}>
                {items.map((it) => (
                  <motion.div
                    key={it.key}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="flex gap-3.5 rounded-2xl border border-border/60 bg-surface p-3"
                  >
                    <Link to={`/product/${it.product.slug}`} className="shrink-0">
                      <div className="h-20 w-20 overflow-hidden rounded-xl bg-muted/30">
                        <ProductImage product={it.product} colorIndex={it.colorIndex} className="h-full w-full object-cover" />
                      </div>
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-sm text-foreground">{it.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {it.brand}
                            {it.size && <span className="mr-2">سایز {toFaDigits(it.size)}</span>}
                            {it.colorName && <span className="mr-2">{it.colorName}</span>}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(it.key)}
                          className="text-muted-foreground transition-colors hover:text-red-500"
                          aria-label="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <QuantityStepper
                          value={it.quantity}
                          onChange={(q) => updateQuantity(it.key, q)}
                          size="sm"
                        />
                        <span className="font-morabba font-bold text-sm text-foreground">
                          {formatToman(it.price * it.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* کوپن */}
            <div className="border-t border-border/60 p-5">
              {coupon ? (
                <div className="flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                    <TicketPercent size={17} />
                    {coupon.code}
                  </span>
                  <button onClick={removeCoupon} className="text-muted-foreground hover:text-red-500" aria-label="حذف کوپن">
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="کد تخفیف را وارد کنید"
                    className="input-app flex-1"
                  />
                  <Button onClick={handleCoupon} variant="secondary" loading={applying} className="shrink-0">
                    اعمال
                  </Button>
                </div>
              )}

              {/* جمع کل */}
              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>جمع کالاها</span>
                  <span>{formatToman(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>تخفیف</span>
                    <span>- {formatToman(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>هزینه ارسال</span>
                  <span>{shipping === 0 ? 'رایگان' : formatToman(shipping)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>مالیات بر ارزش افزوده</span>
                  <span>{formatToman(tax)}</span>
                </div>
                <div className="flex justify-between border-t border-border/60 pt-3 text-base font-bold text-foreground">
                  <span>مبلغ قابل پرداخت</span>
                  <span className="font-morabba">{formatToman(total)}</span>
                </div>
              </div>

              <Button onClick={goCheckout} fullWidth size="lg" className="mt-4" icon={ShoppingBag}>
                ادامه فرایند خرید
              </Button>
              <Button onClick={closeCart} variant="ghost" fullWidth className="mt-2">
                ادامه خرید
              </Button>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
