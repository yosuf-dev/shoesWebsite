import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Eye, PackageSearch } from 'lucide-react';
import PageHeader from '../../components/customer/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { SkeletonTable } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { getUserOrders } from '../../services/authService';
import { ORDERS } from '../../data/mockData';
import { formatToman, formatFaDate, toFaDigits, cn } from '../../utils/format';

const PAYMENT_LABELS = {
  zarinpal: 'زرین‌پال',
  wallet: 'کیف پول',
  cod: 'پرداخت در محل',
};

const STATUS_FLOW = [
  { key: 'pending', label: 'ثبت سفارش', desc: 'سفارش شما با موفقیت ثبت شد.' },
  { key: 'paid', label: 'پرداخت', desc: 'پرداخت سفارش تأیید شد.' },
  { key: 'processing', label: 'در حال پردازش', desc: 'سفارش در حال آماده‌سازی است.' },
  { key: 'shipping', label: 'در حال ارسال', desc: 'سفارش به پیک تحویل داده شد.' },
  { key: 'delivered', label: 'تحویل شده', desc: 'سفارش به دست شما رسید.' },
];

function StatusSteps({ status }) {
  const cancelled = status === 'cancelled' || status === 'refunded';
  const currentIndex = STATUS_FLOW.findIndex((s) => s.key === status);

  if (cancelled) {
    return (
      <Badge variant={status === 'refunded' ? 'muted' : 'danger'} className="mb-4">
        {status === 'refunded' ? 'این سفارش مرجوع شده است.' : 'این سفارش لغو شده است.'}
      </Badge>
    );
  }

  return (
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
                  'text-sm font-semibold transition-colors',
                  active
                    ? 'text-brand-600 dark:text-brand-300'
                    : done
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                )}
              >
                {step.label}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{step.desc}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackOrder, setTrackOrder] = useState(null);

  useEffect(() => {
    let mounted = true;
    getUserOrders()
      .then((data) => {
        if (mounted) {
          setOrders(data.length ? data : ORDERS);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setOrders(ORDERS);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="سفارش‌ها"
        title="سفارش‌های من"
        description="تاریخچه تمام سفارش‌های شما به همراه وضعیت پرداخت و ارسال."
      />

      {loading ? (
        <div className="card-elevated p-5">
          <SkeletonTable rows={6} cols={6} />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon="package"
          title="سفارشی یافت نشد"
          description="هنوز سفارشی ثبت نکرده‌اید. از فروشگاه کفشینو خرید کنید و اینجا پیگیری‌اش کنید."
          action={
            <Link
              to="/shop"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow-sm"
            >
              رفتن به فروشگاه
            </Link>
          }
        />
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>شماره سفارش</th>
                  <th>تاریخ ثبت</th>
                  <th>وضعیت</th>
                  <th>تعداد اقلام</th>
                  <th>مبلغ</th>
                  <th>روش پرداخت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link
                        to={`/panel/orders/${o.id}`}
                        className="font-semibold text-brand-600 dark:text-brand-300"
                      >
                        {o.id}
                      </Link>
                    </td>
                    <td>{formatFaDate(o.date)}</td>
                    <td>
                      <StatusBadge status={o.status} />
                    </td>
                    <td>{toFaDigits(o.items)} کالا</td>
                    <td className="font-morabba font-bold text-foreground">
                      {formatToman(o.total)}
                    </td>
                    <td>{PAYMENT_LABELS[o.payment] || o.payment}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/panel/orders/${o.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand-500 hover:text-brand-500"
                        >
                          <Eye size={14} />
                          جزئیات
                        </Link>
                        <Button
                          size="xs"
                          variant="secondary"
                          icon={PackageSearch}
                          onClick={() => setTrackOrder(o)}
                        >
                          پیگیری سفارش
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={!!trackOrder}
        onClose={() => setTrackOrder(null)}
        title={`پیگیری سفارش ${trackOrder?.id || ''}`}
        size="sm"
      >
        {trackOrder && (
          <div>
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-surface p-4">
              <div>
                <p className="text-xs text-muted-foreground">مبلغ سفارش</p>
                <p className="font-morabba font-bold text-foreground">
                  {formatToman(trackOrder.total)}
                </p>
              </div>
              <StatusBadge status={trackOrder.status} />
            </div>
            <StatusSteps status={trackOrder.status} />
          </div>
        )}
      </Modal>
    </div>
  );
}
