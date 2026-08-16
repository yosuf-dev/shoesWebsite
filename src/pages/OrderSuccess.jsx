import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PackageCheck, Sparkles, MapPin, CreditCard, Truck, ChevronLeft } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useCart } from '../contexts/CartContext';
import { SHIPPING_METHODS, PAYMENT_METHODS } from '../constants/config';
import { formatToman, toFaDigits } from '../utils/format';

function SuccessCheck() {
  return (
    <div className="relative mx-auto h-28 w-28">
      <motion.span
        className="absolute inset-0 rounded-full border-4 border-emerald-500/30"
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative grid h-full w-full place-items-center rounded-full bg-emerald-500/10">
        <svg className="h-24 w-24" viewBox="0 0 52 52">
          <motion.circle
            cx="26" cy="26" r="23"
            fill="none" stroke="#10b981" strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <motion.path
            fill="none" stroke="#10b981" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
            d="M14 27l8 8 16-16"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, delay: 0.45, ease: 'easeOut' }}
          />
        </svg>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  const { state } = useLocation();
  const { items, total, shipping, tax, discount, shippingMethod } = useCart();

  const order = state?.order || {};
  const orderId = order.orderId || 'ORD-0000';
  const orderTotal = order.total ?? total;
  const orderShipping = order.shipping ?? shipping;
  const orderTax = order.tax ?? tax;
  const orderDiscount = order.discount ?? discount;
  const orderAddress = order.address || null;
  const orderPaymentId = order.paymentMethod || PAYMENT_METHODS[0].id;
  const orderShippingId = order.shippingMethod || shippingMethod;

  const payment = PAYMENT_METHODS.find((m) => m.id === orderPaymentId) || PAYMENT_METHODS[0];
  const shippingMethodInfo = SHIPPING_METHODS.find((m) => m.id === orderShippingId) || SHIPPING_METHODS[1];

  return (
    <div className="container-app py-8 lg:py-12">
      <Breadcrumb items={['پیگیری سفارش', 'تأیید سفارش']} className="mb-8" />

      <div className="mx-auto max-w-2xl">
        <div className="card-elevated overflow-hidden p-8 text-center sm:p-12">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          >
            <SuccessCheck />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Badge variant="success" className="mb-3">پرداخت با موفقیت انجام شد</Badge>
            <h1 className="font-morabba font-bold text-2xl text-foreground sm:text-3xl">سفارش شما با موفقیت ثبت شد</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
              سپاس از خرید شما از کفشینو؛ جزئیات سفارش به ایمیل شما ارسال شد و در پنل کاربری قابل پیگیری است.
            </p>

            <div className="mx-auto mt-7 max-w-sm rounded-2xl border border-border/60 bg-surface p-4">
              <p className="text-xs text-muted-foreground">شماره سفارش</p>
              <p className="mt-1 font-morabba font-bold text-xl text-brand-600 dark:text-brand-300" dir="ltr">
                {toFaDigits(orderId)}
              </p>
            </div>

            {orderAddress && (
              <div className="mx-auto mt-4 flex max-w-sm items-start justify-center gap-2.5 rounded-2xl border border-border/60 bg-surface p-4 text-right text-sm">
                <MapPin size={17} className="mt-0.5 shrink-0 text-brand-500" />
                <div>
                  <p className="font-medium text-foreground">{orderAddress.recipient}</p>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    {orderAddress.province}، {orderAddress.city}، {orderAddress.street} — کد پستی {toFaDigits(orderAddress.postalCode)}
                  </p>
                </div>
              </div>
            )}

            <div className="mx-auto mt-4 grid max-w-sm gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-surface p-3.5 text-right">
                <Truck size={17} className="shrink-0 text-brand-500" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">روش ارسال</p>
                  <p className="truncate text-sm font-medium text-foreground">{shippingMethodInfo.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-surface p-3.5 text-right">
                <CreditCard size={17} className="shrink-0 text-brand-500" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">روش پرداخت</p>
                  <p className="truncate text-sm font-medium text-foreground">{payment.label}</p>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-4 max-w-sm space-y-2 rounded-2xl border border-border/60 bg-surface p-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>تعداد کالا</span>
                <span>{toFaDigits(items.length)}</span>
              </div>
              {orderDiscount > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>تخفیف</span>
                  <span>- {formatToman(orderDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>هزینه ارسال</span>
                <span>{orderShipping === 0 ? 'رایگان' : formatToman(orderShipping)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>مالیات</span>
                <span>{formatToman(orderTax)}</span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-2.5 text-base font-bold text-foreground">
                <span>مبلغ پرداخت‌شده</span>
                <span className="font-morabba text-lg">{formatToman(orderTotal)}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/panel/orders">
                <Button fullWidth icon={PackageCheck}>پیگیری سفارش</Button>
              </Link>
              <Link to="/shop">
                <Button fullWidth variant="secondary" icon={Sparkles}>بازگشت به فروشگاه</Button>
              </Link>
            </div>

            <Link
              to="/shop?sort=newest"
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-500"
            >
              <ChevronLeft size={16} />
              مشاهده جدیدترین محصولات
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
