import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Heart,
  Star,
  Wallet,
  MapPin,
  FileText,
  LifeBuoy,
  Bell,
  Settings,
  ShieldCheck,
  Ticket,
  ArrowLeft,
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/customer/PageHeader';
import { SkeletonTable } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ProductCard from '../../components/product/ProductCard';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { getUserOrders } from '../../services/authService';
import { ORDERS, PRODUCTS } from '../../data/mockData';
import { formatToman, formatFaDate, toFaDigits } from '../../utils/format';

const SHORTCUTS = [
  { to: '/panel/orders', label: 'سفارش‌های من', icon: Package },
  { to: '/panel/wishlist', label: 'علاقه‌مندی‌ها', icon: Heart },
  { to: '/panel/addresses', label: 'آدرس‌ها', icon: MapPin },
  { to: '/panel/invoices', label: 'فاکتورها', icon: FileText },
  { to: '/panel/tickets', label: 'تیکت‌های پشتیبانی', icon: LifeBuoy },
  { to: '/panel/notifications', label: 'اعلان‌ها', icon: Bell },
  { to: '/panel/settings', label: 'تنظیمات حساب', icon: Settings },
  { to: '/panel/security', label: 'امنیت حساب', icon: ShieldCheck },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const recommended = PRODUCTS.filter((p) => p.bestSeller).slice(0, 4);
  const recentOrders = orders.slice(0, 4);

  return (
    <div>
      <PageHeader
        eyebrow="داشبورد"
        title={`خوش آمدید، ${user?.name || 'کاربر عزیز'} 👋`}
        description="نمای کلی فعالیت‌های شما در کفشینو را ببینید؛ وضعیت سفارش‌ها، علاقه‌مندی‌ها و اطلاعات حساب."
        action={
          <Link
            to="/shop"
            className="group flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            خرید جدید
            <ArrowLeft size={17} className="transition-transform group-hover:-translate-x-1" />
          </Link>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="سفارش‌ها"
          value={toFaDigits(orders.length)}
          change={12}
          icon={Package}
          gradient="brand"
        />
        <StatCard
          title="علاقه‌مندی‌ها"
          value={toFaDigits(wishlist.length)}
          icon={Heart}
          gradient="rose"
        />
        <StatCard
          title="امتیاز باشگاه مشتریان"
          value={toFaDigits('۱٬۲۵۰')}
          change={5}
          icon={Star}
          gradient="accent"
        />
        <StatCard
          title="کیف پول"
          value={formatToman(2350000)}
          change={8}
          icon={Wallet}
          gradient="emerald"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="card-elevated overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div>
              <h2 className="font-morabba font-bold text-lg text-foreground">سفارش‌های اخیر</h2>
              <p className="text-xs text-muted-foreground">آخرین سفارش‌های ثبت‌شده شما</p>
            </div>
            <Link
              to="/panel/orders"
              className="flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
            >
              مشاهده همه
              <ArrowLeft size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="p-5">
              <SkeletonTable rows={4} cols={5} />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon="package"
                title="هنوز سفارشی ثبت نکرده‌اید"
                description="با اولین خرید، تاریخچه سفارش‌های شما اینجا نمایش داده می‌شود."
                action={
                  <Link
                    to="/shop"
                    className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow-sm"
                  >
                    رفتن به فروشگاه
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>شماره سفارش</th>
                    <th>تاریخ</th>
                    <th>وضعیت</th>
                    <th>تعداد اقلام</th>
                    <th>مبلغ</th>
                    <th>جزئیات</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
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
                      <td>
                        <Link
                          to={`/panel/orders/${o.id}`}
                          className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
                        >
                          مشاهده
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-elevated overflow-hidden">
          <div className="relative overflow-hidden p-5 text-white">
            <div className="absolute inset-0 bg-brand-gradient opacity-95" />
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 text-xl font-bold backdrop-blur">
                  {user?.name?.[0] || 'ک'}
                </span>
                <div>
                  <h3 className="font-morabba font-bold text-lg">{user?.name || 'کاربر کفشینو'}</h3>
                  <p className="text-sm text-white/85">{user?.email || '—'}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                  <p className="text-xs text-white/75">عضویت</p>
                  <p className="mt-0.5 font-semibold">{formatFaDate(user?.joinedAt)}</p>
                </div>
                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                  <p className="text-xs text-white/75">شهر</p>
                  <p className="mt-0.5 font-semibold">{user?.city || 'تهران'}</p>
                </div>
                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                  <p className="text-xs text-white/75">تعداد سفارش</p>
                  <p className="mt-0.5 font-semibold">
                    {toFaDigits(user?.ordersCount ?? orders.length)}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                  <p className="text-xs text-white/75">نقش</p>
                  <p className="mt-0.5 font-semibold">
                    {user?.role === 'admin' ? 'مدیر' : 'مشتری'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5">
            <p className="mb-3 text-sm font-semibold text-foreground">وضعیت حساب</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                حساب فعال
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Ticket size={15} className="text-brand-500" />
                تیکت باز: ۱ مورد
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Bell size={15} className="text-accent-500" />
                اعلان خوانده‌نشده: ۳ مورد
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-morabba font-bold text-lg text-foreground">پیشنهاد برای شما</h2>
            <p className="text-xs text-muted-foreground">بر اساس پرفروش‌ترین‌های کفشینو</p>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
          >
            مشاهده همه
            <ArrowLeft size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {recommended.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-morabba font-bold text-lg text-foreground">دسترسی سریع</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {SHORTCUTS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border/60 bg-card p-4 text-center shadow-softer transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-soft"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-gradient group-hover:text-white dark:text-brand-300">
                <item.icon size={20} />
              </span>
              <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
