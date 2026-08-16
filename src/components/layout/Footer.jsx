import { Link } from 'react-router-dom';
import {
  Instagram, Send, Linkedin, Phone, Mail, MapPin, Sparkles, Truck, ShieldCheck, RotateCcw, Headphones,
} from 'lucide-react';
import { CATEGORIES, BRANDS } from '../../data/mockData';

const SERVICES = [
  { icon: Truck, title: 'ارسال سریع', text: 'تحویل ۱ تا ۵ روز کاری' },
  { icon: RotateCcw, title: '۷ روز مرجوعی', text: 'ضمانت بازگشت وجه' },
  { icon: ShieldCheck, title: 'گارانتی اصالت', text: '۶ ماه ضمانت تعویض' },
  { icon: Headphones, title: 'پشتیبانی ۲۴/۷', text: 'پاسخگویی همیشگی' },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface/60">
      {/* خدمات */}
      <div className="container-app grid grid-cols-2 gap-4 border-b border-border/50 py-10 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <div key={s.title} className="flex items-center gap-3.5 rounded-2xl border border-border/50 bg-card p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow-sm">
              <s.icon size={20} />
            </span>
            <div>
              <p className="font-medium text-sm text-foreground">{s.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* لینک‌ها */}
      <div className="container-app grid grid-cols-2 gap-8 py-12 md:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-gradient text-white">
              <Sparkles size={20} />
            </span>
            <span className="font-morabba font-extrabold text-2xl text-foreground">کفشینو</span>
          </Link>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            فروشگاه اینترنتی کفشینو با هدف ارائه کفش‌های اصل، باکیفیت و در عین حال لوکس، تجربه‌ای بی‌نظیر از خرید آنلاین را برای شما فراهم کرده است.
          </p>
          <div className="mt-5 flex gap-2.5">
            {[Instagram, Send, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:border-brand-500 hover:text-brand-500"
                aria-label="شبکه اجتماعی"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-morabba font-bold text-base text-foreground">دسته‌بندی‌ها</h4>
          <ul className="space-y-2.5">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link to={`/shop?category=${c.slug}`} className="text-sm text-muted-foreground transition-colors hover:text-brand-500">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-morabba font-bold text-base text-foreground">برندها</h4>
          <ul className="space-y-2.5">
            {BRANDS.slice(0, 6).map((b) => (
              <li key={b.id}>
                <Link to={`/shop?brand=${b.slug}`} className="text-sm text-muted-foreground transition-colors hover:text-brand-500">
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-morabba font-bold text-base text-foreground">دسترسی سریع</h4>
          <ul className="space-y-2.5">
            <li><Link to="/shop" className="text-sm text-muted-foreground hover:text-brand-500">فروشگاه</Link></li>
            <li><Link to="/wishlist" className="text-sm text-muted-foreground hover:text-brand-500">علاقه‌مندی‌ها</Link></li>
            <li><Link to="/compare" className="text-sm text-muted-foreground hover:text-brand-500">مقایسه</Link></li>
            <li><Link to="/panel" className="text-sm text-muted-foreground hover:text-brand-500">پنل کاربری</Link></li>
            <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-brand-500">سوالات متداول</Link></li>
            <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-brand-500">مجله کفشینو</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-morabba font-bold text-base text-foreground">تماس با ما</h4>
          <ul className="space-y-3.5">
            <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <MapPin size={17} className="mt-0.5 shrink-0 text-brand-500" />
              تهران، خیابان ولیعصر، مرکز خرید کفشینو
            </li>
            <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Phone size={17} className="shrink-0 text-brand-500" />
              ۰۲۱-۹۱۰۰۹۱۰۰
            </li>
            <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Mail size={17} className="shrink-0 text-brand-500" />
              info@kafshino.ir
            </li>
          </ul>
        </div>
      </div>

      {/* زیرنویس */}
      <div className="border-t border-border/50">
        <div className="container-app flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().toLocaleDateString('fa-IR', { year: 'numeric' })} کفشینو — تمامی حقوق محفوظ است.</p>
          <div className="flex items-center gap-4">
            <Link to="#" className="hover:text-brand-500">قوانین و مقررات</Link>
            <Link to="#" className="hover:text-brand-500">حریم خصوصی</Link>
            <span>نماد اعتماد الکترونیکی</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
