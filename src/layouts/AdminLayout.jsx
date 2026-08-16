import { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, ShoppingBag, Users, Ticket, Package, Boxes, MessageSquare,
  UserCog, ShieldCheck, FileSpreadsheet, Bell, Activity, ScrollText, Settings,
  Sun, Moon, Search, Menu, X, LogOut, ExternalLink, User, Footprints, CreditCard, UserPlus, ChevronDown,
} from 'lucide-react';
import Dropdown, { DropdownItem } from '../components/ui/Dropdown';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { NOTIFICATIONS } from '../data/mockData';
import { cn, toFaDigits, relativeTime } from '../utils/format';

const NOTIF_ICONS = {
  order: ShoppingBag,
  stock: Boxes,
  user: UserPlus,
  payment: CreditCard,
  review: MessageSquare,
};

const NAV = [
  {
    title: 'نمای کلی',
    items: [
      { to: '/admin', label: 'داشبورد', icon: LayoutDashboard, end: true },
      { to: '/admin/analytics', label: 'تحلیل‌ها', icon: BarChart3 },
    ],
  },
  {
    title: 'فروش و مشتریان',
    items: [
      { to: '/admin/orders', label: 'سفارش‌ها', icon: ShoppingBag },
      { to: '/admin/customers', label: 'مشتریان', icon: Users },
      { to: '/admin/coupons', label: 'کوپن‌ها', icon: Ticket },
    ],
  },
  {
    title: 'کاتالوگ و بازخورد',
    items: [
      { to: '/admin/products', label: 'محصولات', icon: Package },
      { to: '/admin/inventory', label: 'موجودی', icon: Boxes },
      { to: '/admin/reviews', label: 'نظرات', icon: MessageSquare },
    ],
  },
  {
    title: 'سیستم و مدیریت',
    items: [
      { to: '/admin/users', label: 'کاربران', icon: UserCog },
      { to: '/admin/roles', label: 'نقش‌ها و دسترسی‌ها', icon: ShieldCheck },
      { to: '/admin/reports', label: 'گزارش‌ها', icon: FileSpreadsheet },
      { to: '/admin/notifications', label: 'اعلان‌ها', icon: Bell },
      { to: '/admin/activity', label: 'فعالیت‌ها', icon: Activity },
      { to: '/admin/logs', label: 'لاگ‌ها', icon: ScrollText },
      { to: '/admin/settings', label: 'تنظیمات', icon: Settings },
    ],
  },
];

export function PageHeader({ title, subtitle, actions, className }) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        <h1 className="font-morabba font-bold text-2xl text-foreground sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const toast = useToast();
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    toast.success('با موفقیت از حساب خارج شدید');
    navigate('/');
  };

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.info('همه اعلان‌ها خوانده شد');
  };

  const markRead = (id) => setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className="flex min-h-screen bg-background">
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-border/70 bg-card/95 backdrop-blur-xl transition-transform duration-300',
          'lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:bg-card',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow-sm">
              <Footprints size={22} />
            </span>
            <span>
              <span className="block font-morabba font-bold text-lg leading-tight text-foreground">کفشینو</span>
              <span className="block text-xs text-muted-foreground">پنل مدیریت</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted/50 lg:hidden"
            aria-label="بستن منو"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
          {NAV.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all',
                          isActive
                            ? 'bg-brand-gradient text-white shadow-glow-sm'
                            : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                        )
                      }
                    >
                      <Icon size={18} strokeWidth={2} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border/70 p-4">
          <div className="rounded-2xl bg-muted/40 p-3.5">
            <p className="text-xs font-medium text-foreground">نسخه پنل</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">کفشینو نسخه ۱.۰.۰ — مدیریت فروشگاه</p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border text-foreground transition-colors hover:border-brand-500 hover:text-brand-500 lg:hidden"
              aria-label="باز کردن منو"
            >
              <Menu size={20} />
            </button>

            <div className="relative hidden w-full max-w-sm md:block">
              <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input className="input-app pr-11" placeholder="جستجو در پنل مدیریت..." />
            </div>
            <button
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border text-foreground transition-colors hover:border-brand-500 hover:text-brand-500 md:hidden"
              aria-label="جستجو"
            >
              <Search size={19} />
            </button>

            <div className="ms-auto flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="grid h-10 w-10 place-items-center rounded-xl border border-border text-foreground transition-colors hover:border-brand-500 hover:text-brand-500"
                aria-label="تغییر تم"
              >
                {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
              </button>

              <Dropdown
                trigger={
                  <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-border text-foreground transition-colors hover:border-brand-500 hover:text-brand-500">
                    <Bell size={19} />
                    {unread > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {toFaDigits(unread)}
                      </span>
                    )}
                  </button>
                }
                menuClassName="w-[min(92vw,380px)] overflow-hidden p-0"
              >
                {({ close }) => (
                  <div>
                    <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                      <p className="text-sm font-semibold text-foreground">اعلان‌ها</p>
                      <button
                        onClick={markAllRead}
                        className="text-xs font-medium text-brand-600 transition-colors hover:text-brand-500 dark:text-brand-300"
                      >
                        خواندن همه
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifs.slice(0, 5).map((n) => {
                        const Icon = NOTIF_ICONS[n.type] || Bell;
                        return (
                          <button
                            key={n.id}
                            onClick={() => {
                              markRead(n.id);
                              close();
                            }}
                            className={cn(
                              'flex w-full items-start gap-3 border-b border-border/50 px-4 py-3 text-right transition-colors hover:bg-muted/30',
                              !n.read && 'bg-brand-500/5'
                            )}
                          >
                            <span
                              className={cn(
                                'mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl',
                                !n.read ? 'bg-brand-gradient text-white' : 'bg-muted text-muted-foreground'
                              )}
                            >
                              <Icon size={16} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center justify-between gap-2">
                                <span className="truncate text-sm font-medium text-foreground">{n.title}</span>
                                {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                              </span>
                              <span className="block truncate text-xs text-muted-foreground">{n.text}</span>
                              <span className="mt-1 block text-[11px] text-muted-foreground/70">
                                {relativeTime(n.date)}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <Link
                      to="/admin/notifications"
                      onClick={close}
                      className="block py-3 text-center text-sm font-medium text-brand-600 transition-colors hover:bg-muted/30 dark:text-brand-300"
                    >
                      مشاهده همه اعلان‌ها
                    </Link>
                  </div>
                )}
              </Dropdown>

              <Dropdown
                trigger={
                  <button className="flex items-center gap-2.5 rounded-xl border border-border p-1.5 pl-3 transition-colors hover:bg-muted/40">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-gradient font-morabba text-sm font-bold text-white">
                      {(user?.name || 'م').slice(0, 1)}
                    </span>
                    <span className="hidden text-right sm:block">
                      <span className="block text-sm font-medium leading-tight text-foreground">
                        {user?.name || 'مدیر کل'}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">مدیر سیستم</span>
                    </span>
                    <ChevronDown size={15} className="hidden text-muted-foreground sm:block" />
                  </button>
                }
              >
                {({ close }) => (
                  <div className="w-56">
                    <div className="mb-1 border-b border-border/70 px-3.5 py-3">
                      <p className="text-sm font-semibold text-foreground">{user?.name || 'مدیر کل'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || 'admin@kafshino.ir'}</p>
                    </div>
                    <DropdownItem
                      icon={User}
                      onClick={() => {
                        close();
                        navigate('/admin/settings');
                      }}
                    >
                      پروفایل من
                    </DropdownItem>
                    <DropdownItem
                      icon={Settings}
                      onClick={() => {
                        close();
                        navigate('/admin/settings');
                      }}
                    >
                      تنظیمات
                    </DropdownItem>
                    <DropdownItem icon={LogOut} danger onClick={handleLogout}>
                      خروج از حساب
                    </DropdownItem>
                  </div>
                )}
              </Dropdown>

              <Link
                to="/"
                className="hidden h-10 items-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-glow-sm transition-all hover:opacity-90 sm:inline-flex"
              >
                <ExternalLink size={16} />
                مشاهده فروشگاه
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
