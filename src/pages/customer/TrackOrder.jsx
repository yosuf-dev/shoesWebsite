import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageSearch, Check, Search, Truck, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/customer/PageHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Badge from '../../components/ui/Badge';
import { ORDERS } from '../../data/mockData';
import { formatToman, formatFaDate, toFaDigits, cn } from '../../utils/format';

const STATUS_FLOW = [
  { key: 'pending', label: 'ثبت سفارش', desc: 'سفارش شما با موفقیت ثبت شد.' },
  { key: 'paid', label: 'پرداخت', desc: 'پرداخت سفارش تأیید شد.' },
  { key: 'processing', label: 'در حال پردازش', desc: 'سفارش در حال آماده‌سازی است.' },
  { key: 'shipping', label: 'در حال ارسال', desc: 'سفارش به پیک تحویل داده شد.' },
  { key: 'delivered', label: 'تحویل شده', desc: 'سفارش به دست شما رسید.' },
];

export default function TrackOrder() {
  const [code, setCode] = useState('');
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    const value = code.trim().toUpperCase();
    if (!value) {
      setError('کد پیگیری را وارد کنید');
      setOrder(null);
      setSearched(true);
      return;
    }
    const found = ORDERS.find((o) => o.id === value);
    setError(found ? '' : 'سفارشی با این کد پیدا نشد');
    setOrder(found || null);
    setSearched(true);
  };

  const cancelled = order?.status === 'cancelled' || order?.status === 'refunded';
  const currentIndex = order ? STATUS_FLOW.findIndex((s) => s.key === order.status) : -1;

  return (
    <div>
      <PageHeader
        eyebrow="پیگیری سفارش"
        title="پیگیری مرحله به مرحله"
        description="کد پیگیری سفارش خود را وارد کنید تا وضعیت لحظه‌ای آن را ببینید."
      />

      <form onSubmit={handleTrack} className="card-elevated mb-8 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="مثال: ORD-1005"
            icon={PackageSearch}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError('');
            }}
            error={error}
            className="flex-1"
          />
          <Button type="submit" icon={Search} className="sm:w-44">
            پیگیری سفارش
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          کد پیگیری سفارش را از ایمیل تأیید خرید یا بخش سفارش‌های پنل کاربری دریافت کنید.
        </p>
      </form>

      <AnimatePresence mode="wait">
        {searched && order && (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 gap-6 xl:grid-cols-3"
          >
            <div className="card-elevated overflow-hidden xl:col-span-2">
              <div className="border-b border-border/60 px-5 py-4">
                <h2 className="flex flex-wrap items-center gap-3 font-morabba font-bold text-lg text-foreground">
                  سفارش {order.id}
                  <StatusBadge status={order.status} />
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  ثبت‌شده در {formatFaDate(order.date)}
                </p>
              </div>

              <div className="p-6">
                {cancelled ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 p-5">
                    <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-500" />
                    <div>
                      <p className="font-semibold text-red-500">
                        {order.status === 'refunded'
                          ? 'این سفارش مرجوع شده است'
                          : 'این سفارش لغو شده است'}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {order.status === 'refunded'
                          ? 'وجه سفارش به کیف پول شما بازگردانده شده است.'
                          : 'سفارش به‌دلیل پرداخت‌نشده لغو شده است. در صورت نیاز دوباره سفارش دهید.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <ol className="relative">
                    {STATUS_FLOW.map((step, i) => {
                      const done = currentIndex >= i;
                      const active = currentIndex === i;
                      return (
                        <li key={step.key} className="relative flex gap-4 pb-10 last:pb-0">
                          {i < STATUS_FLOW.length - 1 && (
                            <motion.span
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: done ? 1 : 0 }}
                              transition={{ duration: 0.5, delay: i * 0.25 }}
                              style={{ transformOrigin: 'top' }}
                              className={cn(
                                'absolute right-[15px] top-9 h-[calc(100%-2rem)] w-0.5 rounded-full',
                                done ? 'bg-brand-500' : 'bg-border'
                              )}
                            />
                          )}
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.25, type: 'spring', stiffness: 400, damping: 20 }}
                            className={cn(
                              'z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-white',
                              done
                                ? 'border-brand-500 bg-brand-gradient shadow-glow-sm'
                                : 'border-border bg-surface text-muted-foreground'
                            )}
                          >
                            {done ? (
                              <Check size={14} strokeWidth={3} />
                            ) : (
                              <span className="text-xs font-bold">{toFaDigits(i + 1)}</span>
                            )}
                          </motion.span>
                          <motion.div
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.25 + 0.1 }}
                          >
                            <p
                              className={cn(
                                'text-sm font-semibold transition-colors',
                                active
                                  ? 'text-brand-600 dark:text-brand-300'
                                  : done
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                              )}
                            >
                              {step.label}
                              {active && (
                                <span className="mr-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-500">
                                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                  در جریان
                                </span>
                              )}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
                          </motion.div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="card-elevated p-5">
                <h3 className="mb-4 font-morabba font-bold text-base text-foreground">خلاصه سفارش</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">تعداد اقلام</dt>
                    <dd className="font-medium text-foreground">{toFaDigits(order.items)} کالا</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">مبلغ نهایی</dt>
                    <dd className="font-morabba font-bold text-foreground">
                      {formatToman(order.total)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="card-elevated p-5">
                <h3 className="mb-4 flex items-center gap-2 font-morabba font-bold text-base text-foreground">
                  <Truck size={18} className="text-brand-500" />
                  ارسال
                </h3>
                <div className="flex items-center gap-3 rounded-2xl bg-surface p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Truck size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">پست پیشتاز</p>
                    <p className="text-xs text-muted-foreground">۳ تا ۵ روز کاری</p>
                  </div>
                </div>
                {!cancelled && (
                  <Badge variant="info" className="mt-3">
                    تحویل حدودی: تا {toFaDigits(7)} روز آینده
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {searched && !order && (
          <motion.div
            key="not-found"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/50 px-8 py-16 text-center"
          >
            <div className="mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-brand-gradient/10 text-brand-500">
              <PackageSearch size={36} strokeWidth={1.6} />
            </div>
            <h3 className="mb-1.5 font-morabba font-bold text-lg text-foreground">سفارشی یافت نشد</h3>
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              سفارشی با کد «{toFaDigits(code)}» پیدا نشد. شماره سفارش را دقیق وارد کنید.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
