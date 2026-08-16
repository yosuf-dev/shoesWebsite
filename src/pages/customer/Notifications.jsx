import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  AlertTriangle,
  UserPlus,
  CreditCard,
  Star,
  CheckCheck,
} from 'lucide-react';
import PageHeader from '../../components/customer/PageHeader';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../contexts/ToastContext';
import { NOTIFICATIONS } from '../../data/mockData';
import { relativeTime, toFaDigits, cn } from '../../utils/format';

const TYPE_ICONS = {
  order: { icon: ShoppingBag, color: 'text-brand-500 bg-brand-500/10' },
  stock: { icon: AlertTriangle, color: 'text-accent-500 bg-accent-500/10' },
  user: { icon: UserPlus, color: 'text-sky-500 bg-sky-500/10' },
  payment: { icon: CreditCard, color: 'text-emerald-500 bg-emerald-500/10' },
  review: { icon: Star, color: 'text-rose-500 bg-rose-500/10' },
};

const FILTERS = [
  { key: 'all', label: 'همه' },
  { key: 'unread', label: 'خوانده‌نشده' },
];

export default function Notifications() {
  const toast = useToast();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('همه اعلان‌ها خوانده شدند');
  };

  return (
    <div>
      <PageHeader
        eyebrow="اعلان‌ها"
        title="اعلان‌های من"
        description={`${toFaDigits(unreadCount)} اعلان خوانده‌نشده دارید.`}
        action={
          <Button variant="secondary" icon={CheckCheck} onClick={markAllRead} disabled={unreadCount === 0}>
            خواندن همه
          </Button>
        }
      />

      <div className="mb-5 inline-flex rounded-xl border border-border bg-surface p-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-all',
              filter === f.key
                ? 'bg-brand-gradient text-white shadow-glow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="اعلانی وجود ندارد"
          description={
            filter === 'unread'
              ? 'همه اعلان‌ها را خوانده‌اید. عالی است!'
              : 'هنوز اعلانی برای شما ثبت نشده است.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const conf = TYPE_ICONS[n.type] || TYPE_ICONS.order;
            const Icon = conf.icon;
            return (
              <div
                key={n.id}
                onClick={() => toggleRead(n.id)}
                className={cn(
                  'flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all duration-300',
                  n.read
                    ? 'border-border/60 bg-card/60 hover:bg-muted/30'
                    : 'border-brand-500/30 bg-brand-500/5 hover:bg-brand-500/10'
                )}
              >
                <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-2xl', conf.color)}>
                  <Icon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-foreground">{n.title}</p>
                    <span className="text-xs text-muted-foreground">{relativeTime(n.date)}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{n.text}</p>
                  {n.target && (
                    <Link
                      to={n.target}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 inline-block text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
                    >
                      مشاهده
                    </Link>
                  )}
                </div>
                {!n.read && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500 shadow-glow-sm" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
