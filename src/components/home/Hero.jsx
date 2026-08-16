import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Star, Truck, ShoppingBag } from 'lucide-react';
import ProductImage from '../ui/ProductImage';
import { toFaDigits } from '../../utils/format';
import { PRODUCTS } from '../../data/mockData';

const heroProduct = PRODUCTS.find((p) => p.slug === 'nike-air-max-2026') || PRODUCTS[0];

function FloatingCard({ className, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      className={`absolute z-20 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-mesh dark:bg-dark-mesh">
      <div className="container-app grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        {/* متن */}
        <div className="relative z-10 text-center lg:text-right">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-300"
          >
            <Sparkles size={14} />
            کالکشن پاییز ۲۰۲۶ هم‌اکنون
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 font-morabba font-extrabold leading-[1.15] text-foreground text-hero"
          >
            قدم‌هایت را
            <br />
            با <span className="bg-gradient-to-l from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-300 dark:to-brand-500">کفشینو</span>
            {' '}لوکس کن
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mx-auto mt-6 max-w-lg text-base leading-8 text-muted-foreground lg:mx-0"
          >
            تجربه‌ای بی‌نظیر از خرید کفش اصل با گارانتی اصالت؛ کالکشن جدید اسنیکرهای لوکس با
            طراحی مدرن و کیفیت جهانی در یک‌جا برای شما.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <Link
              to="/shop"
              className="btn-gradient group inline-flex h-13 items-center gap-2 rounded-2xl px-8 py-3.5 text-base font-semibold"
            >
              <ShoppingBag size={20} />
              خرید کنید
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1.5" />
            </Link>
            <Link
              to="/shop?sort=discount"
              className="inline-flex h-13 items-center gap-2 rounded-2xl border-2 border-foreground px-8 py-3.5 text-base font-semibold text-foreground transition-all hover:bg-foreground hover:text-background"
            >
              مشاهده تخفیف‌ها
            </Link>
          </motion.div>

          {/* آمار */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-8 lg:justify-start"
          >
            {[
              { value: '+۲۵K', label: 'مشتری راضی' },
              { value: '+۴۸۰', label: 'مدل کفش' },
              { value: '۴.۹', label: 'امتیاز رضایت' },
            ].map((s) => (
              <div key={s.label} className="text-center lg:text-right">
                <p className="font-morabba font-bold text-2xl text-foreground">{s.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* تصویر */}
        <div className="relative mx-auto w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, type: 'spring', stiffness: 120 }}
            className="relative"
          >
            {/* حلقه‌های تزئینی */}
            <div className="absolute inset-0 -z-0">
              <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-brand-500/20 animate-spin-slow" />
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gradient opacity-15 blur-3xl animate-float" />
            </div>

            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
              className="relative z-10"
            >
              <ProductImage
                product={heroProduct}
                className="mx-auto w-full max-w-md drop-shadow-2xl"
              />
            </motion.div>

            {/* کارت شناور — تخفیف */}
            <FloatingCard className="-right-2 top-8 hidden md:block lg:-right-6" delay={0.5}>
              <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lift">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-gradient text-white">
                  <span className="font-morabba font-extrabold text-sm">٪{toFaDigits(heroProduct.discountPercent)}</span>
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground">تخفیف ویژه</p>
                  <p className="text-[11px] text-muted-foreground">فقط برای امروز</p>
                </div>
              </div>
            </FloatingCard>

            {/* کارت شناور — امتیاز */}
            <FloatingCard className="-left-2 top-1/4 hidden md:block lg:-left-6" delay={0.65}>
              <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lift">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient text-white">
                  <Star size={18} fill="currentColor" />
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground">امتیاز {toFaDigits(heroProduct.rating)} از ۵</p>
                  <p className="text-[11px] text-muted-foreground">بر اساس {toFaDigits(heroProduct.reviewCount)} نظر</p>
                </div>
              </div>
            </FloatingCard>

            {/* کارت شناور — ارسال */}
            <FloatingCard className="-bottom-2 left-1/4 hidden sm:block" delay={0.8}>
              <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lift">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 text-white">
                  <Truck size={18} />
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground">ارسال رایگان</p>
                  <p className="text-[11px] text-muted-foreground">برای سفارش‌های بالای ۲ میلیون</p>
                </div>
              </div>
            </FloatingCard>
          </motion.div>
        </div>
      </div>

      {/* موج انتهایی */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <svg viewBox="0 0 1440 70" className="w-full text-background dark:text-background" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,30 C1260,45 1380,50 1440,45 L1440,70 L0,70 Z" />
        </svg>
      </div>
    </section>
  );
}
