import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Clock3, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';
import SectionHeading from '../components/ui/SectionHeading';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { toFaDigits } from '../utils/format';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'راهنمای انتخاب کفش رانینگ بر اساس نوع دویدن شما',
    summary: 'کفش مناسب برای دویدن روی آسفالت با دویدن روی تردمیل تفاوت دارد. در این مقاله به شما می‌گوییم با توجه به سبک دویدن‌تان، کدام کفش برایتان بهتر است.',
    category: 'راهنمای خرید',
    date: '۱۴۰۵/۰۵/۱۰',
    readTime: '۸ دقیقه',
    gradient: 'from-brand-500 to-brand-700',
    icon: '👟',
  },
  {
    id: 2,
    title: '۷ راز تشخیص کفش اسنیکر اصل از تقلبی',
    summary: 'با افزایش فروش کفش‌های تقلبی در بازار، تشخیص اصل از بدل کار هر کسی نیست. این ۷ نشانه را یاد بگیرید تا در دام خریداران سودجو نیفتید.',
    category: 'راهنمای خرید',
    date: '۱۴۰۵/۰۵/۰۵',
    readTime: '۶ دقیقه',
    gradient: 'from-accent-500 to-accent-700',
    icon: '🔍',
  },
  {
    id: 3,
    title: 'چرم طبیعی یا مصنوعی؟ انتخاب هوشمندانه برای کفش شما',
    summary: 'چرم طبیعی دوام بیشتری دارد اما نگهداری آن سخت‌تر است؛ چرم مصنوعی مقرون‌به‌صرفه‌تر است اما عمر کمتری دارد. هر آنچه باید بدانید اینجاست.',
    category: 'راهنمای خرید',
    date: '۱۴۰۵/۰۴/۲۸',
    readTime: '۵ دقیقه',
    gradient: 'from-rose-500 to-fuchsia-600',
    icon: '👜',
  },
  {
    id: 4,
    title: 'چطور از کفش‌های چرمی به‌درستی مراقبت کنیم؟',
    summary: 'کفش چرمی با مراقبت درست سال‌ها زیبایی خود را حفظ می‌کند. از واکس زدن تا دوری از رطوبت؛ نکات طلایی نگهداری را اینجا بخوانید.',
    category: 'نگهداری',
    date: '۱۴۰۵/۰۴/۲۰',
    readTime: '۴ دقیقه',
    gradient: 'from-emerald-500 to-teal-600',
    icon: '🧴',
  },
  {
    id: 5,
    title: 'ترندهای کفش ۲۰۲۶؛ چه استایلی در سال جدید ترند است؟',
    summary: 'از کفش‌های باله تا اسنیکرهای نئون؛ مرور جامعی بر محبوب‌ترین ترندهای کفش امسال که استایل شما را متحول می‌کند.',
    category: 'مد و فشن',
    date: '۱۴۰۵/۰۴/۱۲',
    readTime: '۷ دقیقه',
    gradient: 'from-sky-500 to-indigo-600',
    icon: '✨',
  },
  {
    id: 6,
    title: 'کفش مناسب پیاده‌روی روزانه؛ راهنمای خرید برای سلامتی',
    summary: 'پیاده‌روی یکی از بهترین ورزش‌هاست اما بدون کفش مناسب می‌تواند آسیب‌زا باشد. ویژگی‌های یک کفش پیاده‌روی ایده‌آل را بشناسید.',
    category: 'سلامت',
    date: '۱۴۰۵/۰۴/۰۵',
    readTime: '۶ دقیقه',
    gradient: 'from-orange-500 to-red-600',
    icon: '🚶',
  },
];

export default function BlogPage() {
  return (
    <div className="container-app py-8 lg:py-12">
      <Breadcrumb items={['مجله کفشینو']} className="mb-6" />

      <SectionHeading
        eyebrow="مجله کفشینو"
        title="تازه‌ترین مقالات"
        subtitle="راهنماهای خرید، نکات نگهداری و تازه‌ترین اخبار دنیای کفش و استایل را در مجله کفشینو دنبال کنید."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group overflow-hidden rounded-3xl border border-border/60 bg-card shadow-softer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
          >
            <div className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${post.gradient}`}>
              <span className="text-6xl transition-transform duration-500 group-hover:scale-125">{post.icon}</span>
              <span className="absolute right-4 top-4">
                <Badge variant="dark" className="bg-black/25 text-white border-white/20 backdrop-blur">
                  {post.category}
                </Badge>
              </span>
            </div>

            <div className="p-5">
              <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-brand-500" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock3 size={14} className="text-brand-500" />
                  مطالعه {toFaDigits(post.readTime)}
                </span>
              </div>

              <h3 className="font-morabba font-semibold text-lg leading-7 text-foreground transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
                {post.title}
              </h3>
              <p className="mt-2 truncate-3 text-sm leading-7 text-muted-foreground">{post.summary}</p>

              <Link
                to="#"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:gap-2.5 dark:text-brand-300"
              >
                <ArrowLeft size={16} />
                ادامه مطلب
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl border border-border/60 bg-surface/70 p-8 text-center sm:flex-row sm:p-10 sm:text-right">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow-sm">
            <BookOpen size={26} />
          </span>
          <div>
            <h3 className="font-morabba font-bold text-xl text-foreground">پیشنهاد جذاب در انتظار شماست</h3>
            <p className="mt-1 text-sm text-muted-foreground">محصولات منتخب کارشناسان کفشینو را از دست ندهید.</p>
          </div>
        </div>
        <Link to="/shop">
          <Button icon={Sparkles}>مشاهده محصولات منتخب</Button>
        </Link>
      </div>
    </div>
  );
}
