import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, Send, ArrowRight, MapPin, Phone, Mail, ChevronDown, CheckCircle2, XCircle, Package, ShoppingBag } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/ui/StatusBadge';
import Dropdown, { DropdownItem } from '../../components/ui/Dropdown';
import ProductImage from '../../components/ui/ProductImage';
import { PageHeader } from '../../layouts/AdminLayout';
import { useToast } from '../../contexts/ToastContext';
import { ORDERS, getProductById, USERS, ADDRESSES } from '../../data/mockData';
import { ORDER_STATUS, PAYMENT_METHODS } from '../../constants/config';
import { cn, toFaDigits, formatToman, formatFaDate, formatFaTime, formatPhone } from '../../utils/format';

const FLOW = ['pending', 'paid', 'processing', 'shipping', 'delivered'];
const TERMINAL = ['cancelled', 'refunded'];

const paymentLabel = (id) => PAYMENT_METHODS.find((p) => p.id === id)?.label || id;

const Card = ({ title, children, className }) => (
  <div className={cn('card-elevated p-5', className)}>
    <h3 className="mb-4 font-morabba font-bold text-base text-foreground">{title}</h3>
    {children}
  </div>
);

export default function OrderDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [order, setOrder] = useState(ORDERS.find((o) => o.id === id) || ORDERS[0]);

  const customer = USERS.find((u) => u.id === order.userId) || USERS[1];
  const address = ADDRESSES[0];
  const items = order.itemsList.map((pid) => getProductById(pid)).filter(Boolean);

  const subtotal = items.reduce((s, it) => s + it.price, 0);
  const shipping = subtotal > 5000000 ? 0 : 45000;
  const tax = Math.round(subtotal * 0.09);
  const total = subtotal + shipping + tax;

  const changeStatus = (status) => {
    setOrder((prev) => ({ ...prev, status }));
    toast.success('وضعیت سفارش تغییر کرد', `${order.id} → ${ORDER_STATUS[status].label}`);
  };

  const flowIndex = FLOW.indexOf(order.status);
  const terminalIdx = TERMINAL.indexOf(order.status);
  const isCancelled = terminalIdx >= 0;

  return (
    <div>
      <PageHeader
        title={`جزئیات سفارش ${order.id}`}
        subtitle={order.userName}
        actions={
          <>
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer size={17} />
              چاپ فاکتور
            </Button>
            <Button variant="secondary" onClick={() => toast.success('فاکتور با موفقیت ایمیل شد', customer.email)}>
              <Send size={17} />
              ارسال ایمیل
            </Button>
            <Link to="/admin/orders">
              <Button variant="ghost">
                <ArrowRight size={17} />
                بازگشت
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card title="اقلام سفارش">
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-4 rounded-2xl bg-muted/30 p-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-card">
                    <ProductImage product={it} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{it.name}</p>
                    <p className="text-xs text-muted-foreground">{it.brand.name} — {it.category.name}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-morabba font-bold text-foreground">{formatToman(it.price)}</p>
                    <p className="text-xs text-muted-foreground">۱ عدد</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-border/70 pt-4">
              {[
                { label: 'جمع اقلام', value: formatToman(subtotal) },
                { label: 'هزینه ارسال', value: shipping === 0 ? 'رایگان' : formatToman(shipping) },
                { label: 'مالیات (۹٪)', value: formatToman(tax) },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="text-foreground">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-border/70 pt-3">
                <span className="font-semibold text-foreground">مبلغ نهایی</span>
                <span className="font-morabba font-bold text-lg text-foreground">{formatToman(total)}</span>
              </div>
            </div>
          </Card>

          <Card title="پیگیری وضعیت سفارش">
            {isCancelled ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-500/10 py-10 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-red-500/15 text-red-500">
                  <XCircle size={28} />
                </span>
                <p className="font-semibold text-foreground">
                  سفارش {terminalIdx === 1 ? 'مرجوع شده' : 'لغو شده'} است
                </p>
                <StatusBadge status={order.status} />
              </div>
            ) : (
              <div className="flex items-center justify-between gap-1">
                {FLOW.map((step, i) => {
                  const done = i <= flowIndex;
                  const isCurrent = i === flowIndex;
                  const meta = ORDER_STATUS[step];
                  return (
                    <div key={step} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <span
                          className={cn(
                            'grid h-10 w-10 place-items-center rounded-full border-2 transition-all',
                            done ? 'border-brand-600 bg-brand-gradient text-white shadow-glow-sm' : 'border-border bg-surface text-muted-foreground',
                            isCurrent && 'ring-4 ring-brand-500/20'
                          )}
                        >
                          {done ? <CheckCircle2 size={18} /> : <Package size={17} />}
                        </span>
                        <span className={cn('text-[11px] font-medium', done ? 'text-foreground' : 'text-muted-foreground')}>
                          {meta.label}
                        </span>
                      </div>
                      {i !== FLOW.length - 1 && (
                        <div className={cn('mx-1 mb-6 h-0.5 flex-1 rounded-full', i < flowIndex ? 'bg-brand-500' : 'bg-border')} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                <span className="text-xs text-muted-foreground">
                  آخرین تغییر: {formatFaDate(order.date)} — {formatFaTime(order.date)}
                </span>
              </div>
              <Dropdown
                trigger={
                  <button className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground transition-colors hover:border-brand-500">
                    تغییر وضعیت
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </button>
                }
              >
                {({ close }) => (
                  <div className="w-44">
                    {Object.keys(ORDER_STATUS).map((k) => (
                      <DropdownItem
                        key={k}
                        active={k === order.status}
                        onClick={() => {
                          changeStatus(k);
                          close();
                        }}
                      >
                        {ORDER_STATUS[k].label}
                      </DropdownItem>
                    ))}
                  </div>
                )}
              </Dropdown>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="اطلاعات مشتری">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient font-morabba font-bold text-white">
                {customer.name.slice(0, 1)}
              </span>
              <div>
                <p className="font-semibold text-foreground">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.city}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2.5 text-sm">
              <p className="flex items-center gap-2.5 text-muted-foreground">
                <Mail size={15} className="text-brand-500" />
                {customer.email}
              </p>
              <p className="flex items-center gap-2.5 text-muted-foreground">
                <Phone size={15} className="text-brand-500" />
                {formatPhone(customer.phone)}
              </p>
              <p className="flex items-center gap-2.5 text-muted-foreground">
                <ShoppingBag size={15} className="text-brand-500" />
                {toFaDigits(customer.ordersCount)} سفارش ثبت‌شده
              </p>
            </div>
          </Card>

          <Card title="آدرس تحویل">
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2.5 text-muted-foreground">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent-500" />
                <span>
                  {address.street} — {address.city}، {address.province}
                </span>
              </p>
              <div className="rounded-2xl bg-muted/30 p-3.5">
                <p className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">گیرنده</span>
                  <span className="font-medium text-foreground">{address.recipient}</span>
                </p>
                <p className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">کد پستی</span>
                  <span className="font-medium text-foreground">{toFaDigits(address.postalCode)}</span>
                </p>
              </div>
            </div>
          </Card>

          <Card title="اطلاعات پرداخت">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">روش پرداخت</span>
                <Badge variant="info">{paymentLabel(order.payment)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">وضعیت پرداخت</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">مبلغ پرداختی</span>
                <span className="font-morabba font-bold text-foreground">{formatToman(total)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
