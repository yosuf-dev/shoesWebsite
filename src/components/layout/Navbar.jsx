import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Heart, Scale, Moon, Sun, User, Menu, X,
  ChevronDown, LayoutDashboard, LogOut, Package, Settings, Sparkles,
} from 'lucide-react';
import SearchBar from './SearchBar';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCompare } from '../../contexts/CompareContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { CATEGORIES, BRANDS } from '../../data/mockData';
import { toFaDigits, cn } from '../../utils/format';

function Logo({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5 shrink-0">
      <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow-sm">
        <Sparkles size={20} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-morabba font-extrabold text-2xl text-foreground">کفشینو</span>
        <span className="mt-1 text-[10px] font-medium text-muted-foreground">KAFSHINO</span>
      </span>
    </Link>
  );
}

function ActionIcon({ count, children, label }) {
  return (
    <div className="relative">
      {children}
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -left-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent-gradient px-1 text-[10px] font-bold text-white shadow"
        >
          {toFaDigits(count)}
        </motion.span>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { count, openCart } = useCart();
  const { wishlist } = useWishlist();
  const { compareList } = useCompare();
  const { user, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMega, setOpenMega] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkCls = ({ isActive }) =>
    cn(
      'relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors',
      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
    );

  return (
    <>
      <header className="sticky top-0 z-[90]">
      {/* نوار اعلامیه */}
      <div className="bg-foreground text-background">
        <div className="container-app flex h-9 items-center justify-between text-xs">
          <p className="flex items-center gap-2">
            <span className="hidden sm:inline">ارسال رایگان برای سفارش‌های بالای ۲ میلیون تومان</span>
            <span className="sm:hidden">ارسال رایگان بالای ۲ میلیون</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-background/70">پشتیبانی: ۰۲۱-۹۱۰۰۹۱۰۰</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" />
              تخفیف‌های تابستانه تا ۴۰٪
            </span>
          </div>
        </div>
      </div>

      {/* نوار اصلی */}
      <div
        className={cn(
          'relative z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl transition-shadow duration-300',
          scrolled && 'shadow-soft'
        )}
      >
        <div className="container-app flex h-[74px] items-center gap-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl text-foreground hover:bg-muted/40 lg:hidden"
            aria-label="منو"
          >
            <Menu size={22} />
          </button>

          <Logo />

          {/* جستجو */}
          <div className="hidden flex-1 md:block lg:px-8">
            <SearchBar onNavigate={() => setMobileOpen(false)} />
          </div>

          {/* اکشن‌ها */}
          <div className="flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-xl text-foreground transition-colors hover:bg-muted/40"
              aria-label="تغییر تم"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link
              to="/compare"
              className="hidden sm:grid h-10 w-10 place-items-center rounded-xl text-foreground transition-colors hover:bg-muted/40"
              aria-label="مقایسه"
            >
              <ActionIcon count={compareList.length} label="مقایسه">
                <Scale size={20} />
              </ActionIcon>
            </Link>

            <Link
              to="/wishlist"
              className="hidden sm:grid h-10 w-10 place-items-center rounded-xl text-foreground transition-colors hover:bg-muted/40"
              aria-label="علاقه‌مندی‌ها"
            >
              <ActionIcon count={wishlist.length} label="علاقه‌مندی‌ها">
                <Heart size={20} />
              </ActionIcon>
            </Link>

            <button
              onClick={openCart}
              className="relative grid h-10 w-10 place-items-center rounded-xl text-foreground transition-colors hover:bg-muted/40"
              aria-label="سبد خرید"
            >
              <ActionIcon count={count} label="سبد خرید">
                <ShoppingBag size={20} />
              </ActionIcon>
            </button>

            {/* کاربر */}
            {user ? (
              <Dropdown
                trigger={
                  <button className="flex h-10 items-center gap-2 rounded-xl border border-border px-2.5 hover:bg-muted/40 transition-colors">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-gradient text-xs font-bold text-white">
                      {user.name?.[0] || 'ک'}
                    </span>
                    <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
                  </button>
                }
                align="left"
              >
                <div className="border-b border-border/60 px-3.5 py-3">
                  <p className="font-medium text-sm text-foreground">{user.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="pt-1.5">
                  {isAdmin && (
                    <DropdownItem
                      icon={LayoutDashboard}
                      onClick={() => navigate('/admin')}
                      active={location.pathname.startsWith('/admin')}
                    >
                      داشبورد مدیریت
                    </DropdownItem>
                  )}
                  <DropdownItem icon={User} onClick={() => navigate('/panel')}>
                    پنل کاربری
                  </DropdownItem>
                  <DropdownItem icon={Package} onClick={() => navigate('/panel/orders')}>
                    سفارش‌های من
                  </DropdownItem>
                  <DropdownItem icon={Settings} onClick={() => navigate('/panel/settings')}>
                    تنظیمات حساب
                  </DropdownItem>
                  <div className="my-1.5 border-t border-border/60" />
                  <DropdownItem icon={LogOut} danger onClick={logout}>
                    خروج از حساب
                  </DropdownItem>
                </div>
              </Dropdown>
            ) : (
              <Link
                to="/login"
                className="hidden items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-all hover:opacity-90 md:flex"
              >
                <User size={17} />
                ورود / ثبت‌نام
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* نوار دسته‌بندی با منوی مگا */}
      <div
        className={cn(
          'hidden border-b border-border/40 bg-surface/70 backdrop-blur-xl lg:block transition-all duration-300',
          scrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'
        )}
      >
        <div className="container-app flex items-center gap-1">
          <NavLink to="/shop" end className={navLinkCls}>
            فروشگاه
          </NavLink>
          <NavLink to="/shop?gender=men" className={navLinkCls}>
            مردانه
          </NavLink>
          <NavLink to="/shop?gender=women" className={navLinkCls}>
            زنانه
          </NavLink>
          <NavLink to="/shop?gender=kids" className={navLinkCls}>
            بچه‌گانه
          </NavLink>

          {/* منوی مگا دسته‌بندی‌ها */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMega('categories')}
            onMouseLeave={() => setOpenMega(null)}
          >
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              دسته‌بندی‌ها
              <ChevronDown size={14} className={cn('transition-transform', openMega === 'categories' && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {openMega === 'categories' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full z-50 w-[560px] rounded-3xl border border-border/60 bg-card p-5 shadow-lift"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((c) => (
                      <Link
                        key={c.id}
                        to={`/shop?category=${c.slug}`}
                        className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-muted/40"
                      >
                        <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                          <span className="text-lg">👟</span>
                        </span>
                        <span>
                          <span className="block font-medium text-sm text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-300">
                            {c.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">{c.description}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-border/60 pt-4">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">برندهای محبوب</p>
                    <div className="flex flex-wrap gap-2">
                      {BRANDS.map((b) => (
                        <Link
                          key={b.id}
                          to={`/shop?brand=${b.slug}`}
                          className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground transition-colors hover:border-brand-500 hover:text-brand-500"
                        >
                          {b.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* منوی مگا فروش ویژه */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMega('deals')}
            onMouseLeave={() => setOpenMega(null)}
          >
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-accent-500 transition-colors hover:text-accent-400">
              فروش ویژه
              <ChevronDown size={14} className={cn('transition-transform', openMega === 'deals' && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {openMega === 'deals' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full z-50 w-72 rounded-3xl border border-border/60 bg-card p-3 shadow-lift"
                >
                  <Link to="/shop?sort=discount" className="flex items-center gap-3 rounded-2xl p-3 hover:bg-muted/40">
                    <span className="text-xl">🔥</span>
                    <span className="text-sm font-medium text-foreground">کالکشن تخفیف‌دار</span>
                  </Link>
                  <Link to="/shop?availability=in-stock&sort=newest" className="flex items-center gap-3 rounded-2xl p-3 hover:bg-muted/40">
                    <span className="text-xl">✨</span>
                    <span className="text-sm font-medium text-foreground">جدیدترین‌ها</span>
                  </Link>
                  <Link to="/shop?category=running" className="flex items-center gap-3 rounded-2xl p-3 hover:bg-muted/40">
                    <span className="text-xl">🏃</span>
                    <span className="text-sm font-medium text-foreground">راهنمای کفش رانینگ</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/faq" className={navLinkCls}>
            سوالات متداول
          </NavLink>
          <NavLink to="/blog" className={navLinkCls}>
            مجله کفشینو
          </NavLink>
          <NavLink to="/contact" className={navLinkCls}>
            تماس با ما
          </NavLink>
        </div>
      </div>

      {/* منوی موبایل */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[95] bg-slate-950/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed right-0 top-0 z-[100] flex h-full w-[300px] flex-col bg-card p-5 shadow-lift lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <Logo onClick={() => setMobileOpen(false)} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl hover:bg-muted/40"
                  aria-label="بستن منو"
                >
                  <X size={20} />
                </button>
              </div>
              <SearchBar onNavigate={() => setMobileOpen(false)} />
              <nav className="mt-6 flex flex-col gap-1">
                {[
                  { to: '/shop', label: 'فروشگاه' },
                  { to: '/shop?gender=men', label: 'مردانه' },
                  { to: '/shop?gender=women', label: 'زنانه' },
                  { to: '/shop?gender=kids', label: 'بچه‌گانه' },
                  { to: '/wishlist', label: 'علاقه‌مندی‌ها' },
                  { to: '/compare', label: 'مقایسه محصولات' },
                  { to: '/faq', label: 'سوالات متداول' },
                  { to: '/contact', label: 'تماس با ما' },
                ].map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
                  >
                    {l.label}
                  </Link>
                ))}
                {!user && (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background"
                  >
                    <User size={17} /> ورود / ثبت‌نام
                  </Link>
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      </header>
    </>
  );
}
