import { useMemo, useState } from 'react';
import { CheckCheck, Bell, ShoppingBag, Boxes, UserPlus, CreditCard, MessageSquare, Settings2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Switch from '../../components/ui/Switch';
import EmptyState from '../../components/ui/EmptyState';
import { PageHeader } from '../../layouts/AdminLayout';
import { useToast } from '../../contexts/ToastContext';
import { NOTIFICATIONS } from '../../data/mockData';
import { cn, toFaDigits, relativeTime } from '../../utils/format';

const TYPE_META = {
  order: { label: 'سفارش', icon: ShoppingBag, color: 'bg-brand-500/10 text-brand-500' },
  stock: { label: 'موجودی', icon: Boxes, color: 'bg-accent-500/10 text-accent-500' },
  user: { label: 'کاربر', icon: UserPlus, color: 'bg-emerald-500/10 text-emerald-500' },
  payment: { label: 'پرداخت', icon: CreditCard, color: 'bg-sky-500/10 text-sky-500' },
  review: { label: 'نظر', icon: MessageSquare, color: 'bg-rose-500/10 text-rose-500' },
};

const SETTINGS = [
  { key: 'orders', label: 'اعلان سفارش جدید', desc: 'ثبت سفارش جدید در فروشگاه' },
  { key: 'stock', label: 'هشدار موجودی کم', desc: 'زمانی که موجودی محصول پایین می‌آید' },
  { key: 'user', label: 'ثبت‌نام کاربر جدید', desc: 'عضویت کاربران تازه در فروشگاه' },
  { key: 'payment', label: 'اعلان پرداخت', desc: 'تایید یا ابطال پرداخت‌ها' },
  { key: 'review', label: 'نظر جدید', desc: 'ثبت نظر یا امتیاز جدید برای محصولات' },
  { key: 'promo', label: 'خبرنامه و تبلیغات', desc: 'اطلاع‌رسانی کمپین‌ها و تخفیف‌ها' },
];

const FILTERS = [
  { key: 'all', label: 'همه' },
  { key: 'order', label: 'سفارش' },
  { key: 'stock', label: 'موجودی' },
  { key: 'user', label: 'کاربر' },
  { key: 'payment', label: 'پرداخت' },
];

export default function Notifications() {
  const toast = useToast();
  const [rows, setRows] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState('all');
  const [settings, setSettings] = useState(() =>
    Object.fromEntries(SETTINGS.map((s) => [s.key, true]))
  );

  const filtered = useMemo(
    () => rows.filter((n) => filter === 'all' || n.type === filter),
    [rows, filter]
  );

  const unread = rows.filter((n) => !n.read).length;

  const markOne = (id) => {
    setRows((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAll = () => {
    setRows((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('همه اعلان‌ها خوانده شد');
  };

  const toggleSetting = (key) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
    toast.info(SETTINGS.find((x) => x.key === key).label, settings[key] ? 'غیرفعال شد' : 'فعال شد');
  };

  return (
    <div>
      <PageHeader
        title="مرکز اعلان‌ها"
        subtitle="مدیریت اعلان‌های سیستم و تنظیمات اطلاع‌رسانی"
        actions={
          <Button variant="secondary" onClick={markAll} disabled={unread === 0}>
            <CheckCheck size={17} />
            خواندن همه
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    'rounded-xl px-3.5 py-2 text-sm font-medium transition-all',
                    filter === f.key
                      ? 'bg-brand-gradient text-white shadow-glow-sm'
                      : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <Badge variant="brand" className="ms-auto">
              <Bell size={13} />
              {toFaDigits(unread)} خوانده‌نشده
            </Badge>
          </div>

          <div className="mt-4 space-y-3">
            {filtered.length === 0 ? (
              <EmptyState icon="inbox" title="اعلانی در این دسته نیست" />
            ) : (
              filtered.map((n) => {
                const meta = TYPE_META[n.type] || { icon: Bell, color: 'bg-muted text-muted-foreground' };
                const Icon = meta.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => markOne(n.id)}
                    className={cn(
                      'flex w-full items-start gap-4 rounded-2xl border p-4 text-right transition-all',
                      n.read
                        ? 'border-border/70 bg-surface hover:bg-muted/30'
                        : 'border-brand-500/30 bg-brand-500/5 hover:bg-brand-500/10'
                    )}
                  >
                    <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-2xl', meta.color)}>
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-medium text-foreground">{n.title}</span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{relativeTime(n.date)}</span>
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-muted-foreground">{n.text}</span>
                      <span className="mt-2 inline-flex">
                        <Badge variant="muted">{meta.label}</Badge>
                      </span>
                    </span>
                    {!n.read && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="card-elevated h-fit p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500/10 text-brand-500">
              <Settings2 size={20} />
            </span>
            <div>
              <h3 className="font-morabba font-bold text-base text-foreground">تنظیمات اعلان</h3>
              <p className="text-xs text-muted-foreground">انتخاب کنید کدام اعلان‌ها را دریافت کنید</p>
            </div>
          </div>
          <div className="space-y-4">
            {SETTINGS.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-3 border-b border-border/50 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
                </div>
                <Switch checked={settings[s.key]} onChange={() => toggleSetting(s.key)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
