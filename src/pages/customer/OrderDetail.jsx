import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Printer, Undo2, ArrowRight, Check, MapPin, CreditCard, Truck } from 'lucide-react';
import PageHeader from '../../components/customer/PageHeader';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import ProductImage from '../../components/ui/ProductImage';
import EmptyState from '../../components/ui/EmptyState';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../contexts/ToastContext';
import { ORDERS, ADDRESSES, getProductById } from '../../data/mockData';
import { formatToman, formatFaDate, toFaDigits, cn } from '../../utils/format';

const PAYMENT_LABELS = {
  zarinpal: 'زرین‌پال',
  wallet: 'کیف پول کفشینو',
  cod: 'پرداخت در محل',
};

const STATUS_FLOW = [
  { key: 'pending', label: 'ثبت سفارش', date: null },
  { key: 'paid', label: 'پرداخت', date: null },
  { key: 'processing', label: 'در حال پردازش', date: null },
  { key: 'shipping', label: 'در حال ارسال', date: null },
  { key: 'delivered', label: 'تحویل شده', date: null },
];

export default function OrderDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [returnModal, setReturnModal] = useState(false);
  const order = ORDERS.find((o) => o.id === id);

  if (!order) {
    return (
      <div>
        <EmptyState
          icon="package"
          title="سفارش یافت نشد"
          description="سفارشی با این شماره پیدا نشد. از لیست سفارش‌های خود انتخاب کنید."
          action={
            <Link
              to="/panel/orders"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow-sm"
            >
              بازگشت به سفارش‌ها
            </Link>
          }
        />
      </div>
    );
  }

  const items = order.itemsList.map(getProductById).filter(Boolean);
  const shippingAddress = ADDRESSES.find((a) => a.isDefault) || ADDRESSES[0];
  const isCancelled = order.status === 'cancelled' || order.status === 'refunded';
  const currentIndex = STATUS_FLOW.findIndex((s) => s.key === order.status);

  const itemsSubtotal = items.reduce((sum, p) => sum + (p?.price || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  const handleReturn = () => {
    setReturnModal(false);
    toast.success('درخواست مرجوعی ثبت شد', 'کارشناسان ما به‌زودی با شما تماس می‌گیرند.');
  };

  return (
    <div>
      <Breadcrumb
        items={['پنل کاربری', { label: 'سفارش‌ها', to: '/panel/orders' }, order.id]}
        className="mb-4"
      />

      <PageHeader
        eyebrow={`${formatFaDate(order.date)}`}
        title={`سفارش ${order.id}`}
        description="جزئیات کامل سفارش، آیتم‌ها، آدرس تحویل و تاریخچه مراحل."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" icon={Printer} onClick={handlePrint}>
              چاپ فاکتور
            </Button>
            <Button variant="danger" icon={Undo2} onClick={() => setReturnModal(true)}>
              ثبت درخواست مرجوعی
            </Button>
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl bg-brand-500/10 px-5 py-4">
        <StatusBadge status={order.status} />
        <p className="text-sm text-muted-foreground">
          مبلغ نهایی: <span className="font-morabba font-bold text-foreground">{formatToman(order.total)}</span>
        </p>
        <Link
          to="/panel/track"
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
        >
          پیگیری مرحله به مرحله
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="card-elevated overflow-hidden">
            <div className="border-b border-border/60 px-5 py-4">
              <h2 className="font-morabba font-bold text-lg text-foreground">اقلام سفارش</h2>
            </div>
            <div className="divide-y divide-border/60">
              {items.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-5">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-surface">
                    <ProductImage product={product} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/product/${product.slug}`}
                      className="truncate font-morabba font-semibold text-foreground transition-colors hover:text-brand-600 dark:hover:text-brand-300"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      برند {product.brand?.name} · {product.category?.name}
                    </p>
                  </div>
                  <div className="shrink-0 text-left">
                    <p className="font-morabba font-bold text-foreground">{formatToman(product.price)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">تعداد: ۱</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-elevated overflow-hidden">
            <div className="border-b border-border/60 px-5 py-4">
              <h2 className="font-morabba font-bold text-lg text-foreground">تاریخچه مراحل</h2>
            </div>
            <div className="p-5">
              {isCancelled ? (
                <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-500">
                  {order.status === 'refunded'
                    ? 'این سفارش مرجوع و وجه آن به شما بازگردانده شده است.'
                    : 'این سفارش لغو شده است.'}
                </div>
              ) : (
                <ol className="relative">
                  {STATUS_FLOW.map((step, i) => {
                    const done = currentIndex >= i;
                    const active = currentIndex === i;
                    return (
                      <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                        {i < STATUS_FLOW.length - 1 && (
                          <span
                            className={cn(
                              'absolute right-[15px] top-9 h-[calc(100%-2rem)] w-0.5 rounded-full transition-colors duration-500',
                              done ? 'bg-brand-500' : 'bg-border'
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            'z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-white transition-all duration-500',
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
                        </span>
                        <div>
                          <p
                            className={cn(
                              'text-sm font-semibold',
                              active
                                ? 'text-brand-600 dark:text-brand-300'
                                : done
                                  ? 'text-foreground'
                                  : 'text-muted-foreground'
                            )}
                          >
                            {step.label}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {done ? formatFaDate(order.date) : 'در انتظار'}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-elevated p-5">
            <h3 className="mb-4 flex items-center gap-2 font-morabba font-bold text-base text-foreground">
              <CreditCard size={18} className="text-brand-500" />
              اطلاعات پرداخت
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">جمع اقلام</dt>
                <dd className="font-medium text-foreground">{formatToman(itemsSubtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">هزینه ارسال</dt>
                <dd className="font-medium text-foreground">۰ تومان</dd>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-3">
                <dt className="text-muted-foreground">مبلغ نهایی</dt>
                <dd className="font-morabba font-bold text-lg text-foreground">
                  {formatToman(order.total)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">روش پرداخت</dt>
                <dd className="font-medium text-foreground">
                  {PAYMENT_LABELS[order.payment] || order.payment}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">تعداد اقلام</dt>
                <dd className="font-medium text-foreground">{toFaDigits(order.items)} کالا</dd>
              </div>
            </dl>
          </div>

          <div className="card-elevated p-5">
            <h3 className="mb-4 flex items-center gap-2 font-morabba font-bold text-base text-foreground">
              <MapPin size={18} className="text-brand-500" />
              آدرس تحویل
            </h3>
            {shippingAddress ? (
              <div className="text-sm">
                <p className="font-semibold text-foreground">
                  {shippingAddress.recipient} · {shippingAddress.title}
                </p>
                <p className="mt-1 leading-7 text-muted-foreground">
                  {shippingAddress.province}، {shippingAddress.city}، {shippingAddress.street}
                </p>
                <p className="mt-1 text-muted-foreground">
                  کد پستی: {toFaDigits(shippingAddress.postalCode)} · تلفن:{' '}
                  {toFaDigits(shippingAddress.phone)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">آدرسی ثبت نشده است.</p>
            )}
          </div>

          <div className="card-elevated p-5">
            <h3 className="mb-4 flex items-center gap-2 font-morabba font-bold text-base text-foreground">
              <Truck size={18} className="text-brand-500" />
              روش ارسال
            </h3>
            <p className="text-sm text-foreground">ارسال عادی (۳ تا ۵ روز کاری)</p>
            <p className="mt-1 text-xs text-muted-foreground">
              تحویل توسط پست پیشتاز به آدرس انتخاب‌شده انجام می‌شود.
            </p>
          </div>
        </div>
      </div>

      <Modal
        open={returnModal}
        onClose={() => setReturnModal(false)}
        title="ثبت درخواست مرجوعی"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReturnModal(false)}>
              انصراف
            </Button>
            <Button variant="danger" onClick={handleReturn}>
              تأیید مرجوعی
            </Button>
          </>
        }
      >
        <p className="text-sm leading-7 text-muted-foreground">
          درخواست مرجوعی سفارش <span className="font-semibold text-foreground">{order.id}</span> ثبت
          می‌شود. تیم پشتیبانی حداکثر تا ۲۴ ساعت آینده برای هماهنگی بازگشت کالا با شما تماس خواهد
          گرفت.
        </p>
      </Modal>
    </div>
  );
}
