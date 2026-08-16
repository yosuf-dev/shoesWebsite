import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  FileText,
  LifeBuoy,
  Bell,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  Sun,
  Moon,
  ShoppingBag,
  Sparkles,
  Home,
} from 'lucide-react';
import Drawer from '../components/ui/Drawer';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toFaDigits, cn } from '../utils/format';

const NAV_GROUPS = [
  {
    label: 'منوی اصلی',
    items: [
      { to: '/panel', end: true, label: 'نمای کلی', icon: LayoutDashboard },
      { to: '/panel/orders', label: 'سفارش‌ها', icon: Package },
      { to: '/panel/wishlist', label: 'علاقه‌مندی‌ها', icon: Heart },
      { to: '/panel/addresses', label: 'آدرس‌ها', icon: MapPin },
      { to: '/panel/invoices', label: 'فاکتورها', icon: FileText },
    ],
  },
  {
    label: 'پشتیبانی و تنظیمات',
    items: [
      { to: '/panel/tickets', label: 'تیکت‌های پشتیبانی', icon: LifeBuoy },
      { to: '/panel/notifications', label: 'اعلان‌ها', icon: Bell },
      { to: '/panel/settings', label: 'تنظیمات حساب', icon: Settings },
      { to: '/panel/security', label: 'امنیت', icon: ShieldCheck },
    ],
  },
];

function getPageTitle(pathname) {
  if (pathname === '/panel' || pathname === '/panel/') return 'نمای کلی';
  if (pathname.startsWith('/panel/orders/')) return 'جزئیات سفارش';
  if (pathname.startsWith('/panel/orders')) return 'سفارش‌های من';
  if (pathname.startsWith('/panel/wishlist')) return 'علاقه‌مندی‌ها';
  if (pathname.startsWith('/panel/addresses')) return 'آدرس‌های من';
  if (pathname.startsWith('/panel/invoices')) return 'فاکتورها';
  if (pathname.startsWith('/panel/tickets')) return 'تیکت‌های پشتیبانی';
  if (pathname.startsWith('/panel/notifications')) return 'اعلان‌ها';
  if (pathname.startsWith('/panel/settings')) return 'تنظیمات حساب';
  if (pathname.startsWith('/panel/security')) return 'امنیت';
  if (pathname.startsWith('/panel/track')) return 'پیگیری سفارش';
  return 'پنل کاربری';
}

function SidebarBody({ onNavigate = () => {}, onLogout = () => {} }) {
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b border-border/60 px-5 py-6">
        <Link to="/" onClick={onNavigate} className="flex items-center gap-2.5">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow-sm">
            <Sparkles size={22} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-morabba font-extrabold text-xl text-foreground">کفشینو</span>
            <span className="mt-1 text-[10px] font-medium text-muted-foreground">پنل کاربری</span>
          </span>
        </Link>
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-4 py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-6 last:mb-0">
            <p className="mb-2 px-3 text-[11px] font-semibold text-muted-foreground/70">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
                      isActive
                        ? 'bg-brand-gradient text-white shadow-glow-sm'
                        : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    )
                  }
                >
                  <item.icon size={18} strokeWidth={2.2} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border/60 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-surface p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-sm font-bold text-white">
            {user?.name?.[0] || 'ک'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {user?.name || 'کاربر کفشینو'}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user?.email || '—'}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/20"
        >
          <LogOut size={17} />
          خروج از حساب
        </button>
      </div>
    </div>
  );
}

export default function CustomerLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { count, openCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-l border-border/60 bg-card/60 backdrop-blur-xl lg:block">
        <SidebarBody onLogout={handleLogout} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl text-foreground transition-colors hover:bg-muted/40 lg:hidden"
              aria-label="منوی کاربری"
            >
              <Menu size={22} />
            </button>

            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow-sm lg:hidden">
              <Sparkles size={18} />
            </span>

            <div className="min-w-0 flex-1">
              <h1 className="truncate font-morabba font-bold text-lg text-foreground sm:text-xl">
                {title}
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">پنل کاربری کفشینو</p>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={toggleTheme}
                className="grid h-10 w-10 place-items-center rounded-xl text-foreground transition-colors hover:bg-muted/40"
                aria-label="تغییر تم"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={openCart}
                className="relative grid h-10 w-10 place-items-center rounded-xl text-foreground transition-colors hover:bg-muted/40"
                aria-label="سبد خرید"
              >
                <ShoppingBag size={20} />
                {count > 0 && (
                  <span className="absolute -left-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent-gradient px-1 text-[10px] font-bold text-white shadow">
                    {toFaDigits(count)}
                  </span>
                )}
              </button>

              <Link
                to="/"
                className="hidden h-10 w-10 place-items-center rounded-xl text-foreground transition-colors hover:bg-muted/40 md:grid"
                aria-label="بازگشت به فروشگاه"
              >
                <Home size={20} />
              </Link>

              <div className="hidden items-center gap-2 rounded-xl border border-border px-3 py-1.5 lg:flex">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-gradient text-xs font-bold text-white">
                  {user?.name?.[0] || 'ک'}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-foreground">{user?.name || 'کاربر'}</p>
                  <p className="text-[10px] text-muted-foreground">خوش آمدید</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        side="right"
        size="lg"
        title="منوی کاربری"
      >
        <SidebarBody onNavigate={() => setMobileOpen(false)} onLogout={handleLogout} />
      </Drawer>
    </div>
  );
}
